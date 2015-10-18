# 实现撤销历史

在应用中内建撤消和重做功能往往需要开发者有意识的做出一些努力。对于经典的 MVC 框架来说这不是一个简单的问题，因为你需要通过克隆所有相关的 model 来追踪每一个历史状态。此外，你需要关心整个撤消堆栈，因为用户初始化的更改也应该是可撤消。

这意味着在一个 MVC 应用中实现撤消和重做，通常迫使你用一些类似于 [Command](https://en.wikipedia.org/wiki/Command_pattern) 的特殊的数据修改模式来重写应用中的部分代码。

而在 Redux 中，实现撤销历史却是轻而易举的。有以下三个原因：

* 你想要跟踪的 state 子树不会包含多个模型（models—just）。
* state 是不可变的，所有修改已经被描述成分离的 action，而这些 action 与预期的撤销堆栈模型很接近了。
* reducer 的签名 `(state, action) => state` 让它可以自然的实现 “reducer enhancers” 或者 “higher order reducers”。它们可以让你在为 reducer 添加额外的功能时保持这个签名。撤消历史就是一个典型的应用场景。

在动手之前，确认你已经阅读过[基础教程](../basics/README.md)并且良好掌握了 [reducer 合成](../basics/Reducers.md)。本文中的代码会构建于 [基础教程](../basics/README.md) 的示例之上。

文章的第一部分，我们将会解释实现撤消和重做功能所用到的基础概念。

在第二部分中，我们会展示如何使用 [Redux Undo](https://github.com/omnidan/redux-undo) 库来无缝地实现撤消和重做。

[![demo of todos-with-undo](http://i.imgur.com/lvDFHkH.gif)](https://twitter.com/dan_abramov/status/647038407286390784)


## 理解撤消历史

### 设计状态结构

撤消历史也是你的应用 state 的一部分，我们没有任何原因通过不同的方式实现它。无论 state 如何随着时间不断变化，当你实现撤消和重做这个功能时，你就必须追踪 state 在不同时刻的**历史记录**。

例如，一个计数器应用的 state 结构看起来可能是这样：

```js
{
  counter: 10
}
```

如果我们希望在这样一个引用中实现撤消和重做的话，我们必须保存更多的 state 以解决下面几个问题：

* 撤消或重做留下了哪些信息？
* 当前的状态是什么？
* 撤销堆栈中过去（和未来）的状态是什么？

这是一个对于 state 结构的修改建议，可以回答上述问题的：

```js
{
  counter: {
    past: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    present: 10,
    future: []
  }
}
```

现在，如果我们按下“撤消”，我们希望恢复到过去的状态：

```js
{
  counter: {
    past: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    present: 9,
    future: [10]
  }
}
```

再来一次：

```js
{
  counter: {
    past: [0, 1, 2, 3, 4, 5, 6, 7],
    present: 8,
    future: [9, 10]
  }
}
```

当我们按下“重做”，我们希望往未来的状态移动一步：

```js
{
  counter: {
    past: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    present: 9,
    future: [10]
  }
}
```

最终，如果处于撤销堆栈中，用户发起了一个操作（例如，减少计数），我们将会丢弃所有未来的信息：

```js
{
  counter: {
    past: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    present: 8,
    future: []
  }
}
```

有趣的一点是，我们在撤销堆栈中保存数字，字符串，数组或是对象都没有关系。整个结构始终完全一致：

```js
{
  counter: {
    past: [0, 1, 2],
    present: 3,
    future: [4]
  }
}
```

```js
{
  todos: {
    past: [
      [],
      [{ text: 'Use Redux' }],
      [{ text: 'Use Redux', complete: true }]
    ],
    present: [{ text: 'Use Redux', complete: true }, { text: 'Implement Undo' }],
    future: [
      [{ text: 'Use Redux', complete: true }, { text: 'Implement Undo', complete: true }]
    ]
  }
}
```

它看起来通常都是这样：

```js
{
  past: Array<T>,
  present: T,
  future: Array<T>
}
```

我们可以保存单一的顶层历史记录：

```js
{
  past: [
    { counterA: 1, counterB: 1 },
    { counterA: 1, counterB: 0 },
    { counterA: 0, counterB: 0 }
  ],
  present: { counterA: 2, counterB: 1 },
  future: []
}
```

也可以分离的历史记录，用户可以独立地执行撤消和重做操作：

```js
{
  counterA: {
    past: [1, 0],
    present: 2,
    future: []
  },
  counterB: {
    past: [0],
    present: 1,
    future: []
  }
}
```

接下来我们将会看到如何选择合适的撤消和重做的颗粒度。

### 设计算法

无论何种特定的数据类型，重做历史记录的 state 结构始终一致：

```js
{
  past: Array<T>,
  present: T,
  future: Array<T>
}
```

让我们讨论一下如何通过算法来操作上文所述的 state 结构。我们可以定义两个 action 来操作该 state：`UNDO` 和 `REDO`。在 reducer 中，我们希望以如下步骤处理这两个 action：

#### 处理 Undo

* 移除 `past` 中的**最后一个**元素。
* 将上一步移除的元素赋予 `present`。
* 将原来的 `present` 插入到 `future` 的**最前面**。

#### 处理 Redo

* 移除 `future` 中的**第一个**元素。
* 将上一步移除的元素赋予 `present`。
* 将原来的 `present` 追加到 `past` 的**最后面**。

#### 处理其他 Action

* 将当前的 `present` 追加到 `past` 的**最后面**。
* 将处理完 action 所产生的新的 state 赋予 `present`。
* 清空 `future`。

### 第一次尝试: 编写 Reducer

```js
const initialState = {
  past: [],
  present: null, // (?) 我们如何初始化当前状态?
  future: []
};

function undoable(state = initialState, action) {
  const { past, present, future } = state;

  switch (action.type) {
  case 'UNDO':
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    return {
      past: newPast,
      present: previous,
      future: [present, ...future]
    };
  case 'REDO':
    const next = future[0];
    const newFuture = future.slice(1);
    return {
      past: [...past, present],
      present: next,
      future: newFuture
    };
  default:
    // (?) 我们如何处理其他 action？
    return state;
  }
}
```

这个实现是无法使用的，因为它忽略了下面三个重要的问题：

* 我们从何处获取初始的 `present` 状态？我们无法预先知道它。
* 当外部 action 被处理完毕后，我们在哪里完成将 `present` 保存到 `past` 的工作？
* 我们如何将 `present` 状态的控制委托给一个自定义的 reducer？

看起来 reducer 并不是正确的抽象方式，但是我们已经非常接近了。

### 遇见 Reducer Enhancers

你可能已经熟悉 [higher order function](https://en.wikipedia.org/wiki/Higher-order_function) 了。如果你使用过 React，也应该熟悉 [higher order component](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750)。对于 reducer 来说，也有一种对应的实现模式。

一个 **reducer enhancer**（或者一个 **higher order reducer**）作为一个函数，接收 reducer 作为参数，并返回一个新的 reducer，这个新的 reducer 可以处理新的 action，或者维护更多的 state，亦或者将它无法处理的 action 委托给原始的 reducer 处理。这不是什么新的模式技术（pattern—technically），[`combineReducers()`](../api/combineReducers.md)就是一个 reducer enhancer，因为它同样接收多个 reducer 并返回一个新的 reducer。

这是一个没有任何额外功能的 reducer enhancer 的示例：

```js
function doNothingWith(reducer) {
  return function (state, action) {
    // 仅仅是调用被传入的 reducer
    return reducer(state, action);
  };
}
```

一个可以组合 reducer 的 reducer enhancer 看起来应该像这样：

```js
function combineReducers(reducers) {
  return function (state = {}, action) {
    return Object.keys(reducers).reduce((nextState, key) => {
      // 调用每一个 reducer，并将由它管理的部分 state 传给它
      nextState[key] = reducers[key](state[key], action);
      return nextState;
    }, {});
  };
}
```

### 第二次尝试: 编写 Reducer Enhancer

现在我们对 reducer enhancer 有了更深的了解，我们可以明确所谓的`可撤销`到底是什么：

```js
function undoable(reducer) {
  // 以一个空的 action 调用 reducer 来产生初始的 state
  const initialState = {
    past: [],
    present: reducer(undefined, {}),
    future: []
  };

  // 返回一个可以执行撤销和重做的新的reducer
  return function (state = initialState, action) {
    const { past, present, future } = state;

    switch (action.type) {
    case 'UNDO':
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future]
      };
    case 'REDO':
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture
      };
    default:
      // 将其他 action 委托给原始的 reducer 处理
      const newPresent = reducer(present, action);
      if (present === newPresent) {
        return state;
      }
      return {
        past: [...past, present],
        present: newPresent,
        future: []
      };
    }
  };
}
```

我们现在可以将任意的 reducer 通过这个拥有`可撤销`能力的 reducer enhancer 进行封装，从而让它们可以处理 `UNDO` 和 `REDO` 这两个 action。

```js
// 这是一个 reducer。
function todos(state = [], action) {
  /* ... */
}

// 处理完成之后仍然是一个 reducer！
const undoableTodos = undoable(todos);

import { createStore } from 'redux';
const store = createStore(undoableTodos);

store.dispatch({
  type: 'ADD_TODO',
  text: 'Use Redux'
});

store.dispatch({
  type: 'ADD_TODO',
  text: 'Implement Undo'
});

store.dispatch({
  type: 'UNDO'
});
```

还有一个重要注意点：你需要记住当你恢复一个 state 时，必须把 `.present` 追加到它上面。你也不能忘了需要通过检查 `.past.length` 和 `.future.length` 来决定撤销和重做按钮是否可用。

你可能听说过 Redux 受 [Elm 架构](https://github.com/evancz/elm-architecture-tutorial/) 影响颇深。所以这个示例与 [elm-undo-redo package](http://package.elm-lang.org/packages/TheSeamau5/elm-undo-redo/2.0.0) 也不会太令人吃惊。

## 使用 Redux Undo

以上这些都非常有用，但是有没有一个库能帮助我们实现`可撤销`功能，而不是由我们自己编写呢？当然有！来看看 [Redux Undo](https://github.com/omnidan/redux-undo)，它可以为你的 Redux 状态树中的任何部分提供撤销和重做功能。

在这个部分中，你会学到如何让 [Todo List example](http://rackt.github.io/redux/docs/basics/ExampleTodoList.html) 拥有可撤销的功能。你可以在 [`todos-with-undo`](https://github.com/rackt/redux/tree/master/examples/todos-with-undo)找到完整的源码。

### 安装

首先，你必须先执行

```
npm install --save redux-undo
```

这一步会安装一个提供`可撤销`功能的 reducer enhancer 的库。

### 封装 Reducer

你需要通过 `undoable` 函数强化你的 reducer。例如，如果使用了 [`combineReducers()`](../api/combineReducers.md)，你的代码看起来应该像这样：

#### `reducers.js`

```js
import undoable, { distinctState } from 'redux-undo';

/* ... */

const todoApp = combineReducers({
  visibilityFilter,
  todos: undoable(todos, { filter: distinctState() })
});
```

`distinctState()` 过滤器将会忽略那些没有引起 state 变化的 action。还有一些[其他选项](https://github.com/omnidan/redux-undo#configuration)来配置你可撤销的 reducer，例如为撤销和重做动作指定 action 的类型。

你可以在 reducer 合并层次中的任何级别对一个或多个 reducer 执行 `undoable`。由于 `visibilityFilter` 的变化并不会影响撤销历史，我们选择只对 `todos` reducer 进行封装，而不是整个顶层的 reducer。

### 更新 Selector

现在 `todos` 相关的 state 看起来应该像这样：

```js
{
  visibilityFilter: 'SHOW_ALL',
  todos: {
    past: [
      [],
      [{ text: 'Use Redux' }],
      [{ text: 'Use Redux', complete: true }]
    ],
    present: [{ text: 'Use Redux', complete: true }, { text: 'Implement Undo' }],
    future: [
      [{ text: 'Use Redux', complete: true }, { text: 'Implement Undo', complete: true }]
    ]
  }
}
```

这意味着你必须要通过 `state.todos.present` 操作 state，而不是原来的 `state.todos`：

#### `containers/App.js`

```js
function select(state) {
  const presentTodos = state.todos.present;
  return {
    visibleTodos: selectTodos(presentTodos, state.visibilityFilter),
    visibilityFilter: state.visibilityFilter
  };
}
```

为了确认撤销和重做按钮是否可用，你必须检查 `past` 和 `future` 数组是否为空：

#### `containers/App.js`

```js
function select(state) {
  return {
    undoDisabled: state.todos.past.length === 0,
    redoDisabled: state.todos.future.length === 0,
    visibleTodos: selectTodos(state.todos.present, state.visibilityFilter),
    visibilityFilter: state.visibilityFilter
  };
}
```

### 添加按钮

现在，你需要做的全部事情就只是为撤销和重做操作添加按钮了。

首先，你需要从 `redux-undo` 中导入 `ActionCreators`，并将他们传递给 `Footer` 组件：

#### `containers/App.js`

```js
import { ActionCreators } from 'redux-undo';

/* ... */

class App extends Component {
  render() {
    const { dispatch, visibleTodos, visibilityFilter } = this.props;
    return (
      <div>
        {/* ... */}
        <Footer
          filter={visibilityFilter}
          onFilterChange={nextFilter => dispatch(setVisibilityFilter(nextFilter))}
          onUndo={() => dispatch(ActionCreators.undo())}
          onRedo={() => dispatch(ActionCreators.redo())}
          undoDisabled={this.props.undoDisabled}
          redoDisabled={this.props.redoDisabled} />
      </div>
    );
  }
}
```

在 footer 中渲染它们：

#### `components/Footer.js`

```js
export default class Footer extends Component {

  /* ... */

  renderUndo() {
    return (
      <p>
        <button onClick={this.props.onUndo} disabled={this.props.undoDisabled}>Undo</button>
        <button onClick={this.props.onRedo} disabled={this.props.redoDisabled}>Redo</button>
      </p>
    );
  }

  render() {
    return (
      <div>
        {this.renderFilters()}
        {this.renderUndo()}
      </div>
    );
  }
}
```

就是这样！在[示例文件夹](https://github.com/rackt/redux/tree/master/examples/todos-with-undo)下执行 `npm install` 和 `npm start` 试试看吧！
