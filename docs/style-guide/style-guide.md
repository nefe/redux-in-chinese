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

### Reducers 应该持有 State Shape

Redux 根 state 是被唯一的一个的根 reducer 函数持有和计算的。从可维护性的角度，reducer 会被按照键/值对的形式划分为一个个 "slice"，**每个 "slice reducer" 都负责初始化值且计算和更新 slice state 值**。

此外，slice reducers 要实际控制其他作为被计算出的 state 的一部分而返回的值。 **尽可能减少“盲目的 spreads/returns 表达式” 的使用**，比如 `return action.payload` 或 `return {...state, ...action.payload}`，因为这些表达式依赖于 dispatch action 那段代码才能正确地格式化内容，且 reducer 放弃了 state 数据结构的掌控权。如果 action 的内容不正确，极容易导致 bug。

> **注意**: 一个有着 spread 返回的 reducer 在很多场景下是合理的选择，比如在表单中编辑数据，如果为每个表单项分别写 action type，那将是事倍功半的。

<DetailedExplanation title="详细说明">
假设一个控制“当前登陆用户”的 reducer 是这样的：

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

在本例中，reducer 完全假定 `action.payload` 将会是正确的数据结构传上来。

但是，假设如果一些其他代码，用 action 传上来了一个“todo”对象，而不是“user”对象：

```js
dispatch({
  type: 'users/userLoggedIn',
  payload: {
    id: 42,
    text: 'Buy milk'
  }
})
```

reducer 将会盲目地返回这个 todo 对象，并且 app 中尝试从 store 中获取 user 的其他部分可能会崩掉。

如果在 reducer 中检查一下`action.payload`是否具有正确的字段，或者根据正确字段的名字尝试去获取一下，至少可以避免一部分以上错误。虽然可能会增加一些代码，所以如何权衡代码量和可靠性是一个问题。

使用静态数据检查就可以提高代码安全性，在一定程度上可以接受。如果 reducer 知道 `action` 是 `PayloadAction<User>`，那么`return action.payload`就*应该*安全。

</DetailedExplanation>

### 根据存储的数据来命名 State Silce

正如在[Reducer 应该持有数据形状](#reducers-should-own-the-state-shape)提到的那样，基于 state 的“slice”来划分 reducer 逻辑是标准的方法。对应的，`combineReducers`是一个将 slice reducer 合并成一个较大 reducer 的标准函数。

传递给 `combineReducers` 的对象中的键名将定义最终 state 对象中的键名。确保以内部保存的数据后命名这些键，并避免在键名中使用“reducer”这个单词。你的对象应该像这样`{users: {}, posts: {}}`，而不是`{usersReducer: {}, postsReducer: {}}`。

<DetailedExplanation title="详细说明">
ES6 对象字面量简写使得在对象中同时定义键名和值很简单：

```js
const data = 42
const obj = { data }
// 和 {data: data} 相同
```

`combineReducers` 接受一个全是 reducer 函数的对象，并用它来生成与其键名称相同的 state 对象。就是说那个全是函数的对象的键名充当了 state 对象的键名。

这导致了一个很常见的错误，倒入了一个变量名中含有“reducer”的 reducer，然后将这个 reducer 用字面量的简写传给了`combineReducers`：

```js
import usersReducer from 'features/users/usersSlice'

const rootReducer = combineReducers({
  usersReducer
})
```

这个例子使用了字面量简写创建了对象比如`{usersReducer: usersReducer}`。所以，“reducer”现在出现在了 state 对象的键名中。多余且无用。

相反，定义键名仅仅只和对象内部相关。我们建议直接使用明确的`key: value`语法：

```js
import usersReducer from 'features/users/usersSlice'
import postsReducer from 'features/posts/postsSlice'

const rootReducer = combineReducers({
  users: usersReducer,
  posts: postsReducer
})
```

这可能就是多打了一些代码，但是其带来的是更优的可读性和清晰的 state 定义。

</DetailedExplanation>

### 根据数据的类型而不是组件来组织 state 结构

在应用程序中，根 state silce 应该基于主要数据的类型或者功能领域来定义和命名，而不该基于 UI 中特定的组件。这是因为 Redux store 中的数据和 UI 中的组件并不是一一对应的，且很多组件可能要访问同一份数据。可以把 state 树想象成为一系列的全局数据库，app 的任意部分都可以访问，读取组件中需要的那一些数据。

例如，一个博客 app，想要追踪到登录用户是谁，作者和帖子的信息，抑或是页面激活状态等一些信息。那么一个好的 state 结构也许是这样`{auth, posts, users, ui}`。一个不好的 state 结构可能长这样：`{loginScreen, usersList, postsList}`。

### 把 Reducer 看作是 State 机器

有很多“无条件的” Redux reducer。他们只观察 dispatch 的 action 并计算一个新的状态值，而不关心当前状态的逻辑。这可能产生 bug，因为根据 app 逻辑的其他位置，某些 action 在某些时候可能在概念上“无效”。例如，一个“request 成功”的 action 当且仅当 state 已经被“加载了”，或者一个“更新这个项”的 action 在某些项目被标记为“被编辑”状态时被 dispatch 了才会有新的值被计算。

为了解决这个问题，**把 reducer 当作是“state 机器”，将现有 state _和_ dispatch 的 action 绑定到一起，决定如何计算出一个新的 state**，而不是仅让 action 没有状态。

<DetailedExplanation>

[有限状态机](https://en.wikipedia.org/wiki/Finite-state_machine)是个很有效的建模方法，它在任何时候都应该只处于有限数量的“有限状态”之一。 例如有一个 `fetchUserReducer`，则其有限状态可以是：

- `"idle"` （数据请求没有开始）
- `"loading"` （正在请求 User 数据）
- `"success"` （User 数据请求成功）
- `"failure"` （User 数据请求失败）

为了更清晰地看这些状态机的状态且[make impossible states impossible](https://kentcdodds.com/blog/make-impossible-states-impossible)，你可以指定一个保存这些状态的属性：

```js
const initialUserState = {
  status: 'idle', // 表示状态
  user: null,
  error: null
}
```

如果用 Typescript，使用[discriminated unions](https://basarat.gitbook.io/typescript/type-system/discriminated-unions)来表示每个有限的状态也很简单。举个例子，如果`state.status === 'success'`，那么`state.user`就被认为是有定义的并且`state.error`为 false。你可以使用类型来约束。

典型的，在写 reducer 逻辑的时候应该首先讲 action 考虑进去。当使用状态机建模程序逻辑的时候，首先考虑 state 是很重要的。为每个状态创建“有限状态 reducer”有助于封装每个状态的行为：

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
  // state.status 是 “idle” 状态
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

// ... 其他的 reducer

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
      // 这里不会被访问
      return state;
  }
}
```

现在，由于你是在定义每个 state 的行为，而不是每个 action，所以也可以阻止一些不可能的变化。举个例子，一个`FETCH_USER` action 在`status === LOADING_STATUS`的时候不应该产生任何副作用，你可以强制要求，而不会意外地产生一些边界 case。

</DetailedExplanation>

### 将复杂的嵌套/关联式 State 规范化

很多应用需要在 store 需要缓存复杂数据。数据经常是通过 API 获取的嵌套的表单结构，或者数据之间包含着相关联的实体（比如一条博客数据包含用户数据、帖子数据以及评论数据）。

**在 store 中使用[“规范化的”格式](../usage/structuring-reducers/NormalizingStateShape.md)**来存储以上数据是更优的。这使得基于项目 ID 查找项目和更新 store 中的单个项目变得更容易，并最终更好的性能模式。

### 保持 state 的最小化并派生出其他的值

无论是否可行，**请尽可能地保证 store 中实际使用的 data 对象最小化，并且按需从那个 state *派生*额外值**。这包括计算过滤列表或求和值。例如，todo 应用程序将保留状态中的 todo 对象的原始列表，但在状态更新时，会导出状态外的 todo 过滤列表。类似地，也可以在 store 外计算是否已完成所有 todo 或剩余 todo 的数量。

有以下几点好处：

- 真实的 state 可读性更高
- 计算出派生值并使其与其余数据保持同步所需的逻辑更少
- 原始状态仍然作为引用，不会被替换

派生数据这件事通常使用“selector”函数，该函数可以封装进行派生数据计算的逻辑。为了提高性能，使用`reselect`和`proxy-memoize`这些库可以使 selector 能被*缓存*，从而缓存前一次的结果。

### 将 action 建模为事件而不是 setter

Redux 从不关心`action.type`的字段内容是什么——它只需要被定义。写现在时态的（`"users/update"`）、过去时态的（`"users/updated"`），描述成一个事件（`"upload/progress"`）或者看作是“setter”（`"users/setUserName"`）的 action type 都是合法的。程序中的 action type 是什么含义以及怎么建模这些 action 完全取决于你。

但是，**我们建议你将 action 更多地视作 “描述发生的事件”，而不是“setter”**。将其视为“事件”总体而言使得 action 名称更有意义，更少的 action 被 dispatch，以及更有意义的 action 日志历史记录。编写“setter”通常导致有很多特别的 action type，更多的 dispatch，且 action 日志会没有意义。

<DetailedExplanation title="详细说明">
想象你有一个餐厅 app，有个人点了一个披萨，一瓶可乐。那么你可以 dispatch 一个 action：

```js
{ type: "food/orderAdded",  payload: {pizza: 1, coke: 1} }
```

或者这样 dispatch:

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
