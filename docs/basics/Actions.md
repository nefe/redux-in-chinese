# Actions

首先，让我们来学习如何定义 action。

**Actions** 是把数据从应用传到 store 的有效载荷。它是 store 数据**惟一**的来源。通过 [`store.dispatch()`](../api/Store.md#dispatch) 把它传到 store。

下面的例子演示了如何添加一个新的 todo 任务：

```js
{
  type: 'ADD_TODO',
  text: 'Build my first Redux app'
}
```

Action 本质是 JavaScript 普通对象。我们约定，action 应该有一个叫 `type` 的字符串类型的字段来表示将要执行的动作。普遍情况下，`type` 会被定义成字符串常量。当应用膨胀到足够大的时候，最好把它们放到一个单独的模块文件中。

```js
import { ADD_TODO, REMOVE_TODO } from '../actionTypes';
```

>##### 样板文件提醒

>其实你并不需要为定义 action type 常量单独建立文件，甚至不需要定义它们。对于小应用来说，使用字符串做 action type 更方便些。不过，在大型应用中把它们显式地定义成常量更有优势。参照 [减少样板代码](../recipes/ReducingBoilerplate.md) 获取保持代码干净的实践经验。

除了 `type`，action 对象的结构完全取决于你。参照 [Flux 标准 Action](https://github.com/acdlite/flux-standard-action) 获取如何组织 action 的建议。

还需要再添加一个 action 类型来表示用户来标记任务完成。因为数据是存放在数组中的，我们通过 `index` 来指定一个任务，真实的应用中一般会在新内容创建的时候生成惟一的 ID。

```js
{
  type: COMPLETE_TODO,
  index: 5
}
```
**action 中传递的数据越少越好**。比如，这里传递 `index` 就比把整个任何对象传过去要好。

最后，再添加一个 action 类型来表示当前看到的任务类型。

```js
{
  type: SET_VISIBILITY_FILTER,
  filter: SHOW_COMPLETED
}
```

## Action 生成器

**Action 生成器** are exactly that—functions that create actions. It's easy to conflate the terms “action” and “action creator,” so do your best to use the proper term.

在 [传统的 Flux](http://facebook.github.io/flux) 实现中，当调用 action 生成器时，一般会触发一个 dispatch，像这样：

```js
function addTodoWithDispatch(text) {
  const action = {
    type: ADD_TODO,
    text
  };
  dispatch(action);
}
```
不同的是，Redux 中的 action 生成器是没有任何副作用的 **纯函数**。只返回 action 这么简单。

```js
function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  };
}
```

这让代码更易于测试和便携。把方法的结果传给 `dispatch()` 方法 即可真正实例化 dispatch。

```js
dispatch(addTodo(text));
dispatch(completeTodo(index));
```

或者创建一个 **被绑定的 action 生成器** 来自动 dispatch：

```js
const boundAddTodo = (text) => dispatch(addTodo(text));
const boundCompleteTodo = (index) => dispatch(CompleteTodo(index));
```

可以这样调用：

```
boundAddTodo(text);
boundCompleteTodo(index);
```

store 里能直接通过 [`store.dispatch()`](../api/Store.md#dispatch) 调用 `dispatch()` 方法，但是多数情况下你会使用 [react-redux](http://github.com/gaearon/react-redux) 提供的 `connect()` 帮助器来调用。[`bindActionCreators()`](../api/bindActionCreators.md) 可以自动把多个 action 生成器 绑定到 `dispatch()` 方法上。

## 源码

### `actions.js`

```js
/*
 * action 类型
 */

export const ADD_TODO = 'ADD_TODO';
export const COMPLETE_TODO = 'COMPLETE_TODO';
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'

/*
 * 其它的常量
 */

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
};

/*
 * action 生成器
 */

export function addTodo(text) {
  return { type: ADD_TODO, text };
}

export function completeTodo(index) {
  return { type: COMPLETE_TODO, index };
}

export function setVisibilityFilter(filter) {
  return { type: SET_VISIBILITY_FILTER, filter };
}
```

## 下一步

现在让我们 [开发一些 reducers](Reducers.md) 来指定当 action 发起时 state 应该如何更新。

>##### 高级用户建议
>如果你已经熟悉这些基本概念且已经完成了这个示例，不要忘了看一下在 [高级教程](../advanced/README.md) 中的 [异步 actions] (../advanced/AsyncActions.md)，你将学习如何处理 AJAX 响应和如何把 action 生成器组合成异步控制流。