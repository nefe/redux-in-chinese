---
id: organizing-state
title: Organizing State
sidebar_label: Organizing State
---

# Redux 常见问答：组织 State

## 目录

- [Redux 常见问答：组织 State](#redux-faq-organizing-state)
  - [目录](#table-of-contents)
  - [组织 State](#organizing-state)
    - [必须将所有的 state 都放入 Redux 吗？应该使用 React 的 setState() 吗？](#do-i-have-to-put-all-my-state-into-redux-should-i-ever-use-reacts-setstate)
      - [更多信息](#further-information)
    - [可以将函数、promises 或其他不可序列化的项放入 store state 吗？](#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state)
      - [更多信息](#further-information-1)
    - [如何组织 state 中的嵌套或重复数据？](#how-do-i-organize-nested-or-duplicate-data-in-my-state)
      - [更多信息](#further-information-2)
    - [应该将表单 state 或其他 UI state 放在 store 中吗？](#should-i-put-form-state-or-other-ui-state-in-my-store)
      - [更多信息](#further-information-3)

## 组织 State

### 必须将所有的 state 都放入 Redux 吗？应该使用 React 的 setState() 吗？

对此没有“绝对正确”的答案。一些用户喜欢将每一条数据都保存在 Redux 中，以始终维护其应用程序的完全可序列化和受控的版本。其他人更喜欢在组件的内部 state 中保留非关键的或 UI state，例如“此下拉列表当前是否打开”。

**_使用本地组件 state 是 OK 的_**。作为开发人员，由你自己决定构成应用程序的 state 类型以及每个 state 应该存在的位置。找到一个适合你的平衡点，并坚持下去。

下面是应该将哪些数据放入 Redux 的一些常见经验法则：

- 应用程序的其他部分是否关心这些数据？
- 你是否需要基于这些原始数据创建进一步的派生数据？
- 是否使用相同的数据来驱动多个组件？
- 将此 state 恢复到给定的时间点（即时间旅行调试）对你有价值吗？
- 你是否要缓存数据（即，如果它已经存在，则使用 state 中的内容而不是重新请求它）？
- 在热重载 UI 组件（交换时可能会丢失其内部 state）时，你需要保持这些数据一致吗？

有许多社区包实现了在 Redux store 中存储每个组件 state 的各种方法，例如 [redux-component](https://github.com/tomchentw/redux-component)、[redux-react-local](https://github.com/threepointone/redux-react-local) 等。也可以按照 `this.setState( (previousState) => reducer(previousState, someAction))` 的方式将 Redux 的原理和 reducer 概念应用于更新本地组件 state 的任务中。

#### 更多信息

**文献**

- [何时（何时不）使用 Redux](https://changelog.com/posts/when-and-when-not-to-reach-for-redux)
- [使用 React 和 Redux 找到 state 的位置](https://medium.com/@adamrackis/finding-state-s-place-with-react-and-redux-e9a586630172)
- [一个 setState 的案例](https://medium.com/@zackargyle/a-case-for-setstate-1f1c47cd3f73)
- [如何在 React 中处理 state：缺失的常见问答](https://medium.com/react-ecosystem/how-to-handle-state-in-react-6f2d3cd73a0c)
- [在哪里保存 React 组件数据：state、store、static 和 this](https://medium.freecodecamp.com/where-do-i-belong-a-guide-to-saving-react-component-data-in-state-store-static-and-this-c49b335e2a00)
- [React 应用程序 State 的 5 种类型](http://jamesknelson.com/5-types-react-application-state/)
- [像数据库一样塑造 Redux Store](https://hackernoon.com/shape-your-redux-store-like-your-database-98faa4754fd5)

**讨论**

- [#159：研究使用 Redux 来处理伪本地（pseudo-local）组件 state](https://github.com/reduxjs/redux/issues/159)
- [#1098：在可重用的 React 组件中使用 Redux](https://github.com/reduxjs/redux/issues/1098)
- [#1287：如何在 Redux 的 store 和 React 的 state 之间进行选择？](https://github.com/reduxjs/redux/issues/1287)
- [#1385：将所有 state 存储在一个不可变原子中的缺点是什么？](https://github.com/reduxjs/redux/issues/1385)
- [Twitter：应该将某些值存放在 React 组件的 state 里吗？](https://twitter.com/dan_abramov/status/749710501916139520)
- [Twitter：使用 reducer 更新组件](https://twitter.com/dan_abramov/status/736310245945933824)
- [React 论坛：Redux 和全局 state vs 本地 state](https://discuss.reactjs.org/t/redux-and-global-state-vs-local-state/4187)
- [Reddit：“我什么时候应该在 Redux store 里放东西？”](https://www.reddit.com/r/reactjs/comments/4w04to/when_using_redux_should_all_asynchronous_actions/d63u4o8)
- [Stack Overflow：为什么 state（甚至不是全局的 state）都集中在一个地方？](https://stackoverflow.com/questions/35664594/redux-why-is-state-all-in-one-place-even-state-that-isnt-global)
- [Stack Overflow：所有组件 state 都应该保存在 Redux store 中吗？](https://stackoverflow.com/questions/35328056/react-redux-should-all-component-states-be-kept-in-redux-store)

**相关库**

- [Redux 插件目录：组件 State](https://github.com/markerikson/redux-ecosystem-links/blob/master/component-state.md)

### 可以将函数、promises 或其他不可序列化的项放入 store state 吗？

强烈建议你只将普通的可序列化对象、数组和原始类型放入 store 中。虽然 _技术上_ 可以将不可序列化的项插入到 store 中，但这样做会破坏 store 内容的持久化和再水化能力，并影响时间旅行调试。

如果你不在意持久性和时间旅行调试等可能无法按预期进行，那么完全可以将不可序列化的项放入 Redux store 中。当然，它是 _你的_ 应用程序，你有最终的决定权。与有关 Redux 的许多其他事情一样，请确保你了解所涉及的权衡利弊。

#### 更多信息

**讨论**

- [#1248：是否可以将 react 组件存储在 reducer 中？](https://github.com/reduxjs/redux/issues/1248)
- [#1279：对于在 Flux 中把 Map 组件放在哪里有什么建议吗?](https://github.com/reduxjs/redux/issues/1279)
- [#1390：组件加载](https://github.com/reduxjs/redux/issues/1390)
- [#1407：分享一个很棒的基类](https://github.com/reduxjs/redux/issues/1407)
- [#1793：Redux State 下 React 的元素](https://github.com/reduxjs/redux/issues/1793)

### 如何组织 state 中的嵌套或重复数据？

具有 ID、嵌套结构或关系型的数据，通常应以“归一化”方式存储：每个对象应以 ID 为键仅存储一次，其他引用它的对象应仅存储 ID，而不是整个对象的副本。将 store 的某些部分看作数据库，每项类型都有单独的“表”，这样可能可以帮助理解。[Normalizr](https://github.com/paularmstrong/normalizr) 和 [redux-orm](https://github.com/tommikaikkonen/redux-orm) 等，这些库可以在管理归一化数据上提供帮助和抽象能力。

#### 更多信息

**文档**

- [Redux 深入浅出：异步逻辑和数据流](../tutorials/fundamentals/part-6-async-logic.md)
- [Redux 深入浅出：标准 Redux 模式](../tutorials/fundamentals/part-7-standard-patterns.md)
- [示例：真实示例](../introduction/Examples.md#real-world)
- [Redux 使用指南：结构化 Reducers——预置知识](../usage/structuring-reducers/PrerequisiteConcepts.md#normalizing-data)
- [Redux 使用指南：结构化 Reducers——State 归一化](../usage/structuring-reducers/NormalizingStateShape.md)
- [示例：Tree View](https://github.com/reduxjs/redux/tree/master/examples/tree-view)

**文献**

- [高性能 Redux](https://somebody32.github.io/high-performance-redux/)
- [查询 Redux Store](https://medium.com/@adamrackis/querying-a-redux-store-37db8c7f3b0f)

**讨论**

- [#316：如何创建嵌套 reducers？](https://github.com/reduxjs/redux/issues/316)
- [#815：使用数据结构](https://github.com/reduxjs/redux/issues/815)
- [#946：使用拆分 reducers 以更新相关 state 字段的最佳方法是什么？](https://github.com/reduxjs/redux/issues/946)
- [#994：更新嵌套对象时如何削减样板代码？](https://github.com/reduxjs/redux/issues/994)
- [#1255: Normalizr 在 React/Redux 中与嵌套对象一起使用](https://github.com/reduxjs/redux/issues/1255)
- [#1269：添加树视图示例](https://github.com/reduxjs/redux/pull/1269)
- [#1824：归一化 state 和垃圾回收](https://github.com/reduxjs/redux/issues/1824#issuecomment-228585904)
- [Twitter：state 结构应该归一化](https://twitter.com/dan_abramov/status/715507260244496384)
- [Stack Overflow：如何处理 Redux reducer 中的树形实体？](https://stackoverflow.com/questions/32798193/how-to-handle-tree-shaped-entities-in-redux-reducers)
- [Stack Overflow：如何优化嵌套组件里 props 的很小改动？](https://stackoverflow.com/questions/37264415/how-to-optimize-small-updates-to-props-of-nested-component-in-react-redux)

### 应该将表单 state 或其他 UI state 放在 store 中吗？

[决定把什么放入 Redux store 的经验法则](#do-i-have-to-put-all-my-state-into-redux-should-i-ever-use-reacts-setstate)同样也适用于这个问题。

**根据这些经验法则，大多数表单 state 不需要放入 Redux**，因为它一般不需要在组件之间共享。但是，最终取决于你和你的应用程序。你可能会选择在 Redux 中保留某些表单 state，因为你需要修改最初来自 store 的数据，或者你需要查看显示在应用程序其他组件中的正在处理的数据。另一方面，将表单 state 保存在组件本地可能要简单得多，并在用户完成表单后才 dispatch action 来将数据放入 store 中。

基于此，在大多数情况下，你可能也不需要基于 Redux 的表单管理库。我们建议你按以下顺序尝试这些方法：

- 即使数据来自 Redux store，也请先手动编写表单逻辑。很肯能这就是你想要的。（请参阅 [**Gosha Arinich 关于在 React 中使用表单的帖子**](https://goshakkk.name/on-forms-react/)来获得一些好的指导。）
- 如果你认为“手动”编写表单太难，请尝试使用基于 React 的表单库，例如 [Formik](https://github.com/jaredpalmer/formik) 或 [React-Final-Form](https://github.com/final-form/react-final-form)。
- 如果你确信你必须使用基于 Redux 的表单库，因为其他办法还不能满足，那么你可以看看 [Redux-Form](https://github.com/erikras/redux-form) 和 [React-Redux-Form](https://github.com/davidkpiano/react-redux-form)。

如果你在 Redux 中保存表单 state，你应该花一些时间来考虑性能。对文本框的每次输入变化 dispatch action 也许是没有必要的，你可能需要研究[在 dispatch 前缓存输入变化以保存本地更改的方法](https://blog.isquaredsoftware.com/2017/01/practical-redux-part-7-forms-editing-reducers/)。与往常一样，你需要花一些时间来分析应用程序的整体性能需求。

其他类型的 UI state 也遵循这些经验法则。经典示例是追踪 `isDropdownOpen` 标志。在大多数情况下，应用程序的其余部分并不关心它，因此它应该保存在组件 state 里。但是，根据应用程序的实际情况，使用 Redux 来[管理对话框和其他弹出窗口](https://blog.isquaredsoftware.com/2017/07/practical-redux-part-10-managing-modals/)、选项卡、扩展面板等是有意义的。

#### 更多信息

**文献**

- [Gosha Arinich：关于 React 表单的著作](https://goshakkk.name/on-forms-react/)
- [实用 Redux，第 6 节：连接列表和表单](https://blog.isquaredsoftware.com/2017/01/practical-redux-part-6-connected-lists-forms-and-performance/)
- [实用 Redux，第 7 节：表单更改处理](https://blog.isquaredsoftware.com/2017/01/practical-redux-part-7-forms-editing-reducers/)
- [实用 Redux，第 10 节：管理模态框和上下文菜单](https://blog.isquaredsoftware.com/2017/07/practical-redux-part-10-managing-modals/)
- [React/Redux 链接：Redux UI 管理](https://github.com/markerikson/react-redux-links/blob/master/redux-ui-management.md)
