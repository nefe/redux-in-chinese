# Reducers

[Actions](./Actions.md) 只是描述了**有事情发生了**这一事实，并没有指明应用如何更新 state。这是 reducer 要做的事情。

## 设计 State 结构

应用所有的 state 都被保存在一个单一对象中（我们称之为 state 树）。建议在写代码前先想一下这个对象的结构。如何才能以最简的形式把应用的 state 用对象描述出来？

以 todo 应用为例，需要保存两个不同的内容：

* 当前选中的任务过滤条件；
* 真实的任务列表。

通常，这个 state 树还需要存放其它一些数据，还有界面 state。这样做没问题，但尽量把这些数据与界面 state 分开。

```js
{
  visibilityFilter: 'SHOW_ALL',
  todos: [{
    text: 'Consider using Redux',
    completed: true,
  }, {
    text: 'Keep all state in a single tree',
    completed: false
  }]
}
```

>##### Note on Relationships

>In a more complex app, you’re going to want different entities to reference each other. We suggest that you keep your state as normalized as possible, without any nesting. Keep every entity in an object stored with an ID as a key, and use IDs to reference it from other entities, or lists. Think of the app’s state as of a database. This approach is described in [normalizr](https://github.com/gaearon/normalizr) documentation in detail. For example, keeping `todosById: { id -> todo }` and `todos: array<id>` inside the state would be a better idea in a real app, but we’re keeping the example simple.

## Action 处理

现在我们已经确定了 state 对象的结构，就可以开始开发 reducer。reducer 就是一个函数，接收旧的 state 和 action，返回新的 state。

```js
(previousState, action) => newState
```

之所以称作 reducer 是因为和 [`Array.prototype.reduce(reducer, ?initialValue)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) 格式很像。保持 reducer 纯净非常重要。永远**不要**在 reducer 里做这些操作：

* 修改传入参数；
* 执行有副作用的操作，如 API 请求和路由跳转。

在[高级篇](../advanced/README.md)里会介绍如何执行有副作用的操作。现在只需要谨记 reducer 一定要保持纯净。**只要传入参数一样，返回必须一样。没有特殊情况、没有副作用，没有 API 请求、没有修改参数，单纯执行计算。**

明白了这些之后，就可以开始编写 reducer，并让它来处理之前定义过的 [actions](Actions.md)。

我们在开始时定义默认的 state。Redux 首次执行时，state 为 `undefined`，这时候会返回默认 state。

```js
import { VisibilityFilters } from './actions';

const initialState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  todos: []
};

function todoApp(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }

  // 这里暂不处理任何 action，
  // 仅返回传入的 state。
  return state;
}
```

这里一个技巧是使用 [ES6 参数默认值语法](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/default_parameters) 来精简代码。

```js
function todoApp(state = initialState, action) {
  // 这里暂不处理任何 action，
  // 仅返回传入的 state。
  return state;
}
```

现在可以处理 `SET_VISIBILITY_FILTER`。需要做的只是改变 state 中的 `visibilityFilter`。

```js
function todoApp(state = initialState, action) {
  switch (action.type) {
  case SET_VISIBILITY_FILTER:
    return Object.assign({}, state, {
      visibilityFilter: action.filter
    });
  default:
    return state;
  }
}
```

注意:

1. **不要修改 `state`。** 使用 [`Object.assign()`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) 新建了一个副本。不能这样使用 `Object.assign(state, { visibilityFilter: action.filter })`，因为它会改变第一个参数的值。**一定**要把第一个参数设置为空对象。也可以使用 ES7 中还在试验阶段的特性 `{ ...state, ...newState }`，参考 [对象展开语法](https://github.com/sebmarkbage/ecmascript-rest-spread)。

2. **在 `default` 情况下返回旧的 `state`。**遇到未知的 action 时，一定要返回旧的 `state`。

>##### `Object.assign` 使用提醒

>[`Object.assign()`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) 是 ES6 特性，但多数浏览器并不支持。你要么使用 polyfill，[Babel 插件](https://github.com/babel-plugins/babel-plugin-object-assign)，或者使用其它库如 [`_.assign()`](https://lodash.com/docs#assign) 提供的帮助方法。 

>##### `switch` 和样板代码提醒

>`state` 语句并不是严格意义上的样板代码。Flux 中真实的样板代码是概念性的：更新必须要发送、Store 必须要注册到 Dispatcher、Store 必须是对象（开发同构应用时变得非常复杂）。为了解决这些问题，Redux 放弃了 event emitters（事件发送器），转而使用纯 reducer。

>很不幸到现在为步，还有很多人存在一个误区：根据文档中是否使用 `switch` 来决定是否使用它。如果你不喜欢 `switch`，完全可以自定义一个 `createReducer` 函数来接收一个事件处理函数列表，参照["减少样板代码"](../recipes/ReducingBoilerplate.md#reducers)。

## 处理多个 action

还有两个 action 需要处理。让我们先处理 `ADD_TODO`。

```js
function todoApp(state = initialState, action) {
  switch (action.type) {
  case SET_VISIBILITY_FILTER:
    return Object.assign({}, state, {
      visibilityFilter: action.filter
    });
  case ADD_TODO:
    return Object.assign({}, state, {
      todos: [...state.todos, {
        text: action.text,
        completed: false
      }]
    });    
  default:
    return state;
  }
}
```

如上，不直接修改 `state` 中的字段，而是返回新对象。新的 `todos` 对象就相当于旧的 `todos` 在末尾加上新建的 todo。而这个新的 todo 又是在 action 中创建的。

最后，`COMPLETE_TODO` 的实现也很好理解：

```js
case COMPLETE_TODO:
  return Object.assign({}, state, {
    todos: [
      ...state.todos.slice(0, action.index),
      Object.assign({}, state.todos[action.index], {
        completed: true
      }),
      ...state.todos.slice(action.index + 1)
    ]
  });
