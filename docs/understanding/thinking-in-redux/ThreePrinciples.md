---
id: three-principles
title: 三大原则
description: '原理 > 三大原则: Three key principles for using Redux'
hide_title: false
---

# 三大原则

Redux 可以用这三个基本原则来描述：

### 单一数据源

**整个应用的 [全局 state](./Glossary.md#state) 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 [store](./Glossary.md#store) 中。**

这条原则简化了同构应用的开发，因为在服务端的 state 可以序列化并注入到客户端，不需要做其他的一些事情。一个单一数据源 state tree 也简化了应用的调试和和监控；它也让你在开发中能将应用数据持久化到本地，从而加速开发周期。此外，有一些功能以前很难实现，比如“撤销/重做”，在单一数据源的原则下，使用 Redux 实现将非常容易。

```js
console.log(store.getState())

/* 输出
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
*/
```

### State 是只读的

**唯一改变 state 的方法就是触发 [action](./Glossary.md)，action 是一个用于描述已发生事件的普通对象。**

这条原则确保了视图行为和网络请求回调都不能直接修改 state，相反它们只能表达出想要修改 state 的意图。因为所有的修改都被集中化处理，且严格按照顺序一个接一个地执行，因此不用担心竞态条件（race condition）的出现。 Action 就是普通对象而已，因此它们可以被日志打印、序列化、储存、后期调试或测试时回放出来。

```js
store.dispatch({
  type: 'COMPLETE_TODO',
  index: 1
})

store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED'
})
```

### 使用纯函数来执行修改

**为了描述 action 如何改变 state tree，你需要编写纯的 [reducers](./Glossary.md#reducer)。**

Reducer 是纯函数，它接收之前的 state 和 action，并返回新的 state。记住，一定要返回一个新的对象，而不是修改之前的 state。你一开始可以只有单个 reducer，但随着应用复杂度的增长，你可以把大的 reducer 划分为一个个小的 reducers，分别管理着 state tree 的不同部分。由于 reducer 只是函数，你可以控制它们被调用的顺序，传入附加数据，甚至编写可复用的 reducer 来处理一些通用任务，如分页器。

```js
function visibilityFilter(state = 'SHOW_ALL', action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case 'COMPLETE_TODO':
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: true
          })
        }
        return todo
      })
    default:
      return state
  }
}

import { combineReducers, createStore } from 'redux'
const reducer = combineReducers({ visibilityFilter, todos })
const store = createStore(reducer)
```

就是这样，现在你应该明白 Redux 是怎么回事了。
