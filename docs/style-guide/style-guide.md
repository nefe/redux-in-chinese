---
id: style-guide
title: 风格引导
description: 'Redux风格引导：Redux的推荐使用方法和最佳实践'
hide_title: true
sidebar_label: '风格引导: 最佳实践'
---

import { DetailedExplanation } from '../components/DetailedExplanation'

<div class="style-guide">

# Redux 风格引导

## 引言

这篇文章为你编写 Redux 代码提供官方的风格指导。**列出我们推荐的模式, 最佳实践, 以及编写 Redux 应用的推荐方法。**

Redux 核心库和绝大多数的 Redux 文档都是无观点的（unopinionated）。使用 Redux 有很多种方法，而且很多时候根本就没有唯一“正确”的方法。

然而，经过时间和实践的证明，一些方法就是比其他的方法更优越。此外，很多开发者也要求我们提供官方引导，从而减少决策的疲劳。

基于以上背景, **我们将这些推荐写法都列出来，让你避免出现错误、将精力放在非业务代码身上，以及避免不满足规范的代码**。我们也知道团队的编码偏好是多种多样的，且不同的项目有不同的需求，根本就没有一种风格指导能满足所有情况。**我们推荐你遵循这些推荐，但你也需要评估这些场景是否适用于你的需求**。

