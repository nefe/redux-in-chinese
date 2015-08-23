# 编写测试

因为你写的大部分 Redux 代码都是些函数，而且他们中的很多都是纯函数，所以不用mock就能跑测试变得很轻松。

### 设置

我们建议用 [Mocha](http://mochajs.org/) 作为测试引擎。
注意它是泡在node环境下的，所以你用不着访问DOM。

```
npm install --save-dev mocha
```

To use it together with [Babel](http://babeljs.io), add this to `scripts` in your `package.json`:

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

然后运行 `npm test` 就能单次运行了，或者也可以 `npm run test:watch` 每次有文件改变时测试。

### Action Creators

Redux 里的 action creators 是些返回普通对象的函数。在测试 action creators 的时候我们想要测试是不是调用了正确的 action creator 还有是不是返回了正确的 action 。

#### 例子

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

Reducer 应该在给之前的 state 应用了 action 之后返回了新的 state。下面测试的行为就是这样的。

#### 例子

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

要测 components 我们要建一个叫 `setup()` 的辅助方法，用来把打桩回调传递成 props 再用 [React shallow renderer](https://facebook.github.io/react/docs/test-utils.html#shallow-rendering) 渲染成 component 。 这样独立的测试就能以“回调是否在需要被调用的时候被调用了”为准做断言。

#### 例子

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

#### 修坏掉的 `setState()`

浅渲染目前是 [如果调用 `setState` 便抛异常](https://github.com/facebook/react/issues/4019). React 貌似想要的是，如果你用了 `setState`，DOM 就有效。要搞定这个问题，我们用了 jsdom 所以 React 在 DOM 无效的时候也不抛异常。下面是关于如何设置:

```
npm install --save-dev jsdom mocha-jsdom
```

添加一个 `jsdomReact()` 帮手函数长这样：  

```js
import ExecutionEnvironment from 'react/lib/ExecutionEnvironment';
import jsdom from 'mocha-jsdom';

export default function jsdomReact() {
  jsdom();
  ExecutionEnvironment.canUseDOM = true;
}
```

要在运行任何的 component 测试之前调用。注意这么干比较脏，等以后 [facebook/react#4019](https://github.com/facebook/react/issues/4019) 这个被修了我们就会马上删掉了。

### 词汇表

- [React Test Utils](http://facebook.github.io/react/docs/test-utils.html): 跟 React 一块来的测试小助手。

- [jsdom](https://github.com/tmpvar/jsdom): 一个 JavaScript 的内建 DOM 。Jsdom 允许没浏览器的时候也能跑测试。

- [浅渲染](http://facebook.github.io/react/docs/test-utils.html#shallow-rendering): 浅渲染的中心思想是，初始化一个 component 然后得到它的`渲染`方法作为结果，比起渲染成 DOM 那么深的只有一级那么深。浅渲染的结果是一个 [ReactElement](https://facebook.github.io/react/docs/glossary.html#react-elements) ，意味着可以访问它的 children, props 还能测试是否工作正常。
