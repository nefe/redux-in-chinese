# 编写测试

因为你写的大部分 Redux 代码都是些函数，而且大部分是纯函数，所以很好测，不需要 mock。

### 设置

我们建议用 [Mocha](http://mochajs.org/) 作为测试引擎。  
注意因为是在 node 环境下运行，所以你不能访问 DOM。

```
npm install --save-dev mocha
```

想结合 [Babel](http://babeljs.io) 使用的话，在 `package.json` 的 `scripts` 里加入这一段：

```js
{
  ...
  "scripts": {
    ...
    "test": "mocha --compilers js:babel/register --recursive",
    "test:watch": "npm test -- --watch",
  },
  ...
}
```

然后运行 `npm test` 就能单次运行了，或者也可以使用 `npm run test:watch` 在每次有文件改变时自动执行测试。

### Action Creators

Redux 里的 action creators 是会返回普通对象的函数。在测试 action creators 的时候我们想要测试不仅是调用了正确的 action creator，还有是否返回了正确的 action。

#### 示例

```js
export function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text
  };
}
```
可以这么测：

```js
import expect from 'expect';
import * as actions from '../../actions/TodoActions';
import * as types from '../../constants/ActionTypes';

describe('actions', () => {
  it('should create an action to add a todo', () => {
    const text = 'Finish docs';
    const expectedAction = {
      type: types.ADD_TODO,
      text
    };
    expect(actions.addTodo(text)).toEqual(expectedAction);
  });
}
```

### Reducers

Reducer 应该是把 action 应用到之前的 state，并返回新的 state。测试起来是下面这样的。

#### 示例

```js
import { ADD_TODO } from '../constants/ActionTypes';

const initialState = [{
  text: 'Use Redux',
  completed: false,
  id: 0
}];

export default function todos(state = initialState, action) {
  switch (action.type) {
  case ADD_TODO:
    return [{
      id: (state.length === 0) ? 0 : state[0].id + 1,
      completed: false,
      text: action.text
    }, ...state];

  default:
    return state;
  }
}
```
可以这么测：

```js
import expect from 'expect';
import reducer from '../../reducers/todos';
import * as types from '../../constants/ActionTypes';

describe('todos reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual([{
      text: 'Use Redux',
      completed: false,
      id: 0
    }]);
  });

  it('should handle ADD_TODO', () => {
    expect(
      reducer([], {
        type: types.ADD_TODO,
        text: 'Run the tests'
      })
    ).toEqual([{
      text: 'Run the tests',
      completed: false,
      id: 0
    }]);

    expect(
      reducer([{
        text: 'Use Redux',
        completed: false,
        id: 0
      }], {
        type: types.ADD_TODO,
        text: 'Run the tests'
      })
    ).toEqual([{
      text: 'Run the tests',
      completed: false,
      id: 1
    }, {
      text: 'Use Redux',
      completed: false,
      id: 0
    }]);
  });
```

### Components

React components 有一点好，就是他们一般都很小而且依赖于他们的 props。所以很好测。

要测 components 我们要建一个叫 `setup()` 的辅助方法，用来把模拟过的（stubbed）回调函数当作 props 来传入，然后使用 [React 浅渲染](https://facebook.github.io/react/docs/test-utils.html#shallow-rendering) 来渲染组件。这样就可以通过做 “是否调用了回调函数” 这样的断言来写独立的测试。

#### 示例

```js
import React, { PropTypes, Component } from 'react';
import TodoTextInput from './TodoTextInput';

class Header extends Component {
  handleSave(text) {
    if (text.length !== 0) {
      this.props.addTodo(text);
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
    );
  }
}

Header.propTypes = {
  addTodo: PropTypes.func.isRequired
};

export default Header;
```

可以这么测:

```js
import expect from 'expect';
import jsdomReact from '../jsdomReact';
import React from 'react/addons';
import Header from '../../components/Header';
import TodoTextInput from '../../components/TodoTextInput';

const { TestUtils } = React.addons;

function setup() {
  let props = {
    addTodo: expect.createSpy()
  };

  let renderer = TestUtils.createRenderer();
  renderer.render(<Header {...props} />);
  let output = renderer.getRenderOutput();

  return {
    props: props,
    output: output,
    renderer: renderer
  };
}

describe('components', () => {
  jsdomReact();

  describe('Header', () => {
    it('should render correctly', () => {
      const { output } = setup();

      expect(output.type).toBe('header');
      expect(output.props.className).toBe('header');

      let [h1, input] = output.props.children;

      expect(h1.type).toBe('h1');
      expect(h1.props.children).toBe('todos');

      expect(input.type).toBe(TodoTextInput);
      expect(input.props.newTodo).toBe(true);
      expect(input.props.placeholder).toBe('What needs to be done?');
    });

    it('should call call addTodo if length of text is greater than 0', () => {
      const { output, props } = setup();
      let input = output.props.children[1];
      input.props.onSave('');
      expect(props.addTodo.calls.length).toBe(0);
      input.props.onSave('Use Redux');
      expect(props.addTodo.calls.length).toBe(1);
    });
  });
});
```

#### `setState()` 异常修复

浅渲染目前的问题是 [如果调用 `setState` 便抛异常](https://github.com/facebook/react/issues/4019). React 貌似想要的是，如果想要使用 `setState`，DOM 就一定要存在（但测试运行在 node 环境下，是没有 DOM 的）。要解决这个问题，我们用了 jsdom，为了在 DOM 无效的时候，React 也不抛异常。按下面方法设置它：

```
npm install --save-dev jsdom mocha-jsdom
```

然后添加 `jsdomReact()` 帮助函数，是这样的：

```js
import ExecutionEnvironment from 'react/lib/ExecutionEnvironment';
import jsdom from 'mocha-jsdom';

export default function jsdomReact() {
  jsdom();
  ExecutionEnvironment.canUseDOM = true;
}
```

要在运行任何的 component 测试之前调用。注意这么做不优雅，等以后 [facebook/react#4019](https://github.com/facebook/react/issues/4019) 解决了之后，这段代码就可以删除了。

### 词汇表

- [React Test Utils](http://facebook.github.io/react/docs/test-utils.html): 跟 React 一块来的测试小助手。

- [jsdom](https://github.com/tmpvar/jsdom): 一个 JavaScript 的内建 DOM 。Jsdom 允许没浏览器的时候也能跑测试。

- [浅渲染（shallow renderer）](http://facebook.github.io/react/docs/test-utils.html#shallow-rendering): 浅渲染的中心思想是，初始化一个 component 然后得到它的`渲染`方法作为结果，比起渲染成 DOM 那么深的只有一级那么深。浅渲染的结果是一个 [ReactElement](https://facebook.github.io/react/docs/glossary.html#react-elements) ，意味着可以访问它的 children, props 还能测试是否工作正常。
