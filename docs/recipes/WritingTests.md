---
id: writing-tests
title: 编写测试
hide_title: false
---

# 编写测试

由于你写的大部分 Redux 代码是函数，而且其中大部分是纯函数，所以很好测，不需要模拟。

## 准备工作

我们推荐使用 [Jest](https://jestjs.io/)) 作为测试引擎，需要注意的是 Jest 运行在 Node 环境中，因此你不能访问 DOM。

```bash
npm install --save-dev jest
```

如果想要和 [Babel](http://babeljs.io/) 一起使用，还需要安装 `babel-jest`

```bash
npm install --save-dev babel-jest
```

并且在 `.babelrc` 中通过 [babel-preset-env](https://github.com/babel/babel/tree/master/packages/babel-preset-env) 来配置

```javascript
{
   "presets": ["@babel/preset-env"]
}
```

然后，在 `package.json` 中的 `scripts` 处添加相关的命令

```json
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

执行 `npm test` 可以运行一次测试，执行 `npm run test:watch` 可以让每当文件改变时自动执行测试。

## 测试 Action Creators

在 Redux 中，action creators 是返回普通对象的函数，当我们测试 action creators 时，我们想要测试是否调用了正确的 action creator 以及是否返回了正确的 action。

### 示例

```js
export function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text
  }
}
```

可以这样来测试：

```js
import * as actions from '../../actions/TodoActions'
import * as types from '../../constants/ActionTypes'
​
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

## 测试异步 Action Creators

对于使用 [Redux-Thunk](https://github.com/reduxjs/redux-thunk) 或者其它中间件的异步 action Creator ，最好完全模拟 Redux store 来进行测试，可以通过使用 [redux-mock-store](https://github.com/dmitry-zaets/redux-mock-store) 来把中间件应用于模拟的 store，还可以使用 [fetch-mock](http://www.wheresrhys.co.uk/fetch-mock/)) 来模拟 HTTP 请求。

### 示例

```js
import 'cross-fetch/polyfill'
​
function fetchTodosRequest() {
  return {
    type: FETCH_TODOS_REQUEST
  }
}
​
function fetchTodosSuccess(body) {
  return {
    type: FETCH_TODOS_SUCCESS,
    body
  }
}
​
function fetchTodosFailure(ex) {
  return {
    type: FETCH_TODOS_FAILURE,
    ex
  }
}
​
export function fetchTodos() {
  return dispatch => {
    dispatch(fetchTodosRequest())
    return fetch('http://example.com/todos')
      .then(res => res.json())
      .then(body => dispatch(fetchTodosSuccess(body)))
      .catch(ex => dispatch(fetchTodosFailure(ex)))
  }
}
```

可以这样来测试：

```js
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../actions/TodoActions'
import * as types from '../../constants/ActionTypes'
import fetchMock from 'fetch-mock'
import expect from 'expect' // 可以使用任何测试库
​
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
​
describe('async actions', () => {
  afterEach(() => {
    fetchMock.reset()
    fetchMock.restore()
  })
​
  it('creates FETCH_TODOS_SUCCESS when fetching todos has been done', () => {
    fetchMock
      .getOnce('/todos', { body: { todos: ['do something'] }, headers: { 'content-type': 'application/json' } })
​
​
    const expectedActions = [
      { type: types.FETCH_TODOS_REQUEST },
      { type: types.FETCH_TODOS_SUCCESS, body: { todos: ['do something'] } }
    ]
    const store = mockStore({ todos: [] })
​
    return store.dispatch(actions.fetchTodos()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
```

## 测试 Reducers

Reducer 把 action 应用到之前的 state，并返回新的 state。示例如下。

### 示例

```js
import { ADD_TODO } from '../constants/ActionTypes'
​
const initialState = [
  {
    text: 'Use Redux',
    completed: false,
    id: 0
  }
]
​
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
​
    default:
      return state
  }
}
```

可以这样来测试：

```js
import reducer from '../../reducers/todos'
import * as types from '../../constants/ActionTypes'
​
describe('todos reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([
      {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ])
  })
​
  it('should handle ADD_TODO', () => {
    expect(
      reducer([], {
        type: types.ADD_TODO,
        text: 'Run the tests'
      })
    ).toEqual([
      {
        text: 'Run the tests',
        completed: false,
        id: 0
      }
    ])
​
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
    ).toEqual([
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
    ])
  })
})
```

## 测试组件

React 组件有一个优点，它们通常很小且只依赖于传入的 `props` ，因此测试起来很简便。

首先，我们需要安装 [Enzyme](http://airbnb.io/enzyme/) ，Enzyme 底层使用了 [React Test Utilities](https://reactjs.org/docs/test-utils.html) ，但是更方便，更具可读性，更强大。

```bash
npm install —save-dev enzyme
```

为了兼容 React 的版本，我们还需要安装 Enzyme 适配器，Enzyme 提供了适配器用以兼容 `React16` ,`React 15.x`,`React 0.14.x`,`React 0.13.x`。如果你使用的是 React16，你可以使用下面的命令安装相关依赖：

```bash
npm install --save-dev enzyme-adapter-react-16
```

为了测试组件，我们创建了一个 `setup()` 辅助函数，用来把模拟过的（stubbed）回调函数当作 props 传入，然后使用 ([React Shallow Rendering](https://reactjs.org/docs/test-utils.html#shallow-rendering)) 来渲染组件。这样就可以依据 “是否调用了回调函数” 的断言来写独立的测试。

### 示例

```js
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TodoTextInput from './TodoTextInput'
​
class Header extends Component {
  handleSave(text) {
    if (text.length !== 0) {
      this.props.addTodo(text)
    }
  }
​
  render() {
    return (
      <header className="header">
        <h1>todos</h1>
        <TodoTextInput
          newTodo={true}
          onSave={this.handleSave.bind(this)}
          placeholder="What needs to be done?"
        />
      </header>
    )
  }
}
​
Header.propTypes = {
  addTodo: PropTypes.func.isRequired
}
​
export default Header
```

上面的组件可以这样来测试：

```js
import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import Header from '../../components/Header'
​
Enzyme.configure({ adapter: new Adapter() });
​
function setup() {
  const props = {
    addTodo: jest.fn()
  }
​
  const enzymeWrapper = mount(<Header {...props} />)
​
  return {
    props,
    enzymeWrapper
  }
}
​
describe('components', () => {
  describe('Header', () => {
    it('should render self and subcomponents', () => {
      const { enzymeWrapper } = setup()
​
      expect(enzymeWrapper.find('header').hasClass('header')).toBe(true)
​
      expect(enzymeWrapper.find('h1').text()).toBe('todos')
​
      const todoInputProps = enzymeWrapper.find('TodoTextInput').props()
      expect(todoInputProps.newTodo).toBe(true)
      expect(todoInputProps.placeholder).toEqual('What needs to be done?')
    })
​
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

## 测试 connected 组件

如果你使用类似 [React redux](https://github.com/reduxjs/react-redux) 的库，你可能会使用 [高阶组件](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750)，比如 [`connect()` ](https://github.com/reduxjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)。可以让你把 Redux state 注入到常规的 React 组件中。

考虑如下 `App` 组件

```js
import { connect } from 'react-redux'
​
class App extends Component { /* ... */ }
​
export default connect(mapStateToProps)(App)
```

在单元测试中，通常会这样导入 `App` 组件：

```
import App from './App'
```

不过，上面这样导入的是通过 `connect()` 方法返回的包装组件，并非 `App` 组件本身，如果你想测试和 Redux 的整合，这很容易，通过 [`<Provider>`](https://github.com/reduxjs/react-redux/blob/master/docs/api.md#provider-store)包裹它后传入用以单元测试的特殊 store 就可以了。但是有时候我们想测试的其实是不带 Redux store 的组件的渲染。

为了测试 App 组件本身而不用处理装饰器，我们推荐你导出未装饰的组件：

```js
import { connect } from 'react-redux'
​
// 命名导出未连接的组件 (测试用)
export class App extends Component { /* ... */ }
​
// 默认导出已连接的组件 (app 用)
export default connect(mapStateToProps)(App)
```

由于默认导出的组件依旧是包装过的组件，上面代码中的导入依旧会生效，无须你更改已有的代码。不过现在你可以通过下面这样的办法导入未装饰的组件了：

```js
import { App } from './App'
```

如果你需要导入二者，可以按下面这样做：

```js
import ConnectedApp, { App } from './App'
```

在 app 中，仍然正常地导入：

```js
import App from './App'
```

只在测试中使用命名导出。

> **混用 ES6 模块和 CommonJS 的注意事项**
>
> 如果在应用代码中使用 ES6，但在测试中使用 ES5，Babel 会通过其 [`interop`](https://old.babeljs.io/docs/plugins/#interop) 机制处理 ES6 的 `import` 和 CommonJS 的 `require` ，使得这两种模式能一起使用，但其行为依旧有细微的区别。 如果在默认导出的附近增加另一个导出，将导致无法默认导出 `require('./App')`。此时，应代以 `require('./App').default`

## 对中间件的测试

中间件函数包装了 Redux 中 `dispatch` 的行为，为了测试中间件的行为，我们需要模拟 `dispatch` 调用时的行为。

### 示例

首先，我们需要创建一个中间件函数，下述代码和 [redux-thunk](https://github.com/reduxjs/redux-thunk/blob/master/src/index.js) 类似

```js
const thunk = ({ dispatch, getState }) => next => action => {
  if (typeof action === 'function') {
    return action(dispatch, getState)
  }
​
  return next(action)
}
```

我们需要创造一个假的 `getState`,`dispatch` 和 `next` 函数，我们可以使用 `jest.fn()` 来创建 stubs，你也可以使用 sinon 等测试框架

我们可以像 Redux 一样来触发函数

```js
const create = () => {
  const store = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
  };
  const next = jest.fn()
​
  const invoke = (action) => thunk(store)(next)(action)
​
  return {store, next, invoke}
};
```

然后我们在适当的时机通过调用 `getState`,`dispatch`,`next`函数来测试中间件。

```js
it('passes through non-function action', () => {
  const { next, invoke } = create()
  const action = {type: 'TEST'}
  invoke(action)
  expect(next).toHaveBeenCalledWith(action)
})
​
it('calls the function', () => {
  const { invoke } = create()
  const fn = jest.fn()
  invoke(fn)
  expect(fn).toHaveBeenCalled()
});
​
it('passes dispatch and getState', () => {
  const { store, invoke } = create()
  invoke((dispatch, getState) => {
    dispatch('TEST DISPATCH')
    getState();
  })
  expect(store.dispatch).toHaveBeenCalledWith('TEST DISPATCH')
  expect(store.getState).toHaveBeenCalled()
});
```

在一些情况下，你需要修改 `create` 函数来模拟不同的 `getState` 和 `next` 。

## 词汇表

- [Enzyme](http://airbnb.io/enzyme/): Enzyme 是一种用于 React 测试的 JavaScript 工具，它使得断言、操作以及遍历你的 React 组件的输出变得更简单。
- [React Test Utilities](https://reactjs.org/docs/test-utils.html) :React 提供的测试工具，被 Enzyme 使用
- [shallow renderer](http://airbnb.io/enzyme/docs/api/shallow.html)： shallow renderer 使你可以实例化一个组件, 并有效地获取其 `render` 方法的结果, 其渲染深度仅一层, 而非递归地将组件渲染为 DOM。 shallow renderer 对单元测试很有用， 你只要测试某个特定的组件，而不用管它的子组件。这也意味着，更改子组件不会影响到其父组件的测试。如果要测试一个组件和它所有的子组件，可以用 [`Enzyme's mount()`](http://airbnb.io/enzyme/docs/api/mount.html) 方法 ，这个方法会进行完全的 DOM 渲染。
