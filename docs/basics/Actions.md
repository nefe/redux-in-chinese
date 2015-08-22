# Actions

首先，让我们来给 action 下个定义。

**Actions** 是把数据从应用（译者注：这里之所以不叫 view 是因为这些数据有可能是服务器响应，用户输入或其它非 view 的数据 ）传到 store 的有效载荷。它是 store 数据的**惟一**来源。用法是通过 [`store.dispatch()`](../api/Store.md#dispatch) 把 action 传到 store。

添加新 todo 任务的 action 是这样的：

```js
{
  type: 'ADD_TODO',
  text: 'Build my first Redux app'
}
```

Action 本质是 JavaScript 普通对象。我们约定，action 内使用一个字符串类型的 `type` 字段来表示将要执行的动作。多数情况下，`type` 会被定义成字符串常量。当应用规模越来越大时，建议使用单独的模块或文件来存放 action。

```js
import { ADD_TODO, REMOVE_TODO } from '../actionTypes';
```

>##### 样板文件使用提醒

>使用单独的模块或文件来定义 action type 常量并不是必须的，甚至根本不需要定义。对于小应用来说，使用字符串做 action type 更方便些。不过，在大型应用中最多把它们显式地定义成常量。参照 [减少样板代码](../recipes/ReducingBoilerplate.md) 获取保持代码干净的实践经验。

除了 `type` 字段外，action 对象的结构完全取决于你。参照 [Flux 标准 Action](https://github.com/acdlite/flux-standard-action) 获取如何组织 action 的建议。

这时，我们还需要再添加一个 action type 来标记任务完成。因为数据是存放在数组中的，我们通过 `index` 来标识任务。实际项目中一般会在新建内容的时候生成惟一的 ID 做标识。

```js
{
  type: COMPLETE_TODO,
  index: 5
}
```
**action 中传递的数据越少越好**。比如，这里传递 `index` 就比把整个任务对象传过去要好。

最后，再添加一个 action 类型来表示当前展示的任务状态。

```js
{
  type: SET_VISIBILITY_FILTER,
  filter: SHOW_COMPLETED
}
```

## Action 创建函数

**Action 创建函数** 就是生成 action 的方法。“action” 和 “action 创建函数” 这两个概念很容易混在一起，使用时最好注意区分。

在 [传统的 Flux](http://facebook.github.io/flux) 实现中，当调用 action 创建函数时，一般会触发一个 dispatch，像这样：

```js
function addTodoWithDispatch(text) {
  const action = {
    type: ADD_TODO,
    text
  };
  dispatch(action);
}
```
不同的是，Redux 中的 action 创建函数是 **纯函数**，它没有任何副作用，只是返回 action 对象而已。

```js
function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  };
}
```

这让代码更易于测试和移植。只需把 action 创建函数的结果传给 `dispatch()` 方法即可实例化 dispatch。

```js
dispatch(addTodo(text));
dispatch(completeTodo(index));
```

或者创建一个 **被绑定的 action 创建函数** 来自动 dispatch：

```js
const boundAddTodo = (text) => dispatch(addTodo(text));
const boundCompleteTodo = (index) => dispatch(CompleteTodo(index));
```

可以这样调用：

```
boundAddTodo(text);
boundCompleteTodo(index);
```

store 里能直接通过 [`store.dispatch()`](../api/Store.md#dispatch) 调用 `dispatch()` 方法，但是多数情况下你会使用 [react-redux](http://github.com/gaearon/react-redux) 提供的 `connect()` 帮助器来调用。[`bindActionCreators()`](../api/bindActionCreators.md) 可以自动把多个 action 创建函数 绑定到 `dispatch()` 方法上。

## 源码

### `actions.js`

```js
/*
 * action 类型
 */

export const ADD_TODO = 'ADD_TODO';
export const COMPLETE_TODO = 'COMPLETE_TODO';
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';

/*
 * 其它的常量
 */

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
};

/*
 * action 创建函数
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

现在让我们 [开发一些 reducers](Reducers.md) 来指定发起 action 后 state 应该如何更新。

>##### 高级用户建议
>如果你已经熟悉这些基本概念且已经完成了这个示例，不要忘了看一下在 [高级教程](../advanced/README.md) 中的 [异步 actions] (../advanced/AsyncActions.md)，你将学习如何处理 AJAX 响应和如何把 action 创建函数组合成异步控制流。