最后，我们感谢 Vue 文档的作者，因为受到[Vue Style Guide page](https://vuejs.org/v2/style-guide/)的启发，才有了我们这篇文章。

## 规则分类

我们将规则分为以下三类：

### 优先级 A：必要

**这一级别的规则可以防止错误，所以要不计成本地遵守**。例外情况可能存在，但应该非常罕见，并且只能由具备 JavaScript 和 Redux 专业知识的开发者产生。

### 优先级 B：强烈推荐

这些规则在绝大多数的项目中都提高了代码可读性和开发体验。即使违反这些规则，代码仍然能运行，但仅能在极少数情况，有很正当理由的时候再去违反这些规则。**只要合理，请尽可能遵守这些规则**。

### 优先级 C：推荐

你可以选择这些同样优秀选择中的任意一种来保证一致性。在这些规则中，**我们介绍了每个每种规则并推荐了一个默认选项**。这意味着你可以在代码库中自由地做出不同的选择，只要保持一致性并有充分的理由。但是，请慎重！

<div class="priority-rules priority-essential">

## A 级优先规则: 必要

### 不要修改 State

修改 state 是 Redux 应用 bug 的最常见的诱因，包括组件没有正确再渲染，且阻止了 Redux DevTools 的时间穿梭调试。无论是 reducers 中还是任意其他应用代码中，**都要始终避免 state 的真实变换**。

请使用类似于[`redux-immutable-state-invariant`](https://github.com/leoasis/redux-immutable-state-invariant) 的工具在开发中捕获，并使用[Immer](https://immerjs.github.io/immer/)库来避免偶然的 state 更新.

> **注意**：修改已有值的 _副本_ 是没问题的——这是一种朴素的 immutable 更新方式。 同样的， 如果我们使用了 Immer 库做 immutable 更新， 编写 "mutating" 逻辑也是允许的，因为真实的数据没有被修改—— Immer 在内部进行了安全的变化追踪并且生成了新的 immutably 值。

### Reducers 不能产生副作用

Reducer 函数必须*只* 依赖于 `state` 和 `action` 参数，且必须重新计算并返回一个新的 state。**其中禁止执行任何异步代码（AJAX 调用, timeouts, promises），生成随机值 （`Date.now()`, `Math.random()`，在 reducer 外面修改变量，或者执行一些修改 reducer 函数作用于之外变量的代码**。

> **注意**：只要符合同样的规则，在 reducer 中调用外部定义的一些方法，比如从库或工具类中 import 的函数等，也是可以的。

<DetailedExplanation title="详细说明">

此规则的目的是确保在调用时 reducers 的行为可预测。例如，如果你正在进行时间旅行调试，则可能会多次调用 reducer 函数，并根据之前的 actions 生成“当前”状态值。如果 reducer 有副作用，这将导致在调试过程中产生了这些副作用，并导致应用程序以意料之外的方式运行。

这条规则也有一些灰色地带。严格来说，有一些代码也是副作用，比如 `console.log(state)`，但是实际上它对应用程序没有实质行的行为。

</DetailedExplanation>

### 不要把不可序列化的值放进 State 或 Action

**不要把不可序列化的值放进 Redux store 或者 dispatch 的 actions，比如 Promises、Symbols、Maps/Sets、functions、或类的实例**。这一点保证 Redux DevTools 按照预期方式工作。也保证 UI 按照预期方式更新。

> **例外**：有时你也可以将非可序列化数据放进 action _当且仅当_ 该 action 在传递到 reducer 之前会被 Middleware 拦截住并不继续向下传递。`redux-thunk` 和 `redux-promise` 就是个例子。

### 一个应用只有一个 Redux Store

**一个标准的 Redux 应用应有且仅有一个 Store 实例（单例），供整个应用使用**。它应该用一个单独的文件比如`store.js`定义出来。

理想情况下，不应该有任意一个应用逻辑将其直接引入。他应该使用通过`<Provider>` 传递给 React 组件树，或通过 thunks 这样的 middlewares 间接引用。在极少数的用例中，你可能需要将其导入其他逻辑文件，但这应该是没有办法的办法。

</div>

<div class="priority-rules priority-stronglyrecommended">

## A 级优先规则: 强烈推荐

### 在写 Redux 逻辑时使用 Redux Toolkit

**[Redux Toolkit](../redux-toolkit/overview.md) 是我们推荐的 Redux 工具集**。它囊括了一些封装可我们最佳实践的方法，包括设置 store 使其能捕获 mutations 并激活 Redux DevTools 拓展，使用 Immer 简化 immutable 更新等等。

写 Redux 的时候也不是必须要使用 RTK，如果愿意的话你也可以用一些其他的方法，但是**使用 RTK 会简化代码逻辑，并确保应用程序遵循好的 Redux 默认行为**。

### 使用 Immer 做 Immutable 更新

手写 immutable 更新逻辑通常比较复杂，却容易出错。[Immer](https://immerjs.github.io/immer/)库可以让你写“可变”更新逻辑来简化 immutable 更新，即便在应用开发的其他任意地方为了捕捉 mutation 而 freeze 了 state。

**我们建议使用 Immer 编写 immutable 更新逻辑，这一点已经作为了 [Redux Toolkit](../redux-toolkit/overview.md) 偏好的一部分**。

<a id="structure-files-as-feature-folders-or-ducks"></a>

### 将文件结构构造为具有单文件逻辑的功能性文件夹

Redux 本身并不关心应用的目录结构怎么组织。但是，按照一定规则将 Redux 逻辑收归到一处使得代码更可维护。

正因如此，**我们建议大多数的应用程序因该按照“功能性文件夹”的方法来组织目录结构**（即具有统一功能的文件都在一个文件夹里）。给定一个特定文件夹，**有相对应功能的 Redux 逻辑 都应该被写进单独的一个 "slice" 文件**，推荐使用 Redux Toolkit 的 `createSlice` API。（这也是俗称的 ["ducks" 模式](https://github.com/erikras/ducks-modular-redux)）。虽然一些老的 Redux 代码库经常使用一种 "folder-by-type" 方式，将“actions”和“reducers”分别写到不同的文件夹中，但是将相关逻辑都归到一起使得定位代码和修改代码变得更容易。

<DetailedExplanation title="详细说明：目录结构的示例">
一个目录结构的示例，大概长这样：

- `/src`
  - `index.tsx`: React 组件树渲染的入口文件
  - `/app`
    - `store.ts`: store 配置
    - `rootReducer.ts`: 根 reducer (可选)
    - `App.tsx`: React 根组件
  - `/common`: hooks、通用组件、工具方法等
  - `/features`: 包含所有的“功能性文件夹”
    - `/todos`: 但个功能的文件夹
      - `todosSlice.ts`: Redux reducer 逻辑和相关的 action
      - `Todos.tsx`: 一个 React 组件

`/app` 包含应用级别的一些配置和布局等，这些配置和布局取决于项目中的其他文件夹

`/common` 包含真正通用和可重用的工具方法和组件

`/features` 是一个存放包含一个特定功能所有的相关方法的文件夹。在本例中，`todosSlice.ts` 就是一个"duck" 风格的文件，其中包含了 RTK 的 `createSlice()` 函数的调用，并导出了 slice reducer 和 action creators。

</DetailedExplanation>

### 尽可能的把逻辑放进 Reducers

尽可能**试着将计算新的 state 的逻辑代码写进合适的 reducer，而不是准备数据并 dispatch action 的那段代码中**（比如 click handler）。这一点有助于确保更多实际应用程序逻辑易于测试，使得时间旅行调试更高效，更帮助避免导致 mutation 和 bug 的一般性错误。

存在一些合理的用例，新的 state 中的某些或全部数据需要被首先计算（例如生成唯一的 ID），但是这种情况应该维持在一个最低的限度。

<DetailedExplanation title="详细说明">

Redux 核心实际上并不关心新的 state 是在 reducer 中计算的还是在 action 创建逻辑中计算的。例如，对于 todo 应用程序，“切换 todo 状态”操作的逻辑要求 immutable 更新 todo 数组。让 action 只携带 todo ID 并在 reducer 中计算新数组是是合法的：

```js
// Click handler:
const onTodoClicked = (id) => {
    dispatch({type: "todos/toggleTodo", payload: {id}})
}

// Reducer:
case "todos/toggleTodo": {
    return state.map(todo => {
        if(todo.id !== action.payload.id) return todo;

        return {...todo, completed: !todo.completed };
    })
}
```

并且，首先计算出一个新的数组，并将整个数组放进 action 中也是可以的：

```js
// Click handler:
const onTodoClicked = id => {
  const newTodos = todos.map(todo => {
    if (todo.id !== id) return todo

    return { ...todo, completed: !todo.completed }
  })

  dispatch({ type: 'todos/toggleTodo', payload: { todos: newTodos } })
}

// Reducer:
case "todos/toggleTodo":
    return action.payload.todos;
```

但是，我们推荐在 reducer 中完成这些逻辑，有以下几点原因：

- 由于 reducer 都是纯函数，所以他们更容易测试 —— 你只需要调用 `const result = reducer(testState, action)`，并且断言你期望的结果。所以，在 reducer 中执行的逻辑越多，可测试的逻辑就越多。
- Redux state 的更新必须始终遵守[immutable 更新的原则](../usage/structuring-reducers/ImmutableUpdatePatterns.md)。大多数的 Redux 使用者都明白在 reducer 中遵循这些规则，但也可能不知道如果要在 reducer 的 _外部_ 计算出一个新的 state _也_ 必须这么干。这样很容易产生错误，比如意外的 mutation 或者甚至从 Redux store 中读取一个值并将其直接回传到 action 中。在 reducer 中执行所有的 state 计算 能避免造成这些错误。
- 如果你正在使用 Redux Toolkit 或 Immer 库，那么在 reducers 编写 immutable 更新逻辑 是相当简单的，并且 Immer 会 freeze 掉 state 从而捕获意外的 mutations 错误。
- 时间旅行调试让你可以 "撤销" 已经被 dispatch 的 action，且可以 "重做" dispatch action。此外，reducers 的热重载通常涉及到使用新的 reducer 来执行现有的 action。 如果你的 action 没问题但是 reducer 是有 bug 的，你可以修改 recuder 修复 bug，并热重载这个 reducer，你就能获得一个正确的新 state。如果 action 本身出现错误，你只需要重新执行产生错误的那一步的 action。所以，将更多的逻辑放进 reducer 后，调试也变方便了。
- 最后，把更新数据的逻辑放进 reducers 而不是让它们随机散落在应用代码的其他地方意味着你更方便找到这些逻辑了。

</DetailedExplanation>

### Reducers 应该拥有 State Shape

Redux 根 state 是被单一的根 reducer 函数持有和计算的。从可维护性的角度，reducer 会被按照键/值对的形式划分为一个个 "slice"，**每个 "slice reducer" 都负责初始化值且计算和更新 slice state 值**。

此外，slice reducers should exercise control over what other values are returned as part of the calculated state. **Minimize the use of "blind spreads/returns"** like `return action.payload` or `return {...state, ...action.payload}`, because those rely on the code that dispatched the action to correctly format the contents, and the reducer effectively gives up its ownership of what that state looks like. That can lead to bugs if the action contents are not correct.

> **Note**: A "spread return" reducer may be a reasonable choice for scenarios like editing data in a form, where writing a separate action type for each individual field would be time-consuming and of little benefit.

<DetailedExplanation>
Picture a "current user" reducer that looks like:

```js
const initialState = {
    firstName: null,
    lastName: null,
    age: null,
};

export default usersReducer = (state = initialState, action) {
    switch(action.type) {
        case "users/userLoggedIn": {
            return action.payload;
        }
        default: return state;
    }
}
```

In this example, the reducer completely assumes that `action.payload` is going to be a correctly formatted object.

However, imagine if some part of the code were to dispatch a "todo" object inside the action, instead of a "user" object:

```js
dispatch({
  type: 'users/userLoggedIn',
  payload: {
    id: 42,
    text: 'Buy milk'
  }
})
```

The reducer would blindly return the todo, and now the rest of the app would likely break when it tries to read the user from the store.

This could be at least partly fixed if the reducer has some validation checks to ensure that `action.payload` actually has the right fields, or tries to read the right fields out by name. That does add more code, though, so it's a question of trading off more code for safety.

Use of static typing does make this kind of code safer and somewhat more acceptable. If the reducer knows that `action` is a `PayloadAction<User>`, then it _should_ be safe to do `return action.payload`.

</DetailedExplanation>

### Name State Slices Based On the Stored Data

As mentioned in [Reducers Should Own the State Shape ](#reducers-should-own-the-state-shape), the standard approach for splitting reducer logic is based on "slices" of state. Correspondingly, `combineReducers` is the standard function for joining those slice reducers into a larger reducer function.

The key names in the object passed to `combineReducers` will define the names of the keys in the resulting state object. Be sure to name these keys after the data that is kept inside, and avoid use of the word "reducer" in the key names. Your object should look like `{users: {}, posts: {}}`, rather than `{usersReducer: {}, postsReducer: {}}`.

<DetailedExplanation>
ES6 object literal shorthand makes it easy to define a key name and a value in an object at the same time:

```js
const data = 42
const obj = { data }
// same as: {data: data}
```

`combineReducers` accepts an object full of reducer functions, and uses that to generate state objects that have the same key names. This means that the key names in the functions object define the key names in the state object.

This results in a common mistake, where a reducer is imported using "reducer" in the variable name, and then passed to `combineReducers` using the object literal shorthand:

```js
import usersReducer from 'features/users/usersSlice'

const rootReducer = combineReducers({
  usersReducer
})
```

In this case, use of the object literal shorthand created an object like `{usersReducer: usersReducer}`. So, "reducer" is now in the state key name. This is redundant and useless.

Instead, define key names that only relate to the data inside. We suggest using explicit `key: value` syntax for clarity:

```js
import usersReducer from 'features/users/usersSlice'
import postsReducer from 'features/posts/postsSlice'

const rootReducer = combineReducers({
  users: usersReducer,
  posts: postsReducer
})
```

It's a bit more typing, but it results in the most understandable code and state definition.

</DetailedExplanation>

### Organize State Structure Based on Data Types, Not Components

Root state slices should be defined and named based on the major data types or areas of functionality in your application, not based on which specific components you have in your UI. This is because there is not a strict 1:1 correlation between data in the Redux store and components in the UI, and many components may need to access the same data. Think of the state tree as a sort of global database that any part of the app can access to read just the pieces of state needed in that component.

For example, a blogging app might need to track who is logged in, information on authors and posts, and perhaps some info on what screen is active. A good state structure might look like `{auth, posts, users, ui}`. A bad structure would be something like `{loginScreen, usersList, postsList}`.

### Treat Reducers as State Machines

Many Redux reducers are written "unconditionally". They only look at the dispatched action and calculate a new state value, without basing any of the logic on what the current state might be. This can cause bugs, as some actions may not be "valid" conceptually at certain times depending on the rest of the app logic. For example, a "request succeeded" action should only have a new value calculated if the state says that it's already "loading", or an "update this item" action should only be dispatched if there is an item marked as "being edited".

To fix this, **treat reducers as "state machines", where the combination of both the current state _and_ the dispatched action determines whether a new state value is actually calculated**, not just the action itself unconditionally.

<DetailedExplanation>

A [finite state machine](https://en.wikipedia.org/wiki/Finite-state_machine) is a useful way of modeling something that should only be in one of a finite number of "finite states" at any time. For example, if you have a `fetchUserReducer`, the finite states can be:

- `"idle"` (fetching not started yet)
- `"loading"` (currently fetching the user)
- `"success"` (user fetched successfully)
- `"failure"` (user failed to fetch)

To make these finite states clear and [make impossible states impossible](https://kentcdodds.com/blog/make-impossible-states-impossible), you can specify a property that holds this finite state:

```js
const initialUserState = {
  status: 'idle', // explicit finite state
  user: null,
  error: null
}
```

With TypeScript, this also makes it easy to use [discriminated unions](https://basarat.gitbook.io/typescript/type-system/discriminated-unions) to represent each finite state. For instance, if `state.status === 'success'`, then you would expect `state.user` to be defined and wouldn't expect `state.error` to be truthy. You can enforce this with types.

Typically, reducer logic is written by taking the action into account first. When modeling logic with state machines, it's important to take the state into account first. Creating "finite state reducers" for each state helps encapsulate behavior per state:

```js
import {
  FETCH_USER,
  // ...
} from './actions'

const IDLE_STATUS = 'idle';
const LOADING_STATUS = 'loading';
const SUCCESS_STATUS = 'success';
const FAILURE_STATUS = 'failure';

const fetchIdleUserReducer = (state, action) => {
  // state.status is "idle"
  switch (action.type) {
    case FETCH_USER:
      return {
        ...state,
        status: LOADING_STATUS
      }
    }
    default:
      return state;
  }
}

// ... other reducers

const fetchUserReducer = (state, action) => {
  switch (state.status) {
    case IDLE_STATUS:
      return fetchIdleUserReducer(state, action);
    case LOADING_STATUS:
      return fetchLoadingUserReducer(state, action);
    case SUCCESS_STATUS:
      return fetchSuccessUserReducer(state, action);
    case FAILURE_STATUS:
      return fetchFailureUserReducer(state, action);
    default:
      // this should never be reached
      return state;
  }
}
```

Now, since you're defining behavior per state instead of per action, you also prevent impossible transitions. For instance, a `FETCH_USER` action should have no effect when `status === LOADING_STATUS`, and you can enforce that, instead of accidentally introducing edge-cases.

</DetailedExplanation>

### Normalize Complex Nested/Relational State

Many applications need to cache complex data in the store. That data is often received in a nested form from an API, or has relations between different entities in the data (such as a blog that contains Users, Posts, and Comments).

**Prefer storing that data in [a "normalized" form](../usage/structuring-reducers/NormalizingStateShape.md) in the store**. This makes it easier to look up items based on their ID and update a single item in the store, and ultimately leads to better performance patterns.

### Keep State Minimal and Derive Additional Values

Whenever possible, **keep the actual data in the Redux store as minimal as possible, and _derive_ additional values from that state as needed**. This includes things like calculating filtered lists or summing up values. As an example, a todo app would keep an original list of todo objects in state, but derive a filtered list of todos outside the state whenever the state is updated. Similarly, a check for whether all todos have been completed, or number of todos remaining, can be calculated outside the store as well.

This has several benefits:

- The actual state is easier to read
- Less logic is needed to calculate those additional values and keep them in sync with the rest of the data
- The original state is still there as a reference and isn't being replaced

Deriving data is often done in "selector" functions, which can encapsulate the logic for doing the derived data calculations. In order to improve performance, these selectors can be _memoized_ to cache previous results, using libraries like `reselect` and `proxy-memoize`.

### Model Actions as Events, Not Setters

Redux does not care what the contents of the `action.type` field are - it just has to be defined. It is legal to write action types in present tense (`"users/update"`), past tense (`"users/updated"`), described as an event (`"upload/progress"`), or treated as a "setter" (`"users/setUserName"`). It is up to you to determine what a given action means in your application, and how you model those actions.

However, **we recommend trying to treat actions more as "describing events that occurred", rather than "setters"**. Treating actions as "events" generally leads to more meaningful action names, fewer total actions being dispatched, and a more meaningful action log history. Writing "setters" often results in too many individual action types, too many dispatches, and an action log that is less meaningful.

<DetailedExplanation>
Imagine you've got a restaurant app, and someone orders a pizza and a bottle of Coke.  You could dispatch an action like:

```js
{ type: "food/orderAdded",  payload: {pizza: 1, coke: 1} }
```

Or you could dispatch:

```js
{
    type: "orders/setPizzasOrdered",
    payload: {
        amount: getState().orders.pizza + 1,
    }
}

{
    type: "orders/setCokesOrdered",
    payload: {
        amount: getState().orders.coke + 1,
    }
}
```

The first example would be an "event". "Hey, someone ordered a pizza and a pop, deal with it somehow".

The second example is a "setter". "I _know_ there are fields for 'pizzas ordered' and 'pops ordered', and I am commanding you to set their current values to these numbers".

The "event" approach only really needed a single action to be dispatched, and it's more flexible. It doesn't matter how many pizzas were already ordered. Maybe there's no cooks available, so the order gets ignored.

With the "setter" approach, the client code needed to know more about what the actual structure of the state is, what the "right" values should be, and ended up actually having to dispatch multiple actions to finish the "transaction".

</DetailedExplanation>

### Write Meaningful Action Names

The `action.type` field serves two main purposes:

- Reducer logic checks the action type to see if this action should be handled to calculate a new state
- Action types are shown in the Redux DevTools history log for you to read

Per [Model Actions as "Events"](#model-actions-as-events-not-setters), the actual contents of the `type` field do not matter to Redux itself. However, the `type` value _does_ matter to you, the developer. **Actions should be written with meaningful, informative, descriptive type fields**. Ideally, you should be able to read through a list of dispatched action types, and have a good understanding of what happened in the application without even looking at the contents of each action. Avoid using very generic action names like `"SET_DATA"` or `"UPDATE_STORE"`, as they don't provide meaningful information on what happened.

### Allow Many Reducers to Respond to the Same Action

Redux reducer logic is intended to be split into many smaller reducers, each independently updating their own portion of the state tree, and all composed back together to form the root reducer function. When a given action is dispatched, it might be handled by all, some, or none of the reducers.

As part of this, you are encouraged to **have many reducer functions all handle the same action separately** if possible. In practice, experience has shown that most actions are typically only handled by a single reducer function, which is fine. But, modeling actions as "events" and allowing many reducers to respond to those actions will typically allow your application's codebase to scale better, and minimize the number of times you need to dispatch multiple actions to accomplish one meaningful update.

### Avoid Dispatching Many Actions Sequentially

**Avoid dispatching many actions in a row to accomplish a larger conceptual "transaction"**. This is legal, but will usually result in multiple relatively expensive UI updates, and some of the intermediate states could be potentially invalid by other parts of the application logic. Prefer dispatching a single "event"-type action that results in all of the appropriate state updates at once, or consider use of action batching addons to dispatch multiple actions with only a single UI update at the end.

<DetailedExplanation>
There is no limit on how many actions you can dispatch in a row.  However, each dispatched action does result in execution of all store subscription callbacks (typically one or more per Redux-connected UI component), and will usually result in UI updates.

While UI updates queued from React event handlers will usually be batched into a single React render pass, updates queued _outside_ of those event handlers are not. This includes dispatches from most `async` functions, timeout callbacks, and non-React code. In those situations, each dispatch will result in a complete synchronous React render pass before the dispatch is done, which will decrease performance.

In addition, multiple dispatches that are conceptually part of a larger "transaction"-style update sequence will result in intermediate states that might not be considered valid. For example, if actions `"UPDATE_A"`, `"UPDATE_B"`, and `"UPDATE_C"` are dispatched in a row, and some code is expecting all three of `a`, `b`, and `c` to be updated together, the state after the first two dispatches will effectively be incomplete because only one or two of them has been updated.

If multiple dispatches are truly necessary, consider batching the updates in some way. Depending on your use case, this may just be batching React's own renders (possibly using [`batch()` from React-Redux](https://react-redux.js.org/api/batch)), debouncing the store notification callbacks, or grouping many actions into a larger single dispatch that only results in one subscriber notification. See [the FAQ entry on "reducing store update events"](../faq/Performance.md#how-can-i-reduce-the-number-of-store-update-events) for additional examples and links to related addons.

</DetailedExplanation>

### Evaluate Where Each Piece of State Should Live

The ["Three Principles of Redux"](../understanding/thinking-in-redux/ThreePrinciples.md) says that "the state of your whole application is stored in a single tree". This phrasing has been over-interpreted. It does not mean that literally _every_ value in the entire app _must_ be kept in the Redux store. Instead, **there should be a single place to find all values that _you_ consider to be global and app-wide**. Values that are "local" should generally be kept in the nearest UI component instead.

Because of this, it is up to you as a developer to decide what state should actually live in the Redux store, and what should stay in component state. **[Use these rules of thumb to help evaluate each piece of state and decide where it should live](../faq/OrganizingState.md#do-i-have-to-put-all-my-state-into-redux-should-i-ever-use-reacts-setstate)**.

### Use the React-Redux Hooks API

**Prefer using [the React-Redux hooks API (`useSelector` and `useDispatch`)](https://react-redux.js.org/api/hooks) as the default way to interact with a Redux store from your React components**. While the classic `connect` API still works fine and will continue to be supported, the hooks API is generally easier to use in several ways. The hooks have less indirection, less code to write, and are simpler to use with TypeScript than `connect` is.

The hooks API does introduce some different tradeoffs than `connect` does in terms of performance and data flow, but we now recommend them as the default.

<DetailedExplanation>

The [classic `connect` API](https://react-redux.js.org/api/connect) is a [Higher Order Component](https://reactjs.org/docs/higher-order-components.html). It generates a new wrapper component that subscribes to the store, renders your own component, and passes down data from the store and action creators as props.

This is a deliberate level of indirection, and allows you to write "presentational"-style components that receive all their values as props, without being specifically dependent on Redux.

The introduction of hooks has changed how most React developers write their components. While the "container/presentational" concept is still valid, hooks push you to write components that are responsible for requesting their own data internally by calling an appropriate hook. This leads to different approaches in how we write and test components and logic.

The indirection of `connect` has always made it a bit difficult for some users to follow the data flow. In addition, `connect`'s complexity has made it very difficult to type correctly with TypeScript, due to the multiple overloads, optional parameters, merging of props from `mapState` / `mapDispatch` / parent component, and binding of action creators and thunks.

`useSelector` and `useDispatch` eliminate the indirection, so it's much more clear how your own component is interacting with Redux. Since `useSelector` just accepts a single selector, it's much easier to define with TypeScript, and the same goes for `useDispatch`.

For more details, see Redux maintainer Mark Erikson's post and conference talk on the tradeoffs between hooks and HOCs:

- [Thoughts on React Hooks, Redux, and Separation of Concerns](https://blog.isquaredsoftware.com/2019/07/blogged-answers-thoughts-on-hooks/)
- [ReactBoston 2019: Hooks, HOCs, and Tradeoffs](https://blog.isquaredsoftware.com/2019/09/presentation-hooks-hocs-tradeoffs/)

Also see the [React-Redux hooks API docs](https://react-redux.js.org/api/hooks) for info on how to correctly optimize components and handle rare edge cases.

</DetailedExplanation>

### Connect More Components to Read Data from the Store

Prefer having more UI components subscribed to the Redux store and reading data at a more granular level. This typically leads to better UI performance, as fewer components will need to render when a given piece of state changes.

For example, rather than just connecting a `<UserList>` component and reading the entire array of users, have `<UserList>` retrieve a list of all user IDs, render list items as `<UserListItem userId={userId}>`, and have `<UserListItem>` be connected and extract its own user entry from the store.

This applies for both the React-Redux `connect()` API and the `useSelector()` hook.

### Use the Object Shorthand Form of `mapDispatch` with `connect`

The `mapDispatch` argument to `connect` can be defined as either a function that receives `dispatch` as an argument, or an object containing action creators. **We recommend always using [the "object shorthand" form of `mapDispatch`](https://react-redux.js.org/using-react-redux/connect-mapdispatch#defining-mapdispatchtoprops-as-an-object)**, as it simplifies the code considerably. There is almost never a real need to write `mapDispatch` as a function.

### Call `useSelector` Multiple Times in Function Components

**When retrieving data using the `useSelector` hook, prefer calling `useSelector` many times and retrieving smaller amounts of data, instead of having a single larger `useSelector` call that returns multiple results in an object**. Unlike `mapState`, `useSelector` is not required to return an object, and having selectors read smaller values means it is less likely that a given state change will cause this component to render.

However, try to find an appropriate balance of granularity. If a single component does need all fields in a slice of the state , just write one `useSelector` that returns that whole slice instead of separate selectors for each individual field.

### Use Static Typing

**Use a static type system like TypeScript or Flow rather than plain JavaScript**. The type systems will catch many common mistakes, improve the documentation of your code, and ultimately lead to better long-term maintainability. While Redux and React-Redux were originally designed with plain JS in mind, both work well with TS and Flow. Redux Toolkit is specifically written in TS and is designed to provide good type safety with a minimal amount of additional type declarations.

### Use the Redux DevTools Extension for Debugging

**Configure your Redux store to enable [debugging with the Redux DevTools Extension](https://github.com/reduxjs/redux-devtools/tree/main/extension)**. It allows you to view:

- The history log of dispatched actions
- The contents of each action
- The final state after an action was dispatched
- The diff in the state after an action
- The [function stack trace showing the code where the action was actually dispatched](https://github.com/reduxjs/redux-devtools/blob/main/extension/docs/Features/Trace.md)

In addition, the DevTools allows you to do "time-travel debugging", stepping back and forth in the action history to see the entire app state and UI at different points in time.

**Redux was specifically designed to enable this kind of debugging, and the DevTools are one of the most powerful reasons to use Redux**.

### Use Plain JavaScript Objects for State

Prefer using plain JavaScript objects and arrays for your state tree, rather than specialized libraries like Immutable.js. While there are some potential benefits to using Immutable.js, most of the commonly stated goals such as easy reference comparisons are a property of immutable updates in general, and do not require a specific library. This also keeps bundle sizes smaller and reduces complexity from data type conversions.

As mentioned above, we specifically recommend using Immer if you want to simplify immutable update logic, specifically as part of Redux Toolkit.

<DetailedExplanation>
Immutable.js has been semi-frequently used in Redux apps since the beginning.  There are several common reasons stated for using Immutable.js:

- Performance improvements from cheap reference comparisons
- Performance improvements from making updates thanks to specialized data structures
- Prevention of accidental mutations
- Easier nested updates via APIs like `setIn()`

There are some valid aspects to those reasons, but in practice, the benefits aren't as good as stated, and there's multiple negatives to using it:

- Cheap reference comparisons are a property of any immutable updates, not just Immutable.js
- Accidental mutations can be prevented via other mechanisms, such as using Immer (which eliminates accident-prone manual copying logic, and deep-freezes state in development by default) or `redux-immutable-state-invariant` (which checks state for mutations)
- Immer allows simpler update logic overall, eliminating the need for `setIn()`
- Immutable.js has a very large bundle size
- The API is fairly complex
- The API "infects" your application's code. All logic must know whether it's dealing with plain JS objects or Immutable objects
- Converting from Immutable objects to plain JS objects is relatively expensive, and always produces completely new deep object references
- Lack of ongoing maintenance to the library

The strongest remaining reason to use Immutable.js is fast updates of _very_ large objects (tens of thousands of keys). Most applications won't deal with objects that large.

Overall, Immutable.js adds too much overhead for too little practical benefit. Immer is a much better option.

</DetailedExplanation>

</div>

<div class="priority-rules priority-recommended">

## Priority C Rules: Recommended

### Write Action Types as `domain/eventName`

The original Redux docs and examples generally used a "SCREAMING_SNAKE_CASE" convention for defining action types, such as `"ADD_TODO"` and `"INCREMENT"`. This matches typical conventions in most programming languages for declaring constant values. The downside is that the uppercase strings can be hard to read.

Other communities have adopted other conventions, usually with some indication of the "feature" or "domain" the action is related to, and the specific action type. The NgRx community typically uses a pattern like `"[Domain] Action Type"`, such as `"[Login Page] Login"`. Other patterns like `"domain:action"` have been used as well.

Redux Toolkit's `createSlice` function currently generates action types that look like `"domain/action"`, such as `"todos/addTodo"`. Going forward, **we suggest using the `"domain/action"` convention for readability**.

### Write Actions Using the Flux Standard Action Convention

The original "Flux Architecture" documentation only specified that action objects should have a `type` field, and did not give any further guidance on what kinds of fields or naming conventions should be used for fields in actions. To provide consistency, Andrew Clark created a convention called ["Flux Standard Actions"](https://github.com/redux-utilities/flux-standard-action) early in Redux's development. Summarized, the FSA convention says that actions:

- Should always put their data into a `payload` field
- May have a `meta` field for additional info
- May have an `error` field to indicate the action represents a failure of some kind

Many libraries in the Redux ecosystem have adopted the FSA convention, and Redux Toolkit generates action creators that match the FSA format.

**Prefer using FSA-formatted actions for consistency**.

> **Note**: The FSA spec says that "error" actions should set `error: true`, and use the same action type as the "valid" form of the action. In practice, most developers write separate action types for the "success" and "error" cases. Either is acceptable.

### Use Action Creators

"Action creator" functions started with the original "Flux Architecture" approach. With Redux, action creators are not strictly required. Components and other logic can always call `dispatch({type: "some/action"})` with the action object written inline.

However, using action creators provides consistency, especially in cases where some kind of preparation or additional logic is needed to fill in the contents of the action (such as generating a unique ID).

**Prefer using action creators for dispatching any actions**. However, rather than writing action creators by hand, **we recommend using the `createSlice` function from Redux Toolkit, which will generate action creators and action types automatically**.

### Use Thunks for Async Logic

Redux was designed to be extensible, and the middleware API was specifically created to allow different forms of async logic to be plugged into the Redux store. That way, users wouldn't be forced to learn a specific library like RxJS if it wasn't appropriate for their needs.

This led to a wide variety of Redux async middleware addons being created, and that in turn has caused confusion and questions over which async middleware should be used.

**We recommend [using the Redux Thunk middleware by default](https://github.com/reduxjs/redux-thunk)**, as it is sufficient for most typical use cases (such as basic AJAX data fetching). In addition, use of the `async/await` syntax in thunks makes them easier to read.

If you have truly complex async workflows that involve things like cancellation, debouncing, running logic after a given action was dispatched, or "background-thread"-type behavior, then consider adding more powerful async middleware like Redux-Saga or Redux-Observable.

### Move Complex Logic Outside Components

We have traditionally suggested keeping as much logic as possible outside components. That was partly due to encouraging the "container/presentational" pattern, where many components simply accept data as props and display UI accordingly, but also because dealing with async logic in class component lifecycle methods can become difficult to maintain.

**We still encourage moving complex synchronous or async logic outside components, usually into thunks**. This is especially true if the logic needs to read from the store state.

However, **the use of React hooks does make it somewhat easier to manage logic like data fetching directly inside a component**, and this may replace the need for thunks in some cases.

### Use Selector Functions to Read from Store State

"Selector functions" are a powerful tool for encapsulating reading values from the Redux store state and deriving further data from those values. In addition, libraries like Reselect enable creating memoized selector functions that only recalculate results when the inputs have changed, which is an important aspect of optimizing performance.

**We strongly recommend using memoized selector functions for reading store state whenever possible**, and recommend creating those selectors with Reselect.

However, don't feel that you _must_ write selector functions for every field in your state. Find a reasonable balance for granularity, based on how often fields are accessed and updated, and how much actual benefit the selectors are providing in your application.

### Name Selector Functions as `selectThing`

**We recommend prefixing selector function names with the word `select`**, combined with a description of the value being selected. Examples of this would be `selectTodos`, `selectVisibleTodos`, and `selectTodoById`.

### Avoid Putting Form State In Redux

**Most form state shouldn't go in Redux**. In most use cases, the data is not truly global, is not being cached, and is not being used by multiple components at once. In addition, connecting forms to Redux often involves dispatching actions on every single change event, which causes performance overhead and provides no real benefit. (You probably don't need to time-travel backwards one character from `name: "Mark"` to `name: "Mar"`.)

Even if the data ultimately ends up in Redux, prefer keeping the form edits themselves in local component state, and only dispatching an action to update the Redux store once the user has completed the form.

There are use cases when keeping form state in Redux does actually make sense, such as WYSIWYG live previews of edited item attributes. But, in most cases, this isn't necessary.

</div>

</div>