```

因为我们不能直接修改却要更新数组中指定的一项数据，这里需要先把前面和后面都切开。如果经常需要这类的操作，可以选择使用帮助类 [React.addons.update](https://facebook.github.io/react/docs/update.html)，[updeep](https://github.com/substantial/updeep)，或者使用原生支持深度更新的库 [Immutable](http://facebook.github.io/immutable-js/)。最后，时刻谨记永远不要在克隆 `state` 前修改它。

## 拆分 Reducer

目前的代码看起来非常拖沓冗余：

```js
function todoApp(state = initialState, action) {
  switch (action.type) {
  case SET_VISIBILITY_FILTER:
    return Object.assign({}, state, {
      visibilityFilter: action.filter
    });
  case ADD_TODO:
    return Object.assign({}, state, {
      todos: [...state.todos, {
        text: action.text,
        completed: false
      }]
    });
  case COMPLETE_TODO:
    return Object.assign({}, state, {
      todos: [
        ...state.todos.slice(0, action.index),
        Object.assign({}, state.todos[action.index], {
          completed: true
        }),
        ...state.todos.slice(action.index + 1)
      ]
    });
  default:
    return state;
  }
}
```

Is there a way to make it easier to comprehend? It seems like `todos` and `visibilityFilter` are updated completely independently. Sometimes state fields depend on one another and more consideration is required, but in our case we can easily split updating `todos` into a separate function:

```js
function todos(state = [], action) {
  switch (action.type) {
  case ADD_TODO:
    return [...state, {
      text: action.text,
      completed: false
    }];
  case COMPLETE_TODO:
    return [
      ...state.slice(0, action.index),
      Object.assign({}, state[action.index], {
        completed: true
      }),
      ...state.slice(action.index + 1)
    ];
  default:
    return state;
  }
}

