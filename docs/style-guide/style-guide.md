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

然而，经过时间和实践的证明，一些方法就是比其他的方法更优越。此外，很多开发者也要求我们提供官方引导，从而减少决策的繁琐。

基于以上背景, **我们将这些推荐写法都列出来，让你避免出现错误、将精力放在非业务代码身上，以及避免不满足规范的代码**。我们也知道团队的编码偏好是多种多样的，且不同的项目有不同的需求，根本就没有一种风格指导能满足所有情况。**我们推荐你遵循这些推荐，但你也需要评估这些场景是否适用于你的需求**。

最后，我们感谢 Vue 文档的作者，因为受到 [Vue Style Guide page](https://vuejs.org/v2/style-guide/) 的启发，才有了我们这篇文章。

## 规则分类

我们将规则分为以下三类：

### 优先级 A：必要

**这一级别的规则可以防止错误，所以要不计成本地遵守**。例外情况可能存在，但应该非常罕见，并且只能在具备 JavaScript 和 Redux 专业知识的开发者那里出现。

### 优先级 B：强烈推荐

这些规则在绝大多数的项目中都提高了代码可读性和开发体验。即使违反这些规则，代码仍然能运行，但仅能在极少数情况，有非常充分理由的时候才能去破坏这些规则。**只要合理，请尽可能遵守这些规则**。

### 优先级 C：推荐

你可以在一些也很优秀的方案中选择任意一种来保证一致性。在这些规则中，**我们介绍了每个每种规则并推荐了一个默认选项**。这意味着你可以在代码库中自由地做出不同的选择，只要保持一致性并有充分的理由。但是，请慎重！

<div class="priority-rules priority-essential">

## A 级优先规则: 必要

### 不要修改 State

修改 state 是 Redux 应用 bug 的最常见的诱因，包括组件没有正确再渲染，且阻碍了 Redux DevTools 的时间旅行调试。无论是 reducer 中还是任意其他应用代码中，**都要始终避免 state 的真实变换**。

请使用类似于 [`redux-immutable-state-invariant`](https://github.com/leoasis/redux-immutable-state-invariant) 的工具在开发中捕获mutation，并使用 [Immer](https://immerjs.github.io/immer/) 库来避免意外的 state 更新.

> **注意**：修改已有值的 _副本_ 是没问题的——这是一种朴素的 immutable 更新方式。 同样的， 如果我们使用了 Immer 库做 immutable 更新， 编写 "mutating" 逻辑也是允许的，因为真实的数据没有被修改—— Immer 在内部进行了安全的变化追踪并且生成了新的 immutably 值。

### Reducers 不能产生副作用

Reducer 函数必须*只* 依赖于 `state` 和 `action` 参数，且必须重新计算并返回一个新的 state。**其中禁止执行任何异步代码（AJAX 调用, timeouts, promises），生成随机值 （`Date.now()`, `Math.random()`，修改在 reducer 外面定义的变量，或者执行一些修改 reducer 函数作用域之外变量的代码**。

> **注意**：只要符合同样的规则，在 reducer 中调用外部定义的一些方法，比如从库或工具类中 import 的函数等，也是可以的。

<DetailedExplanation title="详细说明">

此规则的目的是确保在调用时 reducers 的行为可预测。例如，如果你正在进行时间旅行调试，则可能会多次调用 reducer 函数，并根据之前的 actions 生成“当前”状态值。如果 reducer 有副作用，这将导致在调试过程中产生了这些副作用，并导致应用程序以意料之外的方式运行。

这条规则也有一些灰色地带。严格来说，有一些代码也是副作用，比如 `console.log(state)`，但它对应用程序没有实质行的行为。

</DetailedExplanation>

### 不要把不可序列化的值放进 State 或 Action

**不要把不可序列化的值放进 Redux store 或者 dispatch 的 actions，比如 Promises、Symbols、Maps/Sets、functions、或类的实例**。这一点保证 Redux DevTools 按照预期方式工作。也保证 UI 按照预期方式更新。

> **例外**：有时你也可以将非可序列化数据放进 action _当且仅当_ 该 action 在传递到 reducer 之前会被 Middleware 拦截住并不继续向下传递。`redux-thunk` 和 `redux-promise` 就是个例子。

### 一个应用只有一个 Redux Store

**一个标准的 Redux 应用应有且仅有一个 Store 实例（单例），供整个应用使用**。它应该用一个单独的文件比如`store.js`定义出来。

理想情况下，不应该有任意一个应用逻辑将其直接引入。他应该使用通过`<Provider>` 传递给 React 组件树，或通过 thunks 这样的 middlewares 间接引用。在极少数的用例中，你可能需要将其导入其他逻辑文件，但这应该是没有办法的办法。

</div>

<div class="priority-rules priority-stronglyrecommended">

## B 级优先规则: 强烈推荐

### 在写 Redux 逻辑时使用 Redux Toolkit

**[Redux Toolkit](../redux-toolkit/overview.md) 是我们推荐的 Redux 工具集**。它囊括了一些封装了我们最佳实践的方法，包括配置 store 使其能捕获 mutations 并激活 Redux DevTools 拓展，使用 Immer 简化 immutable 更新等等。

写 Redux 的时候也不是必须要使用 RTK，如果愿意的话你也可以用一些其他的方法，但是**使用 RTK 会简化代码逻辑，并确保应用程序遵循好的 Redux 默认行为**。

### 使用 Immer 做 Immutable 更新

手写 immutable 更新逻辑通常比较复杂，却容易出错。[Immer](https://immerjs.github.io/immer/)库可以让你写“可变”更新逻辑来简化 immutable 更新，即便在应用开发的其他任意地方为了捕捉 mutation 而 freeze 了 state。

**我们建议使用 Immer 编写 immutable 更新逻辑，这一点已经作为了 [Redux Toolkit](../redux-toolkit/overview.md) 推荐配置的一部分**。

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
    - `/todos`: 单个功能的文件夹
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
- Redux state 的更新必须始终遵守[immutable 更新的原则](../usage/structuring-reducers/ImmutableUpdatePatterns.md)。大多数的 Redux 使用者都知道在 reducer 中遵循这些规则，但也可能不知道如果要在 reducer 的 _外部_ 计算出一个新的 state _也_ 必须这么干。这样很容易产生错误，比如意外的 mutation 或者甚至从 Redux store 中读取一个值并将其直接回传到 action 中。在 reducer 中执行所有的 state 计算 能避免造成这些错误。
- 如果你正在使用 Redux Toolkit 或 Immer 库，那么在 reducers 编写 immutable 更新逻辑是相当简单的，并且 Immer 会 freeze 掉 state 从而捕获意外的 mutations 错误。
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

有很多“无条件的” Redux reducer。他们只观察 dispatch 的 action 并计算一个新的状态值，而不关心当前状态的逻辑。这可能产生 bug，因为根据 app 其他逻辑，某些 action 在某些时候可能在概念上“无效”。例如，一个“request 成功”的 action 当且仅当 state 已经被“加载了”，或者一个“更新这个项”的 action 在某些项目被标记为“被编辑”状态时被 dispatch 了才会有新的值被计算。

为了解决这个问题，**把 reducer 当作是“state 机器”，将现有 state _和_ dispatch 的 action 绑定到一起，决定如何计算出一个新的 state**，而不是仅让 action 没有状态。

<DetailedExplanation title="详细说明">

[有限状态机](https://en.wikipedia.org/wiki/Finite-state_machine)是个很有效的建模方法，它在任何时候都应该只处于有限数量的“有限状态”之一。 例如有一个 `fetchUserReducer`，则其有限状态可以是：

- `"idle"` （数据请求没有开始）
- `"loading"` （正在请求 User 数据）
- `"success"` （User 数据请求成功）
- `"failure"` （User 数据请求失败）

为了更清晰地看这些状态机的状态且 [make impossible states impossible](https://kentcdodds.com/blog/make-impossible-states-impossible)，你可以指定一个属性来保存这些状态：

```js
const initialUserState = {
  status: 'idle', // 显式的表示状态
  user: null,
  error: null
}
```

如果用 Typescript，使用 [discriminated unions](https://basarat.gitbook.io/typescript/type-system/discriminated-unions) 来表示每个有限的状态也很简单。举个例子，如果 `state.status === 'success'`，那么 `state.user` 就被认为是有定义的并且 `state.error` 为 false。你可以使用类型来约束。

典型的，在写 reducer 逻辑的时候应该首先将 action 考虑进去。当使用状态机建模程序逻辑的时候，首先考虑 state 是很重要的。为每个状态创建“有限状态 reducer”有助于封装每个 state 的行为：

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

### 将复杂的嵌套/关联式 State 归一化

很多应用需要在 store 需要缓存复杂数据。数据经常是通过 API 获取的嵌套的表单结构，或者数据之间包含着相关联的实体（比如一条博客数据包含用户数据、帖子数据以及评论数据）。

**在 store 中使用[“归一化的”格式](../usage/structuring-reducers/NormalizingStateShape.md)**来存储以上数据是更优的。这使得基于项目 ID 查找项目和更新 store 中的单个项目变得更容易，并最终更好的性能模式。

### 保持 state 的最小化，其他的值派生出来

无论是否可行，**请尽可能地保证 store 中实际使用的 data 对象最小化，并且按需从那个 state _派生出_ 其他的值**。这包括计算过滤列表或求和值。例如，todo 应用程序将保留状态中的 todo 对象的原始列表，但在状态更新时，会导出状态外的 todo 过滤列表。类似地，也可以在 store 外计算是否已完成所有 todo 或剩余 todo 的数量。

有以下几点好处：

- 真实的 state 可读性更高
- 计算出派生值并使其与其余数据保持同步所需的逻辑更少
- 原始状态仍然作为引用，不会被替换

派生数据这件事通常使用“selector”函数，该函数可以封装进行派生数据计算的逻辑。为了提高性能，使用 `reselect` 和 `proxy-memoize` 这些库可以使 selector 能被*缓存*，从而缓存前一次的结果。

### 将 action 建模为事件而不是 setter

Redux 从不关心 `action.type` 的字段内容是什么——它只需要被定义。写现在时态的（`"users/update"`）、过去时态的（`"users/updated"`），描述成一个事件（`"upload/progress"`）或者看作是“setter”（`"users/setUserName"`）的 action type 都是合法的。程序中的 action type 是什么含义以及怎么建模这些 action 完全取决于你。

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

第一个例子像是个“事件”。“喂，有人点了披萨和汽水，想办法处理一下”。

第二个例子就像是个“setter”。“我*知道*有点披萨和汽水的字段，并且命令你将现在的数量加一”。

“事件”方法只需要 dispatch 一个 action，且更加灵活。根本不关心之前点了几个披萨。也许厨师根本忙不过来，订单会被忽略。

通过“setter”方法，客户需要知道 state 的真实数据结构，要知道“正确”的值是怎么样的，并且最终为了完成“事务”还要 dispatch 很多 action。

</DetailedExplanation>

### action 的命名要有语义

`action.type`字段有两个主要的作用：

- reducer 逻辑通过 action type 来判断如何计算新的 state
- action type 在 redux dev tool 中作为历史日志的显示名称

每次[将 action 建模为“事件”](#model-actions-as-events-not-setters)，`type` 字段的实际内容对于 redux 本身来说并不关心。然而，`type` 的值对于你——一个开发者来说*非常*重要。**action 应该编写语义化，包含关键信息，有描述性的 type 字段**。理想情况下，在看 action type 列表的时候就应该知道这段代码在程序中是干什么的，甚至不用进去看代码本身。避免使用过于通用的命名比如 `"SET_DATA"` 、`"UPDATE_STORE"`，因为这种命名无法表述代码具体在做什么。

### 允许多个 Reducer 响应相同的操作

redux reducer 逻辑能够被分割到很多小的 reducer 当中去，分别独立维护自已的那部分状态树，所有的小 reducer 组合起来构成应用的根 reducer 函数。当一个 action 被 dispatch 了，他可能会被所有的 reducer 执行，也可能是其中一些，也有可能都不执行。

作为一部分，如果可以，建议你**弄不同的 reducer 函数来分别处理同一个 action**。经验表明，大多数动作通常只由单个 reducer 来处理，这很好。但是，将操作建模为“事件”并允许许多 reducer 响应这些操作通常可以让您的应用程序的代码库更好地扩展，并最大限度地减少需要调度多个操作以完成一次有意义的更新的次数。

### 避免依次 dispatch 多个 action

**避免连续 dispatch 多个 action 来完成一个概念上很大的“事务”**。这虽然合法，但是通常会导致多次的 UI 更新，成本较大，且有些中间状态可能会被程序中的其他逻辑置为无效。推荐 dispatch 单个“事件式”的 action，一次性更新所有状态，或者考虑使用 action 的批处理插件来 dispatch 多个 action，从而保持一次 UI 更新。

<DetailedExplanation title="详细说明">

你可以连续调度多少个 action，没有限制。但是，每个 dispatch 的 action 都会导致执行所有 store 订阅回调（通常每个 Redux 关联的 UI 组件一个或多个），并且通常会导致 UI 更新。

虽然 UI 是根据 react 事件处理队列来完成 UI 更新的，且通常多个更新会被打包到一次 react 渲染通道中，对于*外部的*事件处理程序的队列就不是这样。这些多数来自 `async` 方法、延时回调，以及非 react 代码中的 dispatch。在这些场景中，每个 dispatch 在完成之前都会产生一个完整的异步 react 渲染通道，影响了性能。

此外，在概念上属于较大的“事务”式更新序列的多个 dispatch 将产生可能被认为无效的中间状态。例如，如果 action `"UPDATE_A"`，`"UPDATE_B"`，和 `"UPDATE_C"` 一起被 dispatch，且一些代码期望变量 `a`，`b`和`c` 被同时更新，前两个 dispatch 后的状态是不完整的，因为只有其中的两个变量被更新。

如果确实需要多次 dispatch，请考虑以某种方式对更新进行批处理。鉴于你的用例，可能只是批处理 React 自己的渲染（可以使用 [React-Redux 的`batch()`方法](https://react-redux.js.org/api/batch)），对 store 通知的回调进行防抖，或者把很多 action 收归到一个仅通知一次订阅更新的 dispatch 中。查看 [FAQ “减少 store 更新事件”](../faq/Performance.md#how-can-i-reduce-the-number-of-store-update-events)获取更多示例和相关插件的链接。

</DetailedExplanation>

### 评估以下每个 state 应该存在哪里

[“Redux 三原则”](../understanding/thinking-in-redux/ThreePrinciples.md)中说明了“整个应用的 state 都存储在一个单一的 state 树中”。这句话被过度解读了。这并不意味着在字面上，整个应用都将*每个*数据值都*必须*存储在 Redux store 中。相反的，**你能想到的全局的和 app 级的数据值都应该放到一起**。“局部”的数据通常只应该保存到最近的 UI 组件中。

正因如此，作为开发者应该自主决定什么数据应该放到 store 中，什么数据应该放到组件状态中。**[使用这些经验规则来评估每个 state 并确定它们应该放在哪里](../faq/OrganizingState.md#do-i-have-to-put-all-my-state-into-redux-should-i-ever-use-reacts-setstate)**。

### API 使用 React-Redux Hooks API

**推荐使用 [React-Redux hooks API （`useSelector` 和 `useDispatch`）](https://react-redux.js.org/api/hooks)作为默认方法来使 React 组件和 Redux store 之间交互**。虽然传统的 `connect` API 仍然可用且未来也将继续支持，但是 hooks API 总体来说使用起来比较简单。这些 hooks 的间接性更少，编写的代码更少，并且与 TypeScript 一起使用比 `connect` 更简单。

hooks API 在性能和数据流方面确实引入了一些与 `connect` 不同的权衡，但我们现在推荐它们作为默认。

<DetailedExplanation title="详细说明">

[传统 `connect` API](https://react-redux.js.org/api/connect)是一个[高阶组件](https://reactjs.org/docs/higher-order-components.html)。它生成了一个封装过的订阅了 store 的组件，并可以渲染你自己的组件，并且通过 props 传递了 store 数据和 action creator。

这是一个特意设计的间接使用，让你编写“纯展示”风格的组件，将 store 中的数据或方法作为 props 接收，而无需特别依赖 Redux。

hooks 的引入改变了大多数 React 开发人员编写组件编写风格。虽然“容器/展示”概念仍然有效，但 hooks 会促使你编写通过调用适当的 hooks 在内部请求自己的数据的组件。这导致了我们编写和测试组件和逻辑的方法会不相同。

`connect` 的间接地使一些用户跟踪数据流变得有点困难。此外，`connect` 的复杂度使在用 Typescript 的时候类型定义非常困难，这是因为存在多重 overload，optional 参数，合并从父组件来的 `mapState` / `mapDispatch` 方法，以及整合 action creator 和 thunk 这些操作。

`useSelector` 和 `useDispatch` 消除了这种间接性，所以组件如何与 redux 交互是非常清晰的。因为 `useSelector` 只接受一个 selector，所以使用 Typescript 定义类型很容易，`useDispatch` 也是一样的道理。

获取更多细节，请查看 Redux 维护者 Mark Erikson 的帖子以及在在会议中关于如何权衡 hooks 和 HOC 的讲话：

- [Thoughts on React Hooks, Redux, and Separation of Concerns](https://blog.isquaredsoftware.com/2019/07/blogged-answers-thoughts-on-hooks/)
- [ReactBoston 2019: Hooks, HOCs, and Tradeoffs](https://blog.isquaredsoftware.com/2019/09/presentation-hooks-hocs-tradeoffs/)

也可以看 [React-Redux hooks API 文档](https://react-redux.js.org/api/hooks)查看如何正确优化组件，并处理一些边界 case。

</DetailedExplanation>

### 关联更多组件以从存储中读取数据

推荐以一种更细的粒度，在 UI 组件中从 Redux store 中多次订阅不同的数据。这通常会保持一个更好的 UI 性能，因为给出的这些 state 变化后造成的需要更新的组件更少。

举个例子，应该使 `<UserList>` 检索出一个具有所有用户的 ID 的列表并通过 `<UserListItem userId={userId}>` 来渲染列表项，并使 `<UserListItem>` 关联到它自己关心的那个用户数据。而不应该直接关联 `<UserList>` 并读取整个的用户数组。

以上对于 React-Redux `connect()` API 和 `useSelector()` hook 都适用。

### 将 `mapDispatch` 的对象简写（shorthand）形式和 `connect` 一起使用

`connect` 的 `mapDispatch` 参数可以定义为接收 `dispatch` 参数的函数，也可以定义为包含 action creator 的对象。**我们建议总是使用 [`mapDispatch` 的“对象简写”格式 ](https://react-redux.js.org/using-react-redux/connect-mapdispatch#defining-mapdispatchtoprops-as-an-object)**，因为这样极大地简化了代码。几乎不需要将 `mapDispatch` 写为函数。

### 在函数组件中多次调用 `useSelector`

**当使用 `useSelector` hook 检索数据时，尽可能多次调用 `useSelector` 并使得检索到最小数据量，而不是通过一次 `useSelector` 调用直接获取一个大的对象**。不像 `mapState`，`useSelector` 并不需要返回一个对象，也不需要使 selector 读取更小的值，这意味着给定的状态更改不太可能导致该组件渲染。

尽管如此，也要试着找到一个合适数据粒度作为平衡点。如果单个组件确实需要 state slice 中的所有字段，只需编写一个“useSelector”，它将返回整个片段，而不是为每个单独的字段编写一个的 selector。

### 使用静态类型

**使用静态类型语言系统，如 TypeScript 或 Flow，而不是纯 JavaScript**。类型系统能提前发现许多常见错误，改进代码的规范性，并最终获得更好的长期可维护性。虽然 Redux 和 React-Redux 最初设计时考虑的是简单的 JS，但两者都能很好地与 TS 和 Flow 配合使用。Redux Toolkit 是用 TS 专门编写的，旨在通过最少的附加类型声明提供良好的类型安全性。

### 使用 Redux DevTools 浏览器拓展进行 debug

**配置 Redux store 使其支持 [Redux DevTools 拓展来调试](https://github.com/reduxjs/redux-devtools/tree/main/extension)**。它能让你查看：

- action dispatch 的历史记录
- 每个 action 的内容
- 在一个 action 被 dispatch 后的结果
- action 执行前后 state 的差别
- [action 被 disptch 处的函数调用栈追踪，显示对应代码](https://github.com/reduxjs/redux-devtools/blob/main/extension/docs/Features/Trace.md)

此外，DevTools 支持“时间旅行调试”，在动作历史记录中来回切换，以查看不同时间点的整个应用程序状态和 UI。

**Redux 特地设计成支持这种 debug，且 DevTools 成为了为什么使用 Redux 的最强有力的理由之一**。

### state 使用普通 javascript 对象

推荐使用普通 js 对象和数组来表示 state 树结构，而不是一些特殊的库，比如 Immutable.js。即使使用 Immutable.js 有一些潜在的好处，大多数常见的 state 操作目标（如简单引用比较）通常是不可变更新的属性，那样就不需要特定的库了。这样还可以使 bundle 包更小，并降低数据类型转换的复杂性。

如上所述，如果您想简化不可变的更新逻辑，特别是作为 Redux Toolkit 的一部分，特别推荐使用 Immer。

<DetailedExplanation title="详细说明">
Immutable.js 在一开始的 Redux 应用中就被频繁使用了。使用 Immutable.js 还有以下几点理由：

- 轻量的引用对比带来的性能提高
- 由于采用了专门的数据结构进行更新而提高了性能
- 阻止了意外的 mutation
- 通过类似于 `setIn()` 的 API 使得嵌套更新更容易

这些理由有的很有道理，但在实践中，并不像所说的那么好，使用它有一些负面影响：

- 简单引用对比是任何不可变更新的特点，而不仅仅是 immutable.js 的特性
- 偶然的 mutation 可以通过其他机制来预防，例如使用 Immer（它消除了容易发生错误的手动复制逻辑，默认情况下在开发中深度冻结 state）或 `redux-immutable-state-invariant`（它检查状态是否有突变）
- 总体来说 Immer 简化了更新逻辑，消除使用 `setIn()` 的需求
- Immutable.js 包体积较大
- API 有点复杂
- API “影响了” 程序代码。所有的逻辑都必须要知道是在修改普通 js 对象还是 Immutable 对象
- 从 Immutable 对象转换为普通 JS 对象的成本相对较高，并且总是会产生全新的深层对象引用
- 库缺乏持续维护

使用 Immutable 的最强劲的理由就是对各种*超大型*对象（成千上万个键）的快速更新。但大多数应用程序不会处理那么大的对象。

总的来说，Immutable.js 增加了太多的开销，但实际好处太少。Immer 是一个更好的选择。

</DetailedExplanation>

</div>

<div class="priority-rules priority-recommended">

## C 级优先规则: 推荐

### 把 action type 写成 `domain/eventName` 的形式

原始的 Redux 文档和例子总体上使用 “SCREAMING_SNAKE_CASE” 的风格来定义 action type，比如 `“ADD_TODO”` 以及 `“INCREMENT”`。这与大多数编程语言中声明常量值的典型约定相匹配。缺点是大写字符串可读性差。

其他社区也采用了一些公约，通常会对行动所涉及的“特征”或“域”以及具体行动类型进行一些说明，并规定 action type。典型的，NgRx 社区使用一种 `“[Domain] Action Type”` 模式，比如 `“[Login Page] Login”`。其他的一些模式比如 `“domain:action”` 也被广泛使用。

Redux Toolkit's `createSlice` 函数现在生成的 action type 是类似于这样`“domain/action”`，比如 `“todos/addTodo”`。**从可读性角度出发我们建议使用 `“domain/action”` 形式**。

### 使用 Flux Standard Action Convention 写 action

最初的 “Flux Architecture” 文档只规定 action 对象应该有一个 “type” 字段，没有对 action 中的字段应该使用什么类型的字段或命名约定给出任何进一步的指导。为了一致性，Andrew Clark 在 Redux 开发早期创建了一种名为 [“Flux Standard Actions”](https://github.com/redux-utilities/flux-standard-action)规范。总的来说，FSA 这样定义 action：

- 永远把数据存进 `payload` 字段
- 可能会有 `meta` 字段来存放一些额外的数据
- 可能会有 `error` 字段来表示 action 失败的一些错误

很多 Redux 生态中的库采用了 FSA 规范，且 Redux Toolkit 生成的 action creator 也是符合的。

**从一致性角度出发推荐使用 FSA 格式的 action**。

> **注意**：FSA 规范规定，“error”动作应设置为“error:true”，并使用与动作的“valid”形式相同的动作类型。实际上，大多数开发人员为“成功”和“错误”情况编写单独的操作类型。两者都可以接受。

### 使用 action creator

”Action creator“ 函数起源于 “Flux 架构“ 方法。结合 Redux，action creator 不是必须的。组件和其他逻辑也能调用 `dispatch({type: "some/action"})` 来使用 action。

然而，使用 action creator 保持了一致性，尤其是在需要某种准备或附加逻辑来填充 action 内容的情况下（例如生成唯一 ID）。

**推荐在 dispatch 任意 action 的时候都使用 action creators**。但是，与手写 action creator 不同，**我们建议使用来自 Redux Toolkit 的 `createSlice` 函数，可以自动生成 action creator 和 action types**。

### 使用 Thunk 处理异步逻辑

Redux 从设计上就是可拓展的，且特地设计了一些允许各种形式的异步逻辑植入的 middleware API。那样的话，如果不满足需求，使用者就不需要特地去学习像 RxJS 这样的库。

这导致创建了各种各样的 Redux 异步 middleware 插件，然后反过来引起混乱，也会存在关于应该使用哪种异步 middleware 的问题。

**我们建议[使用 Redux Thunk middleware 的默认配置](https://github.com/reduxjs/redux-thunk)**，因为对于大多数的典型用例这些都是够用的（例如基本的 AJAX 数据请求）。此外，在 thunk 函数中使用 `async/await` 语法也使其可读性更高。

如果你有特别复杂的异步工作流包括撤销、防抖、在某个 action 被 dispatch 之后运行一些逻辑，或者“后台线程”行为，那么可以考虑增加一些功能更强大的异步 middleware 比如 Redux-Saga 或者 Redux-Observable。

### 把复杂的逻辑从组件中移出去

我们一直都建议尽可能将逻辑抽离到组件的外面。有一部分是因为要鼓励“容器/表示”的模式，在这种模式下，许多组件只接受数据作为 props 并相应地显示 UI，但也因为在类组件生命周期方法中处理异步逻辑可能变得难以维护。

**我们依然鼓励将复杂的异步逻辑挪到组件外面，通常是放到 thunk 函数里**。如果这部分逻辑要从 store state 中读取的话，这一点尤其正确。

但是，**React hook 在组件中直接使用，在一定程度上简化了像数据请求这样的逻辑的管理**，并且在一些用例中直接替代了 thunk 的作用。

### 使用 selector 函数从 store state 中读取数据

”selector 函数“是一个用来包装从 Redux store 状态树读取的值并从这些值派生出其他的值的强有力的工具。此外，像 Reselect 这样的库可以创建可缓存的 selector 函数，仅在输入值发生变化时才重新计算结果，这是性能优化的一个重要方面。

**我们强烈建议，如果可能的话从 store state 取数的时候都使用带缓存的 selector 函数**，并且推荐使用 Reselect。

然而，也不是所有 state 中的字段都*必须*写 selector 函数。基于哪些属性要经常被访问或更新，以及它能在你的程序中能真正带来多少收益，要找到一个合适的粒度平衡。

### 将 selector 函数命名成这样：`selectThing`

**我们推荐将 selector 函数的命名前缀为单词 `select`**，结合要选择的值的描述。例如 `selectTodos`，`selectVisibleTodos`，和 `selectTodoById`。

### 避免在 Redux 中放表单数据

**大多数的表单格式不应该出现在 Redux 中**。在大多数的使用案例中，数据并不是全局的，不被缓存的，且同时不会被多组件使用。此外，将表单数据链接到 Redux 通常在每个更改事件使都涉及 dispatch action，造成了性能开销，却没有实际收益。（可能你并不需要进行仅改回一个字母的时间旅行调试比如从 `name: "Mark"` 改到 `name: "Mar"`。）

即使数据最终非要保存到 Redux，也尽可能将表单数据本身保持在本地组件状态中来进行更新，并且只在用户完成表单后 dispatch 一个 action 来更新 Redux store。

一些案例中在 Redux 中维护表单状态确实有意义，例如实时编辑预览（WYSIWYG）。但在大多数情况下是不必要的。

</div>

</div>
