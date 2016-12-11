# 缩减样板代码

Redux 很大部分 [受到 Flux 的启发](../introduction/PriorArt.md)，而最常见的关于 Flux 的抱怨是必须写一大堆的样板代码。在这章中，我们将考虑 Redux 如何根据个人风格，团队偏好，长期可维护性等自由决定代码的繁复程度。

## Actions

Actions 是用来描述在 app 中发生了什么的普通对象，并且是描述突变数据意图的唯一途径。很重要的一点是 **不得不 dispatch 的 action 对象并非是一个样板代码，而是 Redux 的一个 [基本设计选择](../introduction/ThreePrinciples.md)**.

不少框架声称自己和 Flux 很像，只不过缺少了 action 对象的概念。在可预测性方面，这是从 Flux 或 Redux 的倒退。如果没有可序列化的普通对象 action，便无法记录或重演用户会话，也无法实现 [带有时间旅行的热重载](https://www.youtube.com/watch?v=xsSnOQynTHs)。如果你更喜欢直接修改数据，那你并不需要使用 Redux 。

Action 一般长这样:

``` javascript
{ type: 'ADD_TODO', text: 'Use Redux' }
{ type: 'REMOVE_TODO', id: 42 }
{ type: 'LOAD_ARTICLE', response: { ... } }
```

一个约定俗成的做法是，action 拥有一个不变的 type 帮助 reducer (或 Flux 中的 Stores ) 识别它们。我们建议你使用 string 而不是 [符号（Symbols）](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 作为 action type ，因为 string 是可序列化的，并且使用符号会使记录和重演变得困难。

在 Flux 中，传统的想法是将每个 action type 定义为 string 常量：

``` javascript
const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const LOAD_ARTICLE = 'LOAD_ARTICLE';
```

这么做的优势是什么？**人们通常声称常量不是必要的。对于小项目也许正确。** 对于大的项目，将 action types 定义为常量有如下好处：

* 帮助维护命名一致性，因为所有的 action type 汇总在同一位置。
* 有时，在开发一个新功能之前你想看到所有现存的 actions 。而你的团队里可能已经有人添加了你所需要的action，而你并不知道。
* Action types 列表在 Pull Request 中能查到所有添加，删除，修改的记录。这能帮助团队中的所有人及时追踪新功能的范围与实现。
* 如果你在 import 一个 Action 常量的时候拼写错了，你会得到 `undefined` 。在 dispatch 这个 action 的时候，Redux 会立即抛出这个错误，你也会马上发现错误。

你的项目约定取决与你自己。开始时，可能在刚开始用内联字符串（inline string），之后转为常量，也许再之后将他们归为一个独立文件。Redux 在这里没有任何建议，选择你自己最喜欢的。

## Action Creators

另一个约定俗成的做法是通过创建函数生成 action 对象，而不是在你 dispatch 的时候内联生成它们。

例如，不是使用对象字面量调用 `dispatch` ：

``` javascript
// event handler 里的某处
dispatch({
  type: 'ADD_TODO',
  text: 'Use Redux'
});
```

你其实可以在单独的文件中写一个 action creator ，然后从 component 里 import：

#### `actionCreators.js`

``` javascript
export function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text
  };
}
```

#### `AddTodo.js`

``` javascript
import { addTodo } from './actionCreators';

// event handler 里的某处
dispatch(addTodo('Use Redux'))
```

Action creators 总被当作样板代码受到批评。好吧，其实你并不非得把他们写出来！**如果你觉得更适合你的项目，你可以选用对象字面量** 然而，你应该知道写 action creators 是存在某种优势的。

假设有个设计师看完我们的原型之后回来说，我们最多只允许三个 todo 。我们可以使用 [redux-thunk](https://github.com/gaearon/redux-thunk) 中间件，并添加一个提前退出，把我们的 action creator 重写成回调形式：

``` javascript
function addTodoWithoutCheck(text) {
  return {
    type: 'ADD_TODO',
    text
  };
}

export function addTodo(text) {
  // Redux Thunk 中间件允许这种形式
  // 在下面的 “异步 Action Creators” 段落中有写
  return function (dispatch, getState) {
    if (getState().todos.length === 3) {
      // 提前退出
      return;
    }

    dispatch(addTodoWithoutCheck(text));
  }
}
```

我们刚修改了 `addTodo` action creator 的行为，使得它对调用它的代码完全不可见。**我们不用担心去每个添加 todo 的地方看一看，以确认他们有了这个检查** Action creator 让你可以解耦额外的分发 action 逻辑与实际发送这些 action 的 components 。当你有大量开发工作且需求经常变更的时候，这种方法十分简便易用。

### Action Creators 生成器

某些框架如 [Flummox](https://github.com/acdlite/flummox) 自动从 action creator 函数定义生成 action type 常量。这个想法是说你不需要同时定义 `ADD_TODO` 常量和 `addTodo()` action creator 。这样的方法在底层也生成了 action type 常量，但他们是隐式生成的、间接级，会造成混乱。因此我们建议直接清晰地创建 action type 常量。

写简单的 action creator 很容易让人厌烦，且往往最终生成多余的样板代码：

``` javascript
export function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text
  }
}

export function editTodo(id, text) {
  return {
    type: 'EDIT_TODO',
    id,
    text
  }
}

export function removeTodo(id) {
  return {
    type: 'REMOVE_TODO',
    id
  }
}
```

你可以写一个用于生成 action creator 的函数：

``` javascript
function makeActionCreator(type, ...argNames) {
  return function(...args) {
    let action = { type }
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index]
    })
    return action
  }
}

const ADD_TODO = 'ADD_TODO'
const EDIT_TODO = 'EDIT_TODO'
const REMOVE_TODO = 'REMOVE_TODO'

export const addTodo = makeActionCreator(ADD_TODO, 'todo')
export const editTodo = makeActionCreator(EDIT_TODO, 'id', 'todo')
export const removeTodo = makeActionCreator(REMOVE_TODO, 'id')
```
一些工具库也可以帮助生成 action creator ，例如 [redux-act](https://github.com/pauldijou/redux-act) 和 [redux-actions](https://github.com/acdlite/redux-actions) 。这些库可以有效减少你的样板代码，并紧守例如 [Flux Standard Action (FSA)](https://github.com/acdlite/flux-standard-action) 一类的标准。

## 异步 Action Creators

[中间件](../Glossary.html#middleware) 让你在每个 action 对象 dispatch 出去之前，注入一个自定义的逻辑来解释你的 action 对象。异步 action 是中间件的最常见用例。

如果没有中间件，[`dispatch`](../api/Store.md#dispatch) 只能接收一个普通对象。因此我们必须在 components 里面进行 AJAX 调用：

#### `actionCreators.js`

``` javascript
export function loadPostsSuccess(userId, response) {
  return {
    type: 'LOAD_POSTS_SUCCESS',
    userId,
    response
  };
}

export function loadPostsFailure(userId, error) {
  return {
    type: 'LOAD_POSTS_FAILURE',
    userId,
    error
  };
}

export function loadPostsRequest(userId) {
  return {
    type: 'LOAD_POSTS_REQUEST',
    userId
  };
}
```

#### `UserInfo.js`

``` javascript
import { Component } from 'react';
import { connect } from 'react-redux';
import { loadPostsRequest, loadPostsSuccess, loadPostsFailure } from './actionCreators';

class Posts extends Component {
  loadData(userId) {
    // 调用 React Redux `connect()` 注入的 props ：
    let { dispatch, posts } = this.props;

    if (posts[userId]) {
      // 这里是被缓存的数据！啥也不做。
      return;
    }

    // Reducer 可以通过设置 `isFetching` 响应这个 action
    // 因此让我们显示一个 Spinner 控件。
    dispatch(loadPostsRequest(userId));

    // Reducer 可以通过填写 `users` 响应这些 actions
    fetch(`http://myapi.com/users/${userId}/posts`).then(
      response => dispatch(loadPostsSuccess(userId, response)),
      error => dispatch(loadPostsFailure(userId, error))
    );
  }

  componentDidMount() {
    this.loadData(this.props.userId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userId !== this.props.userId) {
      this.loadData(nextProps.userId);
    }
  }

  render() {
    if (this.props.isLoading) {
      return <p>Loading...</p>;
    }

    let posts = this.props.posts.map(post =>
      <Post post={post} key={post.id} />
    );

    return <div>{posts}</div>;
  }
}

export default connect(state => ({
  posts: state.posts
}))(Posts);
```

然而，不久就需要再来一遍，因为不同的 components 从同样的 API 端点请求数据。而且我们想要在多个components 中重用一些逻辑（比如，当缓存数据有效的时候提前退出）。

**中间件让我们能写表达更清晰的、潜在的异步 action creators。** 它允许我们 dispatch 普通对象之外的东西，并且解释它们的值。比如，中间件能 “捕捉” 到已经 dispatch 的 Promises 并把他们变为一对请求和成功/失败的 action.

中间件最简单的例子是 [redux-thunk](https://github.com/gaearon/redux-thunk). **“Thunk” 中间件让你可以把 action creators 写成 “thunks”，也就是返回函数的函数。** 这使得控制被反转了： 你会像一个参数一样取得 `dispatch` ，所以你也能写一个多次分发的 action creator 。

>##### 注意

>Thunk 只是一个中间件的例子。中间件不仅仅是关于 “分发函数” 的：而是关于你可以使用特定的中间件来分发任何该中间件可以处理的东西。例子中的 Thunk 中间件添加了一个特定的行为用来分发函数，但这实际取决于你用的中间件。

用 [redux-thunk](https://github.com/gaearon/redux-thunk) 重写上面的代码：

#### `actionCreators.js`

``` javascript
export function loadPosts(userId) {
  // 用 thunk 中间件解释：
  return function (dispatch, getState) {
    let { posts } = getState();
    if (posts[userId]) {
      // 这里是数据缓存！啥也不做。
      return;
    }

    dispatch({
      type: 'LOAD_POSTS_REQUEST',
      userId
    });

    // 异步分发原味 action
    fetch(`http://myapi.com/users/${userId}/posts`).then(
      response => dispatch({
        type: 'LOAD_POSTS_SUCCESS',
        userId,
        response
      }),
      error => dispatch({
        type: 'LOAD_POSTS_FAILURE',
        userId,
        error
      })
    );
  }
}
```

#### `UserInfo.js`

``` javascript
import { Component } from 'react';
import { connect } from 'react-redux';
import { loadPosts } from './actionCreators';

class Posts extends Component {
  componentDidMount() {
    this.props.dispatch(loadPosts(this.props.userId));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userId !== this.props.userId) {
      this.props.dispatch(loadPosts(nextProps.userId));
    }
  }

  render() {
    if (this.props.isLoading) {
      return <p>Loading...</p>;
    }

    let posts = this.props.posts.map(post =>
      <Post post={post} key={post.id} />
    );

    return <div>{posts}</div>;
  }
}

export default connect(state => ({
  posts: state.posts
}))(Posts);
```

这样打得字少多了！如果你喜欢，你还是可以保留 “原味” action creators 比如从一个容器 `loadPosts` action creator 里用到的 `loadPostsSuccess` 。

**最后，你可以编写你自己的中间件** 你可以把上面的模式泛化，然后代之以这样的异步 action creators ：

```js
export function loadPosts(userId) {
  return {
    // 要在之前和之后发送的 action types
    types: ['LOAD_POSTS_REQUEST', 'LOAD_POSTS_SUCCESS', 'LOAD_POSTS_FAILURE'],
    // 检查缓存 (可选):
    shouldCallAPI: (state) => !state.users[userId],
    // 进行取：
    callAPI: () => fetch(`http://myapi.com/users/${userId}/posts`),
    // 在 actions 的开始和结束注入的参数
    payload: { userId }
  };
}
```

解释这个 actions 的中间件可以像这样：

``` javascript
function callAPIMiddleware({ dispatch, getState }) {
  return next => action => {
    const {
      types,
      callAPI,
      shouldCallAPI = () => true,
      payload = {}
    } = action

    if (!types) {
      // Normal action: pass it on
      return next(action)
    }

    if (
      !Array.isArray(types) ||
      types.length !== 3 ||
      !types.every(type => typeof type === 'string')
    ) {
      throw new Error('Expected an array of three string types.')
    }

    if (typeof callAPI !== 'function') {
      throw new Error('Expected callAPI to be a function.')
    }

    if (!shouldCallAPI(getState())) {
      return
    }

    const [ requestType, successType, failureType ] = types

    dispatch(Object.assign({}, payload, {
      type: requestType
    }))

    return callAPI().then(
      response => dispatch(Object.assign({}, payload, {
        response,
        type: successType
      })),
      error => dispatch(Object.assign({}, payload, {
        error,
        type: failureType
      }))
    )
  }
}
```

在传给 [`applyMiddleware(...middlewares)`](../api/applyMiddleware.md) 一次以后，你能用相同方式写你的 API 调用 action creators ：

``` javascript
export function loadPosts(userId) {
  return {
    types: ['LOAD_POSTS_REQUEST', 'LOAD_POSTS_SUCCESS', 'LOAD_POSTS_FAILURE'],
    shouldCallAPI: (state) => !state.users[userId],
    callAPI: () => fetch(`http://myapi.com/users/${userId}/posts`),
    payload: { userId }
  };
}

export function loadComments(postId) {
  return {
    types: ['LOAD_COMMENTS_REQUEST', 'LOAD_COMMENTS_SUCCESS', 'LOAD_COMMENTS_FAILURE'],
    shouldCallAPI: (state) => !state.posts[postId],
    callAPI: () => fetch(`http://myapi.com/posts/${postId}/comments`),
    payload: { postId }
  };
}

export function addComment(postId, message) {
  return {
    types: ['ADD_COMMENT_REQUEST', 'ADD_COMMENT_SUCCESS', 'ADD_COMMENT_FAILURE'],
    callAPI: () => fetch(`http://myapi.com/posts/${postId}/comments`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    }),
    payload: { postId, message }
  };
}
```

## Reducers

Redux reducer 用函数描述逻辑更新减少了样板代码里大量的 Flux stores 。函数比对象简单，比类更简单得多。

这个 Flux store:

``` javascript
let _todos = []

const TodoStore = Object.assign({}, EventEmitter.prototype, {
  getAll() {
    return _todos
  }
})

AppDispatcher.register(function (action) {
  switch (action.type) {
    case ActionTypes.ADD_TODO:
      let text = action.text.trim()
      _todos.push(text)
      TodoStore.emitChange()
  }
})

export default TodoStore
```

用了 Redux 之后，同样的逻辑更新可以被写成 reducing function：

```js
export function todos(state = [], action) {
  switch (action.type) {
  case ActionTypes.ADD_TODO:
    let text = action.text.trim()
    return [ ...state, text ]
  default:
    return state
  }
}
```

`switch` 语句 *不是* 真正的样板代码。真正的 Flux 样板代码是概念性的：发送更新的需求，用 Dispatcher 注册 Store 的需求，Store 是对象的需求 (当你想要一个哪都能跑的 App 的时候复杂度会提升)。

不幸的是很多人仍然靠文档里用没用 `switch` 来选择 Flux 框架。如果你不爱用 `switch` 你可以用一个单独的函数来解决，下面会演示。

### Reducers 生成器

写一个函数将 reducers 表达为 action types 到 handlers 的映射对象。例如，如果想在 `todos` reducer 里这样定义：

``` javascript
export const todos = createReducer([], {
  [ActionTypes.ADD_TODO](state, action) {
    let text = action.text.trim();
    return [...state, text];
  }
})
```

我们可以编写下面的辅助函数来完成：

``` javascript
function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  }
}
```

不难对吧？鉴于写法多种多样，Redux 没有默认提供这样的辅助函数。可能你想要自动地将普通 JS 对象变成 Immutable 对象，以填满服务器状态的对象数据。可能你想合并返回状态和当前状态。有多种多样的方法来 “获取所有” handler，具体怎么做则取决于项目中你和你的团队的约定。

Redux reducer 的 API 是 `(state, action) => state`，但是怎么创建这些 reducers 由你来定。