function todoApp(state = initialState, action) {
  switch (action.type) {
  case SET_VISIBILITY_FILTER:
    return Object.assign({}, state, {
      visibilityFilter: action.filter
    });
  case ADD_TODO:
  case COMPLETE_TODO:
    return Object.assign({}, state, {
      todos: todos(state.todos, action)
    });
  default:
    return state;
  }
}
```

Note that `todos` also accepts `state`—but it’s an array! Now `todoApp` just gives it the slice of the state to manage, and `todos` knows how to update just that slice. **This is called *reducer composition*, and it’s the fundamental pattern of building Redux apps.**

Let’s explore reducer composition more. Can we also extract a reducer managing just `visibilityFilter`? We can:

```js
function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
  case SET_VISIBILITY_FILTER:
    return action.filter;
  default:
    return state;
  }
}
```

Now we can rewrite the main reducer as a function that calls the reducers managing parts of the state, and combines them into a single object. It also doesn’t need to know the complete initial state anymore. It’s enough that the child reducers return their initial state when given `undefined` at first.

```js
function todos(state = [], action) {
  switch (action.type) {
  case ADD_TODO:
    return [...state, {
      text: action.text,
      completed: false
    }];
  case COMPLETE_TODO:
    return [
      ...state.slice(0, action.index),
      Object.assign({}, state[action.index], {
        completed: true
      }),
      ...state.slice(action.index + 1)
    ];
  default:
    return state;
  }
}

function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
  case SET_VISIBILITY_FILTER:
    return action.filter;
  default:
    return state;
  }
}

function todoApp(state = {}, action) {
  return {
    visibilityFilter: visibilityFilter(state.visibilityFilter, action),
    todos: todos(state.todos, action)
  };
}
```

**Note that each of these reducers is managing its own part of the global state. The `state` parameter is different for every reducer, and corresponds to the part of the state it manages.**

This is already looking good! When the app is larger, we can split the reducers into separate files and keep them completely independent and managing different data domains.

Finally, Redux provides a utility called [`combineReducers()`](../api/combineReducers.md) that does the same boilerplate logic that the `todoApp` above currently does. With its help, we can rewrite `todoApp` like this:

```js
import { combineReducers } from 'redux';

const todoApp = combineReducers({
  visibilityFilter,
  todos
});

export default todoApp;
```

Note that this is completely equivalent to:

```js
export default function todoApp(state, action) {
  return {
    visibilityFilter: visibilityFilter(state.visibilityFilter, action),
    todos: todos(state.todos, action)
  };
}
```

You could also give them different keys, or call functions differently. These two ways to write a combined reducer are completely equivalent:

```js
const reducer = combineReducers({
  a: doSomethingWithA,
  b: processB,
  c: c
});
```

```js
function reducer(state, action) {
  return {
    a: doSomethingWithA(state.a, action),
    b: processB(state.b, action),
    c: c(state.c, action)
  };
}
```

All [`combineReducers()`](../api/combineReducers.md) does is generate a function that calls your reducers **with the slices of state selected according to their keys**, and combining their results into a single object again. [It’s not magic.](https://github.com/gaearon/redux/issues/428#issuecomment-129223274)

>##### Note for ES6 Savvy Users

>Because `combineReducers` expects an object, we can put all top-level reducers into a separate file, `export` each reducer function, and use `import * as reducers` to get them as an object with their names as the keys:

>```js
>import { combineReducers } from 'redux';
>import * as reducers from './reducers';
>
>const todoApp = combineReducers(reducers);
>```
>
>Because `import *` is still new syntax, we don’t use it anymore in the documentation to avoid [confusion](https://github.com/gaearon/redux/issues/428#issuecomment-129223274), but you may encounter it in some community examples.

## Source Code

#### `reducers.js`

```js
import { combineReducers } from 'redux';
import { ADD_TODO, COMPLETE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters } from './actions';
const { SHOW_ALL } = VisibilityFilters;

function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
  case SET_VISIBILITY_FILTER:
    return action.filter;
  default:
    return state;
  }
}

function todos(state = [], action) {
  switch (action.type) {
  case ADD_TODO:
    return [...state, {
      text: action.text,
      completed: false
    }];
  case COMPLETE_TODO:
    return [
      ...state.slice(0, action.index),
      Object.assign({}, state[action.index], {
        completed: true
      }),
      ...state.slice(action.index + 1)
    ];
  default:
    return state;
  }
}

const todoApp = combineReducers({
  visibilityFilter,
  todos
});

export default todoApp;
```

## 下一步

接下来会学习 [创建 Redux store](Store.md)。store 能维持应用的 state，并在当你发起 action 的时候调用 reducer。
