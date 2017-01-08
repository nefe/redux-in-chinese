# `combineReducers` 进阶

Redux 引入了非常实用的 `combineReducers` 工具函数，但我们却粗暴地将它限制于单一的应用场景：把不同片段的 state 的更新工作委托给一个特定的 reducer，以此更新由普通的 JavaScript 对象构成的 state 树。它不解决 Immutable.js Maps 所构建的 state tree，也不会把其余部分的 state 作为额外参数传递给 reducer 或者排列 reducer 的调用顺序，它同样不关心 reducer 如何工作。

于是一个常见问题出现了，“`combineReducers` 如何处理这些应用场景呢？”通常给出的回答只是“你不能这么做，你可能需要通过其他方式解决”。**一旦你突破 `combineReducers` 的这种限制，就是创建各色各样的“自定义” reducer 的时候了**，不管是为了解决一次性场景的特殊 reducer，还是能够被广泛复用的 reducer。本文为几种典型的应用场景提供了建议，但你也可以自由发挥。

## 结合 Immutable.js 对象使用 reducers

由于目前 `combineReducers` 只能处理普通的 JavaScript 对象，对于把 Immutable.js Map 对象作为顶层 state 树的应用程序来说，可能无法使用 `combineReducers` 管理应用状态。因为很多开发者采用了 Immutable.js，所以涌现了大量提供类似功能的工具，例如 [redux-immutable](https://github.com/gajus/redux-immutable)。这个第三方包实现了一个能够处理 Immutable Map 数据而非普通的 JavaScript 对象的 `combineReducers`。

## 不同 reducers 之间共享数据

类似地，如果 `sliceReducerA` 为了处理特殊的 action 正好需要来自 `sliceReducerB` 的部分 state 数据，或者 `sliceReducerB` 正好需要全部的 state 作为参数，单单就 `combineReducers` 是无法解决这种问题的。可以这样来解决：把所需数据当额外参数的形式传递给自定义函数，例如：

```js
function combinedReducer(state, action) {
    switch(action.type) {
        case "A_TYPICAL_ACTION" : {
            return {
                a : sliceReducerA(state.a, action),
                b : sliceReducerB(state.b, action)
            };
        }
        case "SOME_SPECIAL_ACTION" : {
            return {
                // 明确地把 state.b 作为额外参数进行传递
                a : sliceReducerA(state.a, action, state.b),
                b : sliceReducerB(state.b, action)
            }        
        }
        case "ANOTHER_SPECIAL_ACTION" : {
            return {
                a : sliceReducerA(state.a, action),
                // 明确地把全部的 state 作为额外参数进行传递
                b : sliceReducerB(state.b, action, state)
            }         
        }    
        default: return state;
    }
}
```

另一种解决“共享片段数据更新” (shared-slice updates) 问题的简单方法是，给 action 添加额外数据。可以通过 thunk 函数或者类似的方法轻松实现，如下：

```js
function someSpecialActionCreator() {
    return (dispatch, getState) => {
        const state = getState();
        const dataFromB = selectImportantDataFromB(state);

        dispatch({
            type : "SOME_SPECIAL_ACTION",
            payload : {
                dataFromB
            }
        });
    }
}
```

因为 B 的数据已经存在于 action 中，所以它的父级 reducer 不需要做任何特殊的处理就能把数据暴露给 `sliceReducerA`。

第三种方法是：使用 `combineReducers` 组合 reducer 来处理“简单”的场景，每个 reducer 依旧只更新自己的数据；同时新加一个 reducer 来处理多块数据交叉的“复杂”场景；最后写一个包裹函数依次调用这两类 reducer 并得到最终结果：

```js
const combinedReducer = combineReducers({
    a : sliceReducerA,
    b : sliceReducerB
});

function crossSliceReducer(state, action) {
    switch(action.type) {
        case "SOME_SPECIAL_ACTION" : {
            return {
                // 明确地把 state.b 作为额外参数进行传递
                a : handleSpecialCaseForA(state.a, action, state.b),
                b : sliceReducerB(state.b, action)
            }        
        }
        default : return state;
    }
}

function rootReducer(state, action) {
    const intermediateState = combinedReducer(state, action);
    const finalState = crossSliceReducer(intermediateState, action);
    return finalState;
}
```

已经有一个库 [reduce-reducers](https://github.com/acdlite/reduce-reducers) 可以简化以上操作流程。它接收多个 reducer 然后对它们依次执行 `reduce()` 操作，并把产生的中间值依次传递给下一个 reducer：

```js
// 与上述手动编写的 `rootReducer` 一样
const rootReducer = reduceReducers(combinedReducers, crossSliceReducer);
```

值得注意的是，如果你使用 `reduceReducers` 你应该确保第一个 reducer 能够定义初始状态的 state 数据，因为后续的 reducers 通常会假定 state 树已经存在，也就不会为此提供默认状态。

## 更多建议

再次强调，Reducer *只是*普通的函数，明确这一概念非常重要。`combineReducers` 虽然实用也只是冰山一角。除了用 switch 语句编写函数，还可以用条件逻辑；函数不仅可以彼此组合，也可以调用其他函数。也许你可能需要这样的一个 reducer，它既能够重置 state，也能够响应特定的 action。你可以这样做：

```js
const undoableFilteredSliceA = compose(undoReducer, filterReducer("ACTION_1", "ACTION_2"), sliceReducerA);
const rootReducer = combineReducers({
    a : undoableFilteredSliceA,
    b : normalSliceReducerB
});
```

注意 `combineReducers` 无需知道也不关心任何一个负责管理 `a` 数据的 reducer。所以我们并不需要像以往一样修改 `combineReducers` 来实现撤销功能 —— 我们只需把各种函数组合成一个新函数即可。

另外 `combineReducers` 只是 Redux 内置的 reducer 工具，大量形式各异的可复用的第三方 reducer 工具层出不穷。在 [Redux Addons 目录](https://github.com/markerikson/redux-ecosystem-links)中列举了很多可供使用的第三方工具。也许这些工具解决不了你的应用场景，但你随时都可以实现一个能够满足你需求的工具函数。
