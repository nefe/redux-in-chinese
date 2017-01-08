# Reducer 逻辑复用

随着应用程序的增长，在 reducer 逻辑中开始出现一些常见的模式。你可能会发现一部分 reducer 逻辑对于不同类型的数据做着相同的工作，你想通过对每种数据类型复用相同的公共逻辑来减少重复的代码。或者，你可能想要在 store 中处理某个类型的数据的多个”实例“。然而，Redux store 采用全局结构的设计本身就是一种折衷：优点是易于追踪应用程序的整体状态，但是，也可能更难的”命中“那些需要更新特定一部分状态的 action，特别是当你使用了 `combineReducers`。

例如，假设想在程序中追踪多个计数器，分别命名为A，B，和C。定义初始的 `counter` reducer，然后使用 `combineReducers` 去设置状态。

```javascript
function counter(state = 0, action) {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    counterA : counter,
    counterB : counter,
    counterC : counter
});
```

不幸的是，这样设置有一个问题。因为 `combineReducers` 将会使用相同的action调用每一个 reducer，发送 `{type:'INCREMENT'}` 实际上将会导致所有三个计数器的值被增加，而不仅仅是其中一个。我们需要一些方法去封装 `counter` 的逻辑，以此来保证只有我们关心的计数器被更新。

## 使用高阶 Reducer 来定制行为

正如在 [Reducer 逻辑拆分](SplittingReducerLogic.html) 定义的那样，高阶 reducer 是一个接收 reducer 函数作为参数，并返回新的 reducer 函数的函数。它也可以被看作成一个“reducer 工厂”。`combineReducers` 就是一个高阶 reduce 的例子。我们可以使用这种模式来创建特定版本的 reducer 函数，每个版本只响应特定的 action。

创建特定的 reducer 有两种最常见的方式，一个是使用给定的前缀或者后缀生成新的 action 常量，另一个是在 action 对象上附加额外的信息。下面是它们大概的样子：

```javascript
function createCounterWithNamedType(counterName = '') {
    return function counter(state = 0, action) {
        switch (action.type) {
            case `INCREMENT_${counterName}`:
                return state + 1;
            case `DECREMENT_${counterName}`:
                return state - 1;
            default:
                return state;
        }
    }
}

function createCounterWithNameData(counterName = '') {
    return function counter(state = 0, action) {
        const {name} = action;
        if(name !== counterName) return state;

        switch (action.type) {
            case `INCREMENT`:
                return state + 1;
            case `DECREMENT`:
                return state - 1;
            default:
                return state;
        }
    }
}
```

现在我们应该可以使用它们任何一个去生成我们特定的计数器 reducer，然后发送 action，并只会影响关心的那部分的 state：

```javascript
const rootReducer = combineReducers({
    counterA : createCounterWithNamedType('A'),
    counterB : createCounterWithNamedType('B'),
    counterC : createCounterWithNamedType('C'),
});

store.dispatch({type : 'INCREMENT_B'});
console.log(store.getState());
// {counterA : 0, counterB : 1, counterC : 0}
```

我们在某种程度上也可以改变这个方法，创建一个更加通用的高阶 reducer，它可以接收一个给定的 reducer，一个名字或者标识符：

```javascript
function counter(state = 0, action) {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
}

function createNamedWrapperReducer(reducerFunction, reducerName) {
    return (state, action) => {
        const {name} = action;
        const isInitializationCall = state === undefined;
        if(name !== reducerName && !isInitializationCall) return state;

        return reducerFunction(state, action);    
    }
}

const rootReducer = combineReducers({
    counterA : createNamedWrapperReducer(counter, 'A'),
    counterB : createNamedWrapperReducer(counter, 'B'),
    counterC : createNamedWrapperReducer(counter, 'C'),
});
```

甚至还可以写一个通用的高阶 reducer 过滤器：

```javascript
function createFilteredReducer(reducerFunction, reducerPredicate) {
    return (state, action) => {
        const isInitializationCall = state === undefined;
        const shouldRunWrappedReducer = reducerPredicate(action) || isInitializationCall;
        return shouldRunWrappedReducer ? reducerFunction(state, action) : state;
    }
}

const rootReducer = combineReducers({
    // 检查后缀
    counterA : createFilteredReducer(counter, action => action.type.endsWith('_A')),
    // 检查 action 中的额外数据
    counterB : createFilteredReducer(counter, action => action.name === 'B'),
    // 响应所有的 'INCREMENT' action，但不响应 'DECREMENT'
    counterC : createFilteredReducer(counter, action => action.type === 'INCREMENT')
};
```

这些基本的模式可以让你在 UI 内处理一个智能连接的 component 的多个实例。对于像分页或者排序这些通用的功能，可以复用相同的逻辑。
