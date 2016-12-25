# 拆分 Reducer 逻辑

对于任何一个有意义的应用来说，将所有的更新逻辑都放入到单个 reducer 函数中都将会让程序变得不可维护。虽然说对于一个函数应该有多长没有准确的规定，但一般来讲，函数应该相对比较短，并且只做一件特定的事。正因如此，将一段很长的，同时做很作事的代码拆分成很容易理解的小片段是一个很好的编程练习方式。

Redux reducer 仅仅是一个函数，所以同样着，上面的概念也适用。你可以将一个 reducer 中的一些逻辑拆分出去，然后在父函数中调用这个新的函数。

这些新的函数通常分为三类：

1. 一些小的实用函数，包含一些可重用的逻辑片段
2. 用于处理特定情况下的数据更新，通常需要典型参数 `(state, action)` 之外的参数
3. 用于处理给定 state 切片的所有更新，通常需要典型的 `(state, action)` 参数特征

为了清楚起见，这些术语将用于区分不同类型的功能和不同的用例：

* **reducer:** 一个任何带有 `(state, action) -> newState` 特征的函数（即，可以用做 `Array.reducer` 参数的任何函数）。
* **root reducer:** 一个通常是 `createStore` 的第一个参数的函数。他是唯一的一个在所有的 reducer 函数中必须有 `(state, action) -> newState` 特征的函数。
* **slice reducer:** 一个用来处理状态树中一个切片的更新的函数，通常会作为 `combineReducers` 函数的参数。
* **case function:** 一个用来处理特殊 action 的更新逻辑的函数。可能就是一个 reducer 函数，也可能需要其他参数才能正常工作。
* **higher-order reducer:** 一个以 reducer 函数作为参数，或者返回一个新的 reducer 函数的函数（比如： `combineReducers`, `redux-undo`）。

在各种讨论中 “sub-reducer” 这个术语通常表示那些不是 root reducer 的任何函数，但这个表述并不是很精确。一些人认为应该表示 "业务逻辑（business login）" （与应用程序特定行为相关的功能）或者 “实用函数（utility functions）”（非应用程序特定的通用功能）。

将复杂的环境分解为更小，更易于理解的这个过程通常用术语 [功能分解(functional decomposition)](http://stackoverflow.com/questions/947874/what-is-functional-decomposition) 表示。这个术语概念可以用在任何代码中。在 Redux 中，使用第三个方法来构造 reducer 逻辑是非常普遍的，即更新逻辑被委托在基于 state 切片的的其他函数中。Redux 将这个概念称为 **reducer composition**，带目前为止，这个方法是构建 reducer 逻辑最常用的方法。事实上， Redux 包含一个 [`combineReducers()`](https://github.com/reactjs/redux/blob/master/docs/api/combineReducers.md) 的实用函数，它专门抽象化基于 state 切片的其他 reducer 函数的工作过程。但是你必须明确的是，这不是唯一可用的模式。实际上，完全可以用所有的三种方法拆分逻辑，通常情况下，这也是一个好主意。[Refactoring Reducers](https://github.com/reactjs/redux/blob/master/docs/recipes/reducers/RefactoringReducersExample.md) 章节会展示一些使用实例。
