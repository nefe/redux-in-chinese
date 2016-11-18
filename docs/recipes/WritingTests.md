# 编写测试

因为你写的大部分 Redux 代码都是些函数，而且大部分是纯函数，所以很好测，不需要模拟。

### 设置

我们建议用 [Jest](http://facebook.github.io/jest/) 作为测试引擎。  
注意因为是在 node 环境下运行，所以你不能访问 DOM。

```
npm install --save-dev jest
```

若想结合 [Babel](http://babeljs.io) 使用，你需要安装 `babel-jest` ：

```
npm install --save-dev babel-jest
```
并且在 `.babelrc` 中启用 ES2015 的功能 ：

```js
{
  "presets": ["es2015"]
}
```
然后，在 `package.json` 的 `scripts` 里加入这一段：

```js
{
  ...
  "scripts": {
    ...
    "test": "jest",
    "test:watch": "npm test -- --watch"
  },
  ...
}
```

然后运行 `npm test` 就能单次运行了，或者也可以使用 `npm run test:watch` 在每次有文件改变时自动执行测试。

### Action 创建函数 (Action Creators)

Redux 里的 action 创建函数是会返回普通对象的函数。在测试 action 创建函数的时候我们想要测试是否调用了正确的 action 创建函数，还有是否返回了正确的 action。

#### 示例

```js
export function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text
  }
}
```
可以这样测试：

```js
import * as actions from '../../actions/TodoActions'
import * as types from '../../constants/ActionTypes'

describe('actions', () => {
  it('should create an action to add a todo', () => {
    const text = 'Finish docs'
    const expectedAction = {
      type: types.ADD_TODO,
      text
    }
    expect(actions.addTodo(text)).toEqual(expectedAction)
  })
})
```

### 异步 Action 创建函数

对于使用 [Redux Thunk](https://github.com/gaearon/redux-thunk) 或其它中间件的异步 action 创建函数，最好完全模拟 Redux store 来测试。 你可以使用 [redux-mock-store](https://github.com/arnaudbenard/redux-mock-store) 把 middleware 应用到模拟的 store。也可以使用 [nock](https://github.com/pgte/nock) 来模拟 HTTP 请求。

#### 示例

```js
import fetch from 'isomorphic-fetch';

function fetchTodosRequest() {
  return {
    type: FETCH_TODOS_REQUEST
  }
}

function fetchTodosSuccess(body) {
  return {
    type: FETCH_TODOS_SUCCESS,
    body
  }
}

function fetchTodosFailure(ex) {
  return {
    type: FETCH_TODOS_FAILURE,
    ex
  }
}

export function fetchTodos() {
  return dispatch => {
    dispatch(fetchTodosRequest())
    return fetch('http://example.com/todos')
      .then(res => res.json())
      .then(json => dispatch(fetchTodosSuccess(json.body)))
      .catch(ex => dispatch(fetchTodosFailure(ex)))
  }
}
```

可以这样测试:

```js
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../actions/TodoActions'
import * as types from '../../constants/ActionTypes'
import nock from 'nock'
import expect from 'expect' // 你可以使用任何测试库

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('creates FETCH_TODOS_SUCCESS when fetching todos has been done', () => {
    nock('http://example.com/')
      .get('/todos')
      .reply(200, { body: { todos: ['do something'] }})

    const expectedActions = [
      { type: types.FETCH_TODOS_REQUEST },
      { type: types.FETCH_TODOS_SUCCESS, body: { todos: ['do something']  } }
    ]
    const store = mockStore({ todos: [] })

    return store.dispatch(actions.fetchTodos())
      .then(() => { // 异步 actions 的返回
        expect(store.getActions()).toEqual(expectedActions)
      })
  })
})
```

### Reducers

Reducer 把 action 应用到之前的 state，并返回新的 state。测试如下。

#### 示例

```js
import { ADD_TODO } from '../constants/ActionTypes'

const initialState = [
  {
    text: 'Use Redux',
    completed: false,
    id: 0
  }
]

export default function todos(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        {
          id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
          completed: false,
          text: action.text
        },
        ...state
      ]

    default:
      return state
  }
}
```
可以这样测试:

```js
import reducer from '../../reducers/todos'
import * as types from '../../constants/ActionTypes'

describe('todos reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual([
      {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ])
  })

  it('should handle ADD_TODO', () => {
    expect(
      reducer([], {
        type: types.ADD_TODO,
        text: 'Run the tests'
      })
    ).toEqual(
      [
        {
          text: 'Run the tests',
          completed: false,
          id: 0
        }
      ]
    )

    expect(
      reducer(
        [
          {
            text: 'Use Redux',
            completed: false,
            id: 0
          }
        ],
        {
          type: types.ADD_TODO,
          text: 'Run the tests'
        }
      )
    ).toEqual(
      [
        {
          text: 'Run the tests',
          completed: false,
          id: 1
        },
        {
          text: 'Use Redux',
          completed: false,
          id: 0
        }
      ]
    )
  })
})
```

### Components

React components 的优点是，一般都很小且依赖于 props 。因此测试起来很简便。

首先，安装 [Enzyme](http://airbnb.io/enzyme/) 。 Enzyme 底层使用了 [React Test Utilities](https://facebook.github.io/react/docs/test-utils.html) ，但是更方便、更易读，而且更强大。

```
npm install --save-dev enzyme
```

要测 components ，我们要创建一个叫 `setup()` 的辅助方法，用来把模拟过的（stubbed）回调函数当作 props 传入，然后使用 [React 浅渲染](https://facebook.github.io/react/docs/test-utils.html#shallow-rendering) 来渲染组件。这样就可以依据 “是否调用了回调函数” 的断言来写独立的测试。

#### 示例

```js
import React, { PropTypes, Component } from 'react'
import TodoTextInput from './TodoTextInput'

class Header extends Component {
  handleSave(text) {
    if (text.length !== 0) {
      this.props.addTodo(text)
    }
  }

  render() {
    return (
      <header className='header'>
          <h1>todos</h1>
          <TodoTextInput newTodo={true}
                         onSave={this.handleSave.bind(this)}
                         placeholder='What needs to be done?' />
      </header>
    )
  }
}

Header.propTypes = {
  addTodo: PropTypes.func.isRequired
}

export default Header
```

可以这样测试:

```js
import React from 'react'
import { shallow } from 'enzyme'
import Header from '../../components/Header'

function setup() {
  const props = {
    addTodo: jest.fn()
  }

  const enzymeWrapper = shallow(<Header {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

describe('components', () => {
  describe('Header', () => {
    it('should render self and subcomponents', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find('header').hasClass('header')).toBe(true)

      expect(enzymeWrapper.find('h1').text()).toBe('todos')

      const todoInputProps = enzymeWrapper.find('TodoTextInput').props()
      expect(todoInputProps.newTodo).toBe(true)
      expect(todoInputProps.placeholder).toEqual('What needs to be done?')
    })

    it('should call addTodo if length of text is greater than 0', () => {
      const { enzymeWrapper, props } = setup()
      const input = enzymeWrapper.find('TodoTextInput')
      input.props().onSave('')
      expect(props.addTodo.mock.calls.length).toBe(0)
      input.props().onSave('Use Redux')
      expect(props.addTodo.mock.calls.length).toBe(1)
    })
  })
})
```

### 连接组件

如果你使用了 [React Redux](https://github.com/rackt/react-redux), 可能你也同时在使用类似 [`connect()`](https://github.com/rackt/react-redux#connectmapstatetoprops-mapdispatchtoprops-mergeprops) 的 [higher-order components](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750) ，将 Redux state 注入到常见的 React 组件中。

请看这个 `App` 组件:

```js
import { connect } from 'react-redux'

class App extends Component { /* ... */ }

export default connect(mapStateToProps)(App)
```

在单元测试中，一般会这样导入 `App` 组件

```js
import App from './App'
```

但是，当这样导入时，实际上持有的是 `connect()` 返回的包装过组件，而不是 `App` 组件本身。如果想测试它和 Redux 间的互动，好消息是可以使用一个专为单元测试创建的 store， 将它包装在[`<Provider>`](https://github.com/rackt/react-redux#provider-store) 中。但有时我们仅仅是想测试组件的渲染，并不想要这么一个 Redux store。

想要不和装饰件打交道而测试 App 组件本身，我们建议你同时导出未包装的组件：

```js
import { connect } from 'react-redux'

// 命名导出未连接的组件 (测试用)
export class App extends Component { /* ... */ }

// 默认导出已连接的组件 (app 用)
export default connect(mapDispatchToProps)(App)
```

鉴于默认导出的依旧是包装过的组件，上面的导入语句会和之前一样工作，不需要更改应用中的代码。不过，可以这样在测试文件中导入没有包装的 `App` 组件：

```js
// 注意花括号：抓取命名导出，而不是默认导出
import { App } from './App'
```

如果两者都需要:

```js
import ConnectedApp, { App } from './App'
```

在 app 中，仍然正常地导入：

```js
import App from './App'
```

只在测试中使用命名导出。

>##### 混用 ES6 模块和 CommonJS 的注意事项

>如果在应用代码中使用 ES6，但在测试中使用 ES5，Babel 会通过其 [interop](http://babeljs.io/docs/usage/modules/#interop) 的机制处理 ES6 的 `import` 和 CommonJS 的 `require` 的转换，使这两个模块的格式各自运作，但其行为依旧有[细微的区别](https://github.com/babel/babel/issues/2047)。 如果在默认导出的附近增加另一个导出，将导致无法默认导出 `require('./App')`。此时，应代以 `require('./App').default` 。

### 中间件

中间件函数会对 Redux 中 `dispatch` 的调用行为进行封装。因此，需要通过模拟 `dispatch` 的调用行为来测试。

#### 示例

```js
import * as types from '../../constants/ActionTypes'
import singleDispatch from '../../middleware/singleDispatch'

const createFakeStore = fakeData => ({
  getState() {
    return fakeData
  }
})

const dispatchWithStoreOf = (storeData, action) => {
  let dispatched = null
  const dispatch = singleDispatch(createFakeStore(storeData))(actionAttempt => dispatched = actionAttempt)
  dispatch(action)
  return dispatched
}

describe('middleware', () => {
  it('should dispatch if store is empty', () => {
    const action = {
      type: types.ADD_TODO
    }

    expect(
      dispatchWithStoreOf({}, action)
    ).toEqual(action)
  })

  it('should not dispatch if store already has type', () => {
    const action = {
      type: types.ADD_TODO
    }

    expect(
      dispatchWithStoreOf({
        [types.ADD_TODO]: 'dispatched'
      }, action)
    ).toNotExist()
  })
})
```

### 词汇表

- [Enzyme](http://airbnb.io/enzyme/)：Enzyme 是一个 React 的 JavaScript 测试工具，能够让断言、操作以及遍历你的 React 组件的输出变得更简单。

- [React Test Utils](http://facebook.github.io/react/docs/test-utils.html)： React 测试工具。被 Enzyme 所使用。

- [浅渲染（shallow renderer）](http://facebook.github.io/react/docs/test-utils.html#shallow-rendering)： 浅渲染的中心思想是，初始化一个组件然后得到它的 `渲染` 方法作为结果，渲染深度仅一层，而非递归渲染整个 DOM 。浅渲染对单元测试很有用， 你只要测试某个特定的组件，而不包括它的子组件。这也意味着，更改一个子组件不会影响到其父组件的测试。如果要测试一个组件和它所有的子组件，可以用 [Enzyme's mount() method](http://airbnb.io/enzyme/docs/api/mount.html) ，也就是完全 DOM 渲染来实现。
