# 数据流

**严格的单向数据流**是 Redux 架构的设计核心。

这意味着应用中所有的数据都遵循相同的生命周期，这样可以让应用变得更加可预测且容易理解。同时也鼓励做数据范式化，这样可以避免使用多个且独立的无法相互引用的重复数据。

如果这些理由还不足以令你信服，读一下 [动机](../introduction/Motivation.md) 和 [Flux 案例](https://medium.com/@dan_abramov/the-case-for-flux-379b7d1982c6)，这里面有更加详细的单向数据流优势分析。虽然 Redux 就不是严格意义上的 [Flux](../introduction/Relation to Other Libraries.md)，但它们有共同的设计思想。

Redux 应用中数据的生命周期遵循下面 4 个步骤： 

1. **调用** [`store.dispatch(action)`](../api/Store.md#dispatch)。

  [Action](Actions.md) 就是一个描述“发生了什么”的普通对象。比如：

    ```js
    { type: 'LIKE_ARTICLE', articleId: 42 };
    { type: 'FETCH_USER_SUCCESS', response: { id: 3, name: 'Mary' } };
    { type: 'ADD_TODO', text: 'Read the Redux docs.'};
    ```

  可以把 action 理解成新闻的摘要。如 “玛丽喜欢42号文章。” 或者 “任务列表里添加了'学习 Redux 文档'”。

  你可以在任何地方调用 [`store.dispatch(action)`](../api/Store.md#dispatch)，包括组件中、XHR 回调中、甚至定时器中。

2. **Redux store 调用传入的 reducer 函数。**

  [Store](Store.md) 会把两个参数传入 [reducer](Reducers.md)： 当前的 state 树和 action。例如，在这个 todo 应用中，根 reducer 可能接收这样的数据：

    ```js
    // 当前应用的 state（todos 列表和选中的过滤器）
    let previousState = {
      visibleTodoFilter: 'SHOW_ALL',
      todos: [
        {
          text: 'Read the docs.',
          complete: false
        }
      ]
    }

    // 将要执行的 action（添加一个 todo）
    let action = {
      type: 'ADD_TODO',
      text: 'Understand the flow.'
    }

    // render 返回处理后的应用状态
    let nextState = todoApp(previousState, action);
    ```

    注意 reducer 是纯函数。它仅仅用于计算下一个 state。它应该是完全可预测的：多次传入相同的输入必须产生相同的输出。它不应做有副作用的操作，如 API 调用或路由跳转。这些应该在 dispatch action 前发生。

3. **根 reducer 应该把多个子 reducer 输出合并成一个单一的 state 树。**

  根 reducer 的结构完全由你决定。Redux 原生提供[`combineReducers()`](../api/combineReducers.md)辅助函数，来把根 reducer 拆分成多个函数，用于分别处理 state 树的一个分支。

  下面演示 [`combineReducers()`](../api/combineReducers.md) 如何使用。假如你有两个 reducer：一个是 todo 列表，另一个是当前选择的过滤器设置：

    ```js
    function todos(state = [], action) {
      // 省略处理逻辑...
      return nextState;
    }

    function visibleTodoFilter(state = 'SHOW_ALL', action) {
      // 省略处理逻辑...
      return nextState;
    }

    let todoApp = combineReducers({
      todos,
      visibleTodoFilter
    })
    ```

  当你触发 action 后，`combineReducers` 返回的 `todoApp` 会负责调用两个 reducer：

    ```js
    let nextTodos = todos(state.todos, action);
    let nextVisibleTodoFilter = visibleTodoFilter(state.visibleTodoFilter, action);
    ```

  然后会把两个结果集合并成一个 state 树：

    ```js
    return {
      todos: nextTodos,
      visibleTodoFilter: nextVisibleTodoFilter
    };
    ```

  虽然 [`combineReducers()`](../api/combineReducers.md) 是一个很方便的辅助工具，你也可以选择不用；你可以自行实现自己的根 reducer！

4. **Redux store 保存了根 reducer 返回的完整 state 树。**

  这个新的树就是应用的下一个 state！所有订阅 [`store.subscribe(listener)`](../api/Store.md#subscribe) 的监听器都将被调用；监听器里可以调用 [`store.getState()`](../api/Store.md#getState) 获得当前 state。

  现在，可以应用新的 state 来更新 UI。如果你使用了 [React Redux](https://github.com/gaearon/react-redux) 这类的绑定库，这时就应该调用 `component.setState(newState)` 来更新。

## 下一步

现在你已经理解了 Redux 如何工作，是时候[结合 React 开发应用](UsageWithReact.md)了。

>##### 高级用户使用注意
>如果你已经熟悉了基础概念且完成了这个教程，可以学习[高级教程](../advanced/README.md)中的[异步数据流](../advanced/AsyncFlow.md)，你将学到如何使用 middleware 在 [异步 action](../advanced/AsyncActions.md) 到达 reducer 前处理它们。
