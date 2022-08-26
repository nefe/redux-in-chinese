---
id: core-concepts
title: 核心概念
description: "简介 > 核心概念：带你快速了解 Redux 关键思想与 reducer 函数"
hide_title: false
---

# 核心概念

当使用普通对象来描述应用的 state 时。例如，todo 应用的 state 可能长这样：

```js
{
  todos: [{
    text: 'Eat food',
    completed: true
  }, {
    text: 'Exercise',
    completed: false
  }],
  visibilityFilter: 'SHOW_COMPLETED'
}
```

这个对象就像 “Model”，区别是它并没有 setter（修改器方法）。因此其它的代码不能随意修改它，造成难以复现的 bug。

要想更新 state 中的数据，你需要发起一个 action。action 就是一个普通 JavaScript 对象（注意到没，并没有什么魔法？）用来描述发生了什么。下面是一些 action 的示例：

```js
{ type: 'ADD_TODO', text: 'Go to swimming pool' }
{ type: 'TOGGLE_TODO', index: 1 }
{ type: 'SET_VISIBILITY_FILTER', filter: 'SHOW_ALL' }
```

强制使用 action 来描述所有变化可以让我们清晰地知道应用中到底发生了什么。如果一些东西改变了，就可以知道为什么变。actions 就像是描述所发生事情的面包屑导航。
最终，我们开发一个函数将 action 和 state 联系起来，这个函数就是 reducer。同样，这也没有使用什么魔法，reducer 只是一个接收 state 和 action作为其参数，并返回给应用新的 state 的函数。
对于大的应用来说，不大可能仅仅只写一个这样的函数，所以我们编写很多小函数来分别管理 state 的一部分：

```js
function visibilityFilter(state = 'SHOW_ALL', action) {
  if (action.type === 'SET_VISIBILITY_FILTER') {
    return action.filter
  } else {
    return state
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([{ text: action.text, completed: false }])
    case 'TOGGLE_TODO':
      return state.map((todo, index) =>
        action.index === index
          ? { text: todo.text, completed: !todo.completed }
          : todo
      )
    default:
      return state
  }
}
```

再开发一个 reducer, 通过调用这两个 reducer来获取相应的状态，进而来管理整个应用的 state：

```js
function todoApp(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    visibilityFilter: visibilityFilter(state.visibilityFilter, action)
  }
}
```

这差不多就是 Redux 的全部思想。注意，我们还没有使用任何 Redux 的 API。Redux 里有一些实用的工具来简化这种模式，但是其主要思想是如何根据 action 对象来更新 state，而且 90% 的代码都是普通 JavaScript，没用 Redux本身、Redux API 或任何魔法。