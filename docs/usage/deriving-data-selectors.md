---
id: deriving-data-selectors
title: 使用 Selector 来派生数据
description: '使用指南 > Redux 逻辑和模式 > Selector：deriving data from the Redux state'
---

:::tip 你将学到

- 为什么好的 Redux 架构会保持 Redux 状态最小化，并尽可能派生数据
- 使用 selector 函数派生数据和封装查找逻辑的原则
- 如何使用 Reselect 库编写记忆化的 selector 进行优化
- 使用 Reselect 的高级技术
- 用于创建 selector 的附加工具和库
- 编写 selector 的最佳实践

:::

## 派生数据

我们特别建议 Redux 应用程序应该 [保持 Redux 状态最小化，并尽可能派生数据](../style-guide/style-guide.md#keep-state-minimal-and-derive-additional-values)

这包括计算过滤列表或汇总值等内容。 例如，Todo 应用会将 todo 列表的原始列表保持在 state 中，但状态更新后，就会在 state 之外派生一个经过过滤的 todo 列表。同样，获取是否已完成所有 todo、剩余 todo 的数量这些操作都在 store 之外进行。

这有几个好处：

- 实际的 state 更容易阅读
- 当变化发生后，减少了派生数据和原始的数据间的同步逻辑
- 原始 state 仍然存在，可以作为参考，没有被替换

:::tip

这也是 React state 管理的一个最佳实践！很多时候，用户试图定义一个 `useEffect` hook 来监听 state 发生变化，然后使用一些派生数据设置 state，例如 `setAllCompleted(allCompleted)`。相反，该值可以在渲染过程中计算出并直接使用，而无需将值保存到 state 中：

```js
function TodoList() {
  const [todos, setTodos] = useState([])

  // highlight-start
  // Derive the data while rendering
  const allTodosCompleted = todos.every(todo => todo.completed)
  // highlight-end

  // render with this value
}
```

:::

## 使用 Selector 来计算派生数据

在典型的 Redux 应用程序中，派生数据的逻辑通常存在于称为 **_selector_** 的函数中。

Selector 主要用于封装从 state 中查找特定值的逻辑、派生数据的逻辑以及通过避免不必要的重新计算来提高性能。

你不是_必需_对所有状态查找都使用 Selector ，但它们是一种标准模式并且被广泛使用。

### Selector 基础概念

**“selector 函数”是任何接收 Redux store（或 store 的一部分 state）作为参数并返回基于该 state 数据的函数。**

**不需要依赖专门库才能开发 selector**，无论你将它们编写为箭头函数还是 `function` 关键字都没有关系。 例如，所有这些都是有效的selector 函数：

```js
// 箭头函数，直接查找
const selectEntities = state => state.entities

// 函数声明，映射数组来派生值
function selectItemIds(state) {
  return state.items.map(item => item.id)
}

// 函数声明，封装深度查找
function selectSomeSpecificField(state) {
  return state.some.deeply.nested.field
}

// 箭头函数，从数组中派生值
const selectItemsWhoseNamesStartWith = (items, namePrefix) =>
  items.filter(item => item.name.startsWith(namePrefix))
```

Selector 函数可以具有你想要的任何名称。但是，[**建议在 selector 函数名称前加上单词 `select` 并结合所选择值的描述**](../style-guide/style-guide.md#name-selector-functions-as-selectthing)。这方面的典型示例类似于 **`selectTodoById`**、**`selectTodoById`**、**`selectFilteredTodos`** 和 **`selectVisibleTodos`**。

如果你使用过 [React-Redux 中的 `useSelector` hook](../tutorials/fundamentals/part-5-ui-and-react.md)，你可能已经熟悉 selector 函数的基本概念 - 我们传递给 `useSelector` 的函数必须是 selector：

```js
function TodoList() {
  // highlight-start
  // 这个匿名箭头函数是一个 selector！
  const todos = useSelector(state => state.todos)
  // highlight-end
}
```

Selector 函数通常定义在 Redux 应用程序的两个地方：

- 在 slice 文件中，与 reducer 逻辑一起
- 在组件文件中，在组件外部，或在 `useSelector` 中直接定义

在可以获取 Redux root state 的任何地方都能使用 selector。 这包括 `useSelector` 钩子、`connect` 的 `mapState` 函数、middleware、thunk 和 sagas。例如，thunk 和 middleware 可以访问 `getState` 参数，因此你可以在那里调用 selector：

```js
function addTodosIfAllowed(todoText) {
  return (dispatch, getState) => {
    const state = getState()
    const canAddTodos = selectCanAddTodos(state)

    if (canAddTodos) {
      dispatch(todoAdded(todoText))
    }
  }
}
```

通常不可能在 reducer 中使用 Selector ，因为 slice reducer 只能访问它自己的 Redux 状态 slice，但大多数 Selector 都希望获得_整个_ Redux 根状态作为参数。

### 用 Selector 封装 state 形状

使用 Selector 函数的第一个原因是在处理 Redux state 形状时的封装和可重用性。

假设一个 `useSelector` hook 对 Redux 状态的一部分进行了非常具体的查找：

```js
const data = useSelector(state => state.some.deeply.nested.field)
```

以上是合法的代码，并且可以正常运行。但是，从架构上讲，这可能不是最好的主意。想象一下，你有几个组件需要访问该字段。如果你需要更改该状态所在的位置会发生什么？你现在必须更改引用该值的_每个_ `useSelector` hook。所以，和[我们推荐使用 action creator 来封装创建 action 的细节](../style-guide/style-guide.md#use-action-creators)一样，推荐定义可复用的 Selector 来封装特定数据存放的一串路径。然后，在需要获取特定数据的地方，调用 Selector 函数即可。

**理想情况下，只有你的 reducer 函数和 Selector 应该知道确切的状态结构，所以如果你改变了某些状态的位置，你只需要更新这两个逻辑部分**。

因此，直接在 slice 文件中定义可重用 Selector 通常是一个好主意，而不是总是在组件中定义它们。

Selector 的一种常见描述是它们就像**“状态的查询工具”**。并不关心查询究竟是如何得出需要的数据，只关心要请求数据并返回结果。

### 使用 Memoization 来优化 Selector

Selector 函数通常需要执行相对“昂贵”的计算，或者创建作为新对象和数组引用的派生值。这可能引发应用程序的性能问题，原因如下：

- 与 `useSelector` 或 `mapState` 一起使用的 Selector 将在每次 dispatch action 后重新运行，无论 Redux store 的哪个部分实际更新。但当组件输入状态部分没有改变时重新运行昂贵的计算是浪费 CPU 时间，而且很可能输入在大多数时间都不会改变。
- `useSelector` 和 `mapState` 依赖于返回值的 `===` 引用相等性检查来确定组件是否需要重新渲染。如果 Selector _总是_返回新的引用，它将强制组件重新渲染，即使派生数据实际上与上次相同。这对于像`map()`和`filter()`这样的数组操作来说尤其常见，它们返回新的数组引用。

举个例子，这个组件写得很糟糕，因为它的`useSelector`调用_总是_返回一个新的数组引用。这意味着组件将在_每次_ dispatch action 后重新渲染，即使输入的 `state.todos` slice 没有更改：

```js
function TodoList() {
  // highlight-start
  // ❌ WARNING: 这_每次都_返回一个新的引用，所以它_每次都_重新渲染！
  const completedTodos = useSelector(state =>
    state.todos.map(todo => todo.completed)
  )
  // highlight-end
}
```

另一个例子是一个组件需要做一些“昂贵”的计算来做数据转换：

```js
function ExampleComplexComponent() {
  const data = useSelector(state => {
    const initialData = state.data
    const filteredData = expensiveFiltering(initialData)
    const sortedData = expensiveSorting(filteredData)
    const transformedData = expensiveTransformation(sortedData)

    return transformedData
  })
}
```

同样，这种“昂贵”的逻辑将在_每次_ dispatch action 后重新运行。它不仅可能会创建新的引用，而且除非 `state.data` 实际发生变化，否则不需要完成这项工作。

正因为如此，我们需要一种方法来编写优化的 Selector ，以避免在传入相同的输入时重新计算结果。这就是 **_memoization_** 的想法所在。

**Memoization 是一种形式的缓存**。 它涉及跟踪函数的输入，并存储输入和结果以供以后引用。如果使用与以前相同的输入来调用函数，则该函数会跳过实际执行，直接返回上次接收这些输入值时生成的相同结果。这通过仅在输入已更改时才实际执行来优化性能，并且在输入相同时始终返回相同的结果引用。

接下来，我们将看看一些用于编写记忆化 Selector 的方法。

## 使用 Reselect 编写记忆化 Selector

Redux 生态系统传统上使用一个名为 [**Reselect**](https://github.com/reduxjs/reselect) 的库来创建记忆化 Selector 。还有其他类似的库，以及围绕 Reselect 的多种变体和包装器 - 我们稍后会看这些。

### `createSelector` 概述

Reselect 提供了一个名为 [`createSelector`](https://github.com/reduxjs/reselect#createselectorinputselectors--inputselectors-resultfunc) 的函数来生成记忆化 Selector 。`createSelector` 接收一个或多个 input selector 函数，外加一个 output selector 作为参数，并返回一个新的 Selector 函数作为结果。

`createSelector` 包含在 [我们的官方 Redux 工具包中](https://redux-toolkit.js.org) 中，并重新导出以方便使用。

`createSelector` 可以接收多个 input selector，它们可以作为单独的参数或作为数组提供。所有 input selector 的结果作为单独的参数提供给 output selector：

```js
const selectA = state => state.a
const selectB = state => state.b
const selectC = state => state.c

const selectABC = createSelector([selectA, selectB, selectC], (a, b, c) => {
  // 对 a、b 和 c 执行操作，并返回一个结果
  return a + b + c
})

// 调用 Selector 并得到结果
const abc = selectABC(state)

// 也可以写成单独的参数，结果完全一样
const selectABC2 = createSelector(selectA, selectB, selectC, (a, b, c) => {
  // 对 a、b 和 c 执行操作，并返回一个结果
  return a + b + c
})
```

当你调用 Selector 时，Reselect 将使用你提供的所有参数运行你的 input selector，并查看返回的值。如果任何结果与之前的 `===` 不同，它将重新运行 output selector，并将这些结果作为参数传递。如果所有结果都与上次相同，它将跳过重新运行 output selector，并返回之前缓存的最终结果。

这意味着**“input selector”通常应该只提取和返回值，而“output selector”应该完成转换工作**。

:::caution

一个有点常见的错误是编写“input selector”来提取值或进行一些推导，在“output selector”直接返回其结果：

```js
// ❌ BROKEN: 无法起到缓冲效果，和没有一样
const brokenSelector = createSelector(
  state => state.todos,
  todos => todos
)
```

**任何仅返回其输入的“output selector”都是不正确的！** output selector 应始终具有转换逻辑。

类似地，记忆化 Selector 应该_从不_使用 `state => state` 作为输入！这将强制 Selector 始终重新计算。
:::

在典型的 Reselect 用法中，你将顶级“input selector”编写为普通函数，并使用 `createSelector` 创建查找嵌套值的记忆化 Selector ：

```js
const state = {
  a: {
    first: 5
  },
  b: 10
}

const selectA = state => state.a
const selectB = state => state.b

const selectA1 = createSelector([selectA], a => a.first)

const selectResult = createSelector([selectA1, selectB], (a1, b) => {
  console.log('Output selector running')
  return a1 + b
})

const result = selectResult(state)
// Log: "Output selector running"
console.log(result)
// 15

const secondResult = selectResult(state)
// No log output
console.log(secondResult)
// 15
```

请注意，我们第二次调用 `selectResult` 时，“output selector”没有执行。 因为 `selectA1` 和 `selectB` 的结果与第一次调用相同，所以 `selectResult` 能够返回第一次调用的记忆结果。

### `createSelector` 行为

需要注意的是，默认情况下，**`createSelector` 只记忆最近的一组参数**。这意味着如果你使用不同的输入重复调用 Selector ，它仍然会返回结果，但它必须不断重新运行 output selector 才能产生结果：

```js
const a = someSelector(state, 1) // 第一次调用，没有记忆
const b = someSelector(state, 1) // 重复调用，有记忆
const c = someSelector(state, 2) // 不同输入，没有记忆
const d = someSelector(state, 1) // 与上次不同的输入，没有记忆
```

此外，你可以将多个参数传递给 Selector 。Reselect 将使用这些参数调用所有 input selector：

```js
const selectItems = state => state.items
const selectItemId = (state, itemId) => itemId

const selectItemById = createSelector(
  [selectItems, selectItemId],
  (items, itemId) => items[itemId]
)

const item = selectItemById(state, 42)

/*
Reselect 内部会做这些事情：

const firstArg = selectItems(state, 42);  
const secondArg = selectItemId(state, 42);  
  
const result = outputSelector(firstArg, secondArg);  
return result;  
*/
```

因此，**重要的是你提供的所有“input selector”都应该接收相同类型的参数**。否则， Selector 将出错。

```js
const selectItems = state => state.items

// 期望一个数字作为第二个参数
const selectItemId = (state, itemId) => itemId

// 期望一个对象作为第二个参数
const selectOtherField = (state, someObject) => someObject.someField

const selectItemById = createSelector(
  [selectItems, selectItemId, selectOtherField],
  (items, itemId, someField) => items[itemId]
)
```

在这个例子中，`selectItemId` 期望它的第二个参数是一些普通值，而 `selectOtherField` 期望第二个参数是一个对象。如果你调用 `selectItemById(state, 42)`，`selectOtherField` 将出错，因为它正在尝试访问 `42.someField`。

### Reselect 的使用模式和限制

#### 嵌套 Selector

可以使用 `createSelector` 生成的 Selector ，并将它们用作其他 Selector 的输入。在此示例中，`selectCompletedTodos`  Selector 用作`selectCompletedTodoDescriptions` 的输入：

```js
const selectTodos = state => state.todos

const selectCompletedTodos = createSelector([selectTodos], todos =>
  todos.filter(todo => todo.completed)
)

const selectCompletedTodoDescriptions = createSelector(
  [selectCompletedTodos],
  completedTodos => completedTodos.map(todo => todo.text)
)
```

#### 传递输入参数

可以使用任意数量的参数调用重新选择生成的 Selector 函数：`selectThings(a, b, c, d, e)`。但是，对于重新运行输出而言，重要的不是参数的数量，也不是参数本身是否已更改为新的引用。相反，它是关于已定义的“input selector”，以及_它们的_结果是否已更改。 同样，“output selector”的参数完全基于 input selector 返回的内容。

这意味着如果你想将额外的参数传递给 output selector，你必须定义从原始 Selector 参数中提取这些值的 input selector：

```js
const selectItemsByCategory = createSelector(
  [
    // 通常的第一个输入 - 从 state 中提取值
    state => state.items,
    // 获取第二个参数，`category`，并转发到 output selector
    (state, category) => category
  ],
  // Output selector 拿到 (`items, category)` 参数
  (items, category) => items.filter(item => item.category === category)
)
```

为了保持一致性，你可能需要考虑将附加参数作为单个对象传递给 Selector ，例如 `selectThings(state, otherArgs)`，然后从 `otherArgs` 对象中提取值。

####  Selector 工厂

**`createSelector` 的默认缓存大小仅为 1，这是每个 Selector 的唯一实例**。 当需要在具有不同输入的多个地方重用单个 Selector 函数时，这会产生问题。

一种做法是创建一个“ Selector 工厂” - 一个运行`createSelector()`并在每次调用时生成一个新的 Selector 实例的函数：

```js
const makeSelectItemsByCategory = () => {
  const selectItemsByCategory = createSelector(
    [state => state.items, (state, category) => category],
    (items, category) => items.filter(item => item.category === category)
  )
  return selectItemsByCategory
}
```

当多个相似的 UI 组件需要根据 props 派生不同的数据子集时，这尤其有用。

## 其他的 Selector 工具库

虽然 Reselect 是 Redux 中使用最广泛的 Selector 库，但还有许多其他库可以解决类似问题，或扩展 Reselect 的功能。

###`proxy-memoize`

`proxy-memoize` 是一个相对较新的 memoized  Selector 库，它使用独特的实现方法。 它依赖 ES6 `Proxy` 对象来跟踪尝试读取嵌套值，然后在以后的调用中仅比较嵌套值以查看它们是否已更改。在某些情况下，可能比 Reselect 效果更好。

一个很好的例子是派生一系列 todo 描述的 Selector ：

```js
import { createSelector } from 'reselect'

const selectTodoDescriptionsReselect = createSelector(
  [state => state.todos],
  todos => todos.map(todo => todo.text)
)
```

不幸的是，如果 `state.todos` 中的任何其他值发生更改，例如切换 `todo.completed` 标志，这将重新计算派生数组。派生数组的 _contents_ 是相同的，但是由于输入的 `todos` 数组发生了变化，它必须计算一个新的输出数组，并且它有一个新的引用。

带有 `proxy-memoize` 的相同 Selector 代码类似于：

```js
import memoize from 'proxy-memoize'

const selectTodoDescriptionsProxy = memoize(state =>
  state.todos.map(todo => todo.text)
)
```

与 Reselect 不同，`proxy-memoize` 可以检测到只有 `todo.text` 字段正在被访问，并且只有在 `todo.text` 字段发生更改时才会重新计算其余部分。

它还有一个内置的 `size` 选项，允许你为单个 Selector 实例设置所需的缓存大小。

它与 Reselect 有一些权衡和不同之处：

- 所有值都作为单个对象参数传入
- 要求环境支持 ES6 `Proxy` 对象（无 IE11）
- 它更神奇，而 Reselect 更明确
- 关于基于 `Proxy` 的跟踪行为有一些边缘情况
- 它比较新且使用较少

综上所述，**我们官方鼓励你考虑使用 `proxy-memoize` 作为 Reselect 的可行替代方案**。

### `re-reselect`

https://github.com/toomuchdesign/re-reselect 通过允许你定义“key selector”来改进 Reselect 的缓存行为。这用于在内部管理 Reselect  Selector 的多个实例，这有助于简化跨多个组件的使用。

```js
import { createCachedSelector } from 're-reselect'

const getUsersByLibrary = createCachedSelector(
  // inputSelectors
  getUsers,
  getLibraryId,

  // resultFunc
  (users, libraryId) => expensiveComputation(users, libraryId)
)(
  // re-reselect keySelector (接收 selectors 的参数)
  // Use "libraryName" as cacheKey
  (_state_, libraryName) => libraryName
)
```

### `reselect-tools`

有时很难追踪多个 Reselect  Selector 如何相互关联，以及导致 Selector 重新计算的原因。https://github.com/skortchmark9/reselect-tools 提供了一种跟踪 Selector 依赖关系的方法，以及它自己的 DevTools 来帮助可视化这些关系并检查 Selector 值。

### `redux-views`

https://github.com/josepot/redux-views 类似于 `re-reselect`，因为它提供了一种为每个项目选择唯一键以实现一致缓存的方法。 它被设计为 Reselect 的近乎直接的替代品，实际上是作为潜在的 Reselect v5 的一个选项而提出的。

### Reselect v5 Proposal

我们在 Reselect 存储库中展开了路线图讨论，以找出对 Reselect 未来版本的潜在改进，例如改进 API 以更好地支持更大的缓存大小、重写 TypeScript 中的代码库以及其他可能的改进。我们欢迎在该讨论中提供更多社区反馈：

[**Reselect v5 路线图讨论：目标和 API 设计**](https://github.com/reduxjs/reselect/discussions/491)

## 在 React-Redux 中使用 Selector

### 使用参数调用 Selector

想要将额外的参数传递给 Selector 函数是很常见的。但是，`useSelector` 总是使用一个参数调用提供的 Selector 函数 - Redux 根`state`。

最简单的解决方案是将匿名 Selector 传递给`useSelector`，然后立即使用`state`和任何附加参数调用真正的 Selector ：

```js
import { selectTodoById } from './todosSlice'

function TodoListitem({ todoId }) {
  // highlight-start
  // 从作用域中捕获 `todoId`，获取 `state` 作为参数，并转发两者
  // 到实际的 Selector 函数来提取结果
  const todo = useSelector(state => selectTodoById(state, todoId))
  // highlight-end
}
```

### 创建唯一的 Selector 实例

在许多情况下，需要在多个组件中重用 Selector 函数。如果组件都将使用不同的参数调用 Selector ，它将破坏记忆 -  Selector 永远不会连续多次看到相同的参数，因此永远不会返回缓存值。

这里的标准方法是在组件中创建一个记忆 Selector 的唯一实例，然后将其与 `useSelector` 一起使用。 这允许每个组件一致地将相同的参数传递给它自己的 Selector 实例，并且该 Selector 可以正确地记忆结果。

对于函数组件，这通常使用 `useMemo` 或 `useCallback` 完成：

```js
import { makeSelectItemsByCategory } from './categoriesSlice'

function CategoryList({ category }) {
  // 在挂载时为每个组件实例创建一个新的记忆化 Selector
  const selectItemsByCategory = useMemo(makeSelectItemsByCategory, [])

  const itemsByCategory = useSelector(state =>
    selectItemsByCategory(state, category)
  )
}
```

对于带有 `connect` 的类组件，这可以通过 `mapState` 的高级“工厂函数”语法来完成。如果 `mapState` 函数在第一次调用时返回一个新函数，那么它将被用作真正的 `mapState` 函数。这提供了一个闭包，你可以在其中创建一个新的 Selector 实例：

```js
import { makeSelectItemsByCategory } from './categoriesSlice'

const makeMapState = (state, ownProps) => {
  // 闭包 - 在这里创建一个新的唯一 Selector 实例，
  // 这将为每个组件实例运行一次
  const selectItemsByCategory = makeSelectItemsByCategory()

  const realMapState = (state, ownProps) => {
    return {
      itemsByCategory: selectItemsByCategory(state, ownProps.category)
    }
  }

  // 这里返回一个函数，告诉 `connect` 将其用作
  // `mapState` 代替原来的 `connect`
  return realMapState
}

export default connect(makeMapState)(CategoryList)
```

## 有效地使用 Selector

虽然 Selector 是 Redux 应用程序中的常见模式，但它们经常被误用或误解。以下是正确使用 Selector 功能的一些指南。

### 和 Reducer 一起定义 Selector

Selector 函数通常在 UI 层中定义，直接在 `useSelector` 调用中。 但是，这意味着在不同文件中定义的 Selector 之间可以存在重复，并且函数是匿名的。

与任何其他函数一样，你可以在组件外部提取一个匿名函数来为其命名：

```js
// highlight-next-line
const selectTodos = state => state.todos

function TodoList() {
  // highlight-next-line
  const todos = useSelector(selectTodos)
}
```

但是，应用程序的多个部分可能希望使用相同的查找。 此外，从概念上讲，我们可能希望保留关于`todos`状态如何组织为`todosSlice`文件中的实现细节的知识，以便将所有内容集中在一个地方。

正因为如此，**最好将可重用的 Selector 与相应的 reducer 一起定义**。在这种情况下，我们可以从 `todosSlice` 文件中导出 `selectTodos`：

```js title="src/features/todos/todosSlice.js"
import { createSlice } from '@reduxjs/toolkit'

const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    todoAdded(state, action) {
      state.push(action.payload)
    }
  }
})

export const { todoAdded } = todosSlice.actions
export default todosSlice.reducer

// highlight-start
// 这里导出一个可重用的 Selector
export const selectTodos = state => state.todos
// highlight-end
```

这样，如果我们碰巧对 todos slice 状态的结构进行了更新，相关的 Selector 就在此处并且可以同时更新，而对应用程序的任何其他部分的更改最少。

### 适度使用 Selector

你有可能创建_过多_的 Selector 。**为每个字段添加单独的 Selector 函数不是一个好主意！** 这最终将 Redux 变成了类似于 Java 类的东西，每个字段都有 getter/setter 函数。它不会_改进_代码，反而可能会使代码_更糟_ - 维护所有这些额外的 Selector 需要付出很多额外的努力，而且更难追踪在哪里使用了哪些值。

同样，**不要让每个 Selector 都记忆化！**。仅当你确实是_派生_结果时才需要记忆，_并且_如果派生结果可能每次都会创建新的引用。**直接查找和返回值的 Selector 函数应该是普通函数，而不是记忆函数**。

是否使用记忆的一些示例：

```js
// ❌ 不需要记忆：始终返回一致的引用
const selectTodos = state => state.todos
const selectNestedValue = state => state.some.deeply.nested.field
const selectTodoById = (state, todoId) => state.todos[todoId]

// ❌ 不需要记忆：派生数据，但是返回一致的结果
const selectItemsTotal = state => {
  return state.items.reduce((result, item) => {
    return result + item.total
  }, 0)
}
const selectAllCompleted = state => state.todos.every(todo => todo.completed)

// ✅ 需要记忆：map 每次调用返回新的引用
const selectTodoDescriptions = state => state.todos.map(todo => todo.text)
```

### 根据组件的需要给 state 塑形

Selector 不必将自己限制为直接查找 - 它们可以在内部执行_任何_需要的转换逻辑。这对于帮助准备特定组件所需的数据特别有价值。

Redux 状态通常具有“原始”形式的数据，因为[状态应该保持最小](#deriving-data)，并且许多组件可能需要以不同的方式呈现相同的数据。你不仅可以使用 Selector _提取_状态，还可以根据特定组件的需要对其进行_塑形_。这可能包括从根状态的多个 slice 中提取数据、提取特定值、将不同的数据片段合并在一起，或者任何其他有用的转换。

如果一个组件也有一些这样的逻辑很好，但是将所有这些转换逻辑拉到单独的 Selector 中以更好地重用和可测试性可能是有益的。

### 如果需要，使用整体式（Globalized） Selector

编写 slice reducer 和 Selector 之间存在固有的不平衡。Slice reducer 只知道它们的一部分状态 - 对于 reducer，它的“状态”就是所有存在的东西，例如“todoSlice”中的 todo 数组。另一方面， Selector _通常_被编写为将整个 Redux 根状态作为它们的参数。这意味着他们必须知道该 slice 的数据保存在根状态的什么位置，例如 `state.todos`，即使在创建根 reducer 之前（通常在应用程序范围的 store 配置代码中）才真正定义。

典型的 slice 文件通常同时具有这两种模式。这很好，尤其是在中小型应用程序中。但是，根据你的应用程序的架构，你可能希望进一步抽象 Selector ，以便他们_不_知道 slice 状态保存在哪里 - 它必须交给他们。

我们将这种模式称为“整体式” Selector 。 **“整体式” Selector ** 是一个接收 Redux 根状态作为参数的 Selector ，并且知道如何找到相关的状态 slice 来执行真正的逻辑。 **“局部式” Selector ** 是一个期望状态的_只是一部分_作为参数的 Selector ，而不知道或关心它在根状态中的位置：

```js
// "整体式 Globalized" - 接收根 state，知道在 `state.todos` 中查找数据
const selectAllTodosCompletedGlobalized = state =>
  state.todos.every(todo => todo.completed)

// "Localized" - 只接收 `todos` 作为参数，不知道从何而来
const selectAllTodosCompletedLocalized = todos =>
  todos.every(todo => todo.completed)
```

“局部式（Localized）” Selector 可以变成“全球化” Selector ，方法是将它们包装在一个知道如何检索正确状态 slice 并将其向前传递的函数中。

Redux Toolkit 的 [`createEntityAdapter` API](https://redux-toolkit.js.org/api/createEntityAdapter#selector-functions) 就是这种模式的一个例子。如果你调用 `todosAdapter.getSelectors()`，不带参数，它会返回一组“局部式” Selector ，这些 Selector 接收 _slice state_ 作为它们的参数。如果你调用 `todosAdapter.getSelectors(state => state.todos)`，它会返回一组“全球化” Selector ，这些 Selector 期望以 _Redux 根 state_ 作为参数来调用。

拥有“局部式”版本的 Selector 也可能有其他好处。例如，假设我们有一个高级场景，将 `createEntityAdapter` 数据的多个副本嵌套在 store 中，例如跟踪房间的 `chatRoomsAdapter`，然后每个房间定义都有一个 `chatMessagesAdapter` 状态来存储消息。我们不能直接查找每个房间的消息——我们首先必须检索房间对象，然后从中选择消息。如果我们有一组消息的“局部式” Selector ，这会更容易。

## 更多信息

- Selector 工具库：
  - Reselect: https://github.com/reduxjs/reselect
  - `proxy-memoize`: https://github.com/dai-shi/proxy-memoize
  - `re-reselect`: https://github.com/toomuchdesign/re-reselect
  - `reselect-tools`: https://github.com/skortchmark9/reselect-tools
  - `redux-views`: https://github.com/josepot/redux-views
- [Reselect v5 Roadmap 讨论：目标和 API 设计](https://github.com/reduxjs/reselect/discussions/491)
- Randy Coulman 有一系列优秀的文章，关于 selector 架构，实现 Redux selector 的全球化的不同方法，以及取舍权衡：
  - [封装 Redux 状态树](https://randycoulman.com/blog/2016/09/13/encapsulating-the-redux-state-tree/)
  - [Redux Reducer/Selector 不对称](https://randycoulman.com/blog/2016/09/20/redux-reducer-selector-asymmetry/)
  - [Reducer 和 Selector 的模块化](https://randycoulman.com/blog/2016/09/27/modular-reducers-and-selectors/)
  - [Redux Selector 的整体式](https://randycoulman.com/blog/2016/11/29/globalizing-redux-selectors/)
  - [柯里化 Selector 的整体式](https://randycoulman.com/blog/2016/12/27/globalizing-curried-selectors/)
  - [模块化 Redux 中循环依赖的解法](https://randycoulman.com/blog/2018/06/12/solving-circular-dependencies-in-modular-redux/)
