# Reducer 和 State 的基本结构

## Reducer 的基本结构

首先必须明确的是，整个应用只有一个**单一的 reducer 函数**：这个函数是传给 `createStore` 的第一个参数。一个单一的 reducer 最终需要做以下几件事：

* reducer 第一次被调用的时候，`state` 的值是 `undefined`。reducer 需要在 action 传入之前提供一个默认的 state 来处理这种情况。
* reducer 需要先前的 state 和 dispatch 的 action 来决定需要做什么事。
* 假设需要更改数据，应该用更新后的数据创建新的对象或数组并返回它们。
* 如果没有什么更改，应该返回当前存在的 state 本身。

写 reducer 最简单的方式是把所有的逻辑放在一个单独的函数声明中，就像这样：

``` javascript
function counter(state, action) {
	if (typeof state === 'undefined') {
 		state = 0; // 如果 state 是 undefined，用这个默认值初始化 store
 	}
 	if (action.type === 'INCREMENT') {
 		return state + 1;
 	}
 	else if (action.type === 'DECREMENT') {
 		return state - 1;
 	}
 	else {
 		return state; // 未识别 action 会经过这里
 	}
}
```

这个简单的函数满足上面提到的所有基本要求。在最开始会返回一个默认的值初始化 store；根据 action 的 type 决定 state 是哪种类型的更新，最后返回新的 state；如果没有什么要发生，会返回先前的 state。

这里有一些对这个 reducer 的简单调整。首先，重复的 `if/else` 语句看上去是很烦人的，可以使用 `switch` 语句代替他。其次，我们可以使用 ES6 的默认参数来处理初始 state 不存在的情况。有了这些变化，reducer 看上去会长成这样：

``` javascript
function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}
```

这是典型 Redux reducer 的基本结构。

## State 的基本结构

Redux 鼓励你根据要管理的数据来思考你的应用程序。数据就是你应用的 state，state 的结构和组织方式通常会称为 "shape"。在你组织 reducer 的逻辑时，state 的 shape 通常扮演一个重要的角色。

Redux state 中顶层的状态树通常是一个普通的 JavaScript 对象（当然也可以是其他类型的数据，比如：数字、数据或者其他专门的数据结构，但大多数库的顶层值都是一个普通对象）。在顶层对象中组织数据最常见的方式是将数据划分为子树，每个顶层的 key 对应着和特定域或者切片相关联的数据。例如，Todo 应用的 state 通常长这样：

``` javascript
{
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true,
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}
```

在这个例子中，`todos` 和 `visibilityFilter` 都是 state 的顶层 Key，他们分别代表着一个某个特定概念的数据切片。

大多数应用会处理多种数据类型，通常可以分为以下三类：

* 域数据（Domain data）: 应用需要展示、使用或者修改的数据（比如 从服务器检索到的所有 todos
* 应用状态（App state）: 特定于应用某个行为的数据（比如 “Todo #5 是现在选择的状态”，或者 “正在进行一个获取 Todos 的请求”）
* UI 状态（UI state）: 控制 UI 如何展示的数据（比如 “编写 TODO 模型的弹窗现在是展开的”）

Store 代表着应用核心，因此应该用域数据（Domain data）和应用状态数据（App state）定义 State，而不是用 UI 状态（UI state）。举个例子，`state.leftPane.todoList.todos` 这样的结构就是一个坏主意，因为整个应用的核心是 “todos” 而不仅仅是 UI 的一个模块。 `todos` 这个切片才应该是 state 结构的顶层。

UI 树和状态树之间很少有 1 对 1 的关系。除非你想明确的跟踪你的 Redux Store 中存储的 UI 数据的各个方面，但即使是这样，UI 数据的结构和域数据的结构也是不一样的。

一个典型的应用 state 大致会长这样：

``` javascript
{
    domainData1 : {},
    domainData2 : {},
    appState1 : {},
    appState2 : {},
    ui : {
        uiState1 : {},
        uiState2 : {},
    }
}
```
