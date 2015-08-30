# 减少样板代码

Redux 很大部分 [受到 Flux 的启发](../introduction/PriorArt.md)，并且最常见的关于 Flux 抱怨是它如何使得你写了一大堆的模板。在这个技巧中，我们将考虑 Redux 如何使得我们选择我们的代码会变得怎样繁复，取决于个人样式，团队选项，长期可维护等等。

## Actions

Actions 是描述了在 app 中所发生的，以单独方式描述对象变异意图的服务的一个普通对象。很重要的一点是 **你必须分发的 action 对象并不是一个模板，而是  Redux 的一个[基本设计选项](../introduction/ThreePrinciples.md)**.

有些框架生成自己和 Flux 很像，不过缺少了 action 对象的概念。为了变得可预测，这是一个从 Flux or Redux 的倒退。如果没有可串行的普通对象 action，便无法记录或重放用户会话，或者无法实现 [带有时间旅行的热重载](https://www.youtube.com/watch?v=xsSnOQynTHs)。如果你更喜欢直接修改数据，那么你并不需要 Redux 。

Action 一般长这样:

```js
{ type: 'ADD_TODO', text: 'Use Redux' }
{ type: 'REMOVE_TODO', id: 42 }
{ type: 'LOAD_ARTICLE', response: { ... } }
```

一个约定俗成的是 actions 拥有一个定值 type 帮助 reducer (或 Flux 中的 Stores ) 识别它们。我们建议的你使用 string 而不是 [Symbols](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 作为 action type ，因为 string 是可串行的，而使用 Symbols 的话你会把记录和重演变得比所需要的更难。

在 Flux 中，传统上认为你将每个 action type 定义为string定值：

```js
const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const LOAD_ARTICLE = 'LOAD_ARTICLE';
```

这么做的优势？**人们通常声称定值不是必要的，对于小的项目可能是正确的。** 对于大的项目，将action types定义为定值有如下好处：

* 帮助维护命名一致性，因为所有的 action type 汇总在同一位置。
* 有的时候，在开发一个新功能之前你想看到所有现存的 actions 。可能的情况是你的团队里已经有人添加了你所需要的action，而你并不知道。
* Action types 列表在Pull Request中能查到所有添加，删除，修改的记录。这能帮助团队中的所有人及时追踪新功能的范围与实现。
* 如果你在导入一个 Action 定值的时候拼写错误，你会得到 `undefined` 。当你纳闷 action 被分发出去而什么也没发生的时候，一个拼写错误更容易被发现。

你的项目的约定取决与你自己。你开始的时候可能用的是inline string，之后转为定值，也许之后将他们归为一个独立文件。Redux 不会给予任何建议，选择你自己最喜欢的。

## Action Creators

另一个约定是，你创建生成 action 对象的函数，而不是在你分发的时候内联生成它们。

例如，用文字对象取代调用 `dispatch` ：

```js
// somewhere in an event handler
dispatch({
  type: 'ADD_TODO',
  text: 'Use Redux'
});
```

你可以在单独的文件中写一个 action creator ，然后从 component 里导入：

#### `actionCreators.js`

```js
export function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text
  };
}
```

#### `AddTodo.js`

```js
import { addTodo } from './actionCreators';

// event handler 里的某处
dispatch(addTodo('Use Redux'))
```

Action creators 总被当作模板受到批评。好吧，其实你并不用把他们写出来！**如果你觉得更适合你的项目你可以选用对象文字** 然而，你应该知道写 action creators 是存在某种优势的。

假设有个设计师看完我们的原型之后回来说，我们需要允许三个 todo 不能再多了。我们可以使用 [redux-thunk](https://github.com/gaearon/redux-thunk) 中间件添加一个提前退出，把我们的 action creator 重写成回调形式：

```js
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

我们刚修改了 `addTodo` action creator 的行为，对调用它的代码完全不可见。**我们不用担心去看每个添加 todo 的地方保证他们有了这个检查** Action creator 让你可以解耦额外的分发 action 逻辑与实际的 components 发送这些 actions，而且当你在重开发经常要改变需求的时候也会非常有用。

### 生成 Action Creators

某些框架如 [Flummox](https://github.com/acdlite/flummox) 自动从 action creator 函数定义生成 action type 定值。这个想法是说你不需要 `ADD_TODO` 定值和 `addTodo()` action creator两个都自己定义。这样的方法在底层也生成 action type 定值，但他们是隐式生成的，也就是间接级。

我们不建议用这样的方法。如果你写像这样简单的 action creator 写烦了：

```js
export function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text
  };
}

export function removeTodo(id) {
  return {
    type: 'REMOVE_TODO',
    id
  };
}
```

你可以写一个生成 action creator 的函数：

```js
function makeActionCreator(type, ...argNames) {
  return function(...args) {
    let action = { type };
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index];
    });
    return action;
  }
}

export const addTodo = makeActionCreator('ADD_TODO', 'todo');
export const removeTodo = makeActionCreator('REMOVE_TODO', 'id');
```

参见 [redux-action-utils](https://github.com/insin/redux-action-utils) 和 [redux-actions](https://github.com/acdlite/redux-actions) 获得更多介绍这样的常用工具。

注意这样的工具给你的代码添加了魔法。
魔法和间接声明真的值得多写一两行代码么？

## 异步 Action Creators

[中间件](../Glossary.html#middleware) 让你注入一个定制逻辑，可以在每个 action 对象分发出去之前解释。异步 actions 是中间件的最常见用例。

没有中间件的话，[`dispatch`](../api/Store.md#dispatch) 只能接收一个普通对象。所以我们在 components 里面进行 AJAX 调用：

#### `actionCreators.js`

```js
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

```js
import { Component } from 'react';
import { connect } from 'react-redux';
import { loadPostsRequest, loadPostsSuccess, loadPostsFailure } from './actionCreators';

class Posts extends Component {
  loadData(userId) {
    // 调用 React Redux `connect()` 注入 props ：
    let { dispatch, posts } = this.props;

    if (posts[userId]) {
      // 这里是被缓存的数据！啥也不做。
      return;
    }

    // Reducer 可以通过设置 `isFetching` 反应这个 action 
    // 因此让我们显示一个 Spinner 控件。
    dispatch(loadPostsRequest(userId));

    // Reducer 可以通过填写 `users` 反应这些 actions
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

然而，不久就需要再来一遍，因为不同的 components 从同样的 API 端点请求数据。而且，我们想要在多个components 中重用一些逻辑（比如，当缓存数据有效的时候提前退出）。

**中间件让我们写的更清楚M的潜在的异步  action creators.** 它使得我们分发普通对象之外的东西，并且解释它们的值。比如，中间件能 “捕捉” 到已经分发的 Promises 并把他们变为一对请求和成功/失败 actions.

最简单的中间件例子是 [redux-thunk](https://github.com/gaearon/redux-thunk). **“Thunk” 中间件让你把 action creators 写成 “thunks”，也就是返回函数的函数。** 这使得控制被反转了： 你会像一个参数一样取得 `dispatch` ，所以你也能写一个多次分发的 action creator 。

>##### 注意

>Thunk 只是中间件的一个例子。中间件不是关于 “让你分发函数” 的：它是关于让你分发你用的特定中间件知道如何处理的任何东西的。Thunk 中间件添加了一个特定的行为用来分发函数，但这实际上取决于你用的中间件。

考虑上面的代码用 [redux-thunk](https://github.com/gaearon/redux-thunk) 重写：

#### `actionCreators.js`

```js
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

    // 异步分发原味 actions 
    fetch(`http://myapi.com/users/${userId}/posts`).then(
      response => dispatch({
        type: 'LOAD_POSTS_SUCCESS',
        userId,
        respone
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

```js
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

这样打得字少多了！如果你喜欢，你还是可以保留 “原味” action creators 比如从一个 “聪明的” `loadPosts` action creator 里用到的 `loadPostsSuccess` 。

**最后，你可以重写中间件** 你可以把上面的模式泛化，然后代之以这样的异步 action creators ：

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

```js
function callAPIMiddleware({ dispatch, getState }) {
  return function (next) {
    return function (action) {
      const {
        types,
        callAPI,
        shouldCallAPI = () => true,
        payload = {}
      } = action;

      if (!types) {
        // 普通 action：传走
        return next(action);
      }

      if (
        !Array.isArray(types) ||
        types.length !== 3 ||
        !types.every(type => typeof type === 'string')
      ) {
        throw new Error('Expected an array of three string types.');
      }

      if (typeof callAPI !== 'function') {
        throw new Error('Expected fetch to be a function.');
      }

      if (!shouldCallAPI(getState())) {
        return;
      }

      const [requestType, successType, failureType] = types;

      dispatch(Object.assign({}, payload, {
        type: requestType
      }));

      return callAPI().then(
        response => dispatch(Object.assign({}, payload, {
          response: response,
          type: successType
        })),
        error => dispatch(Object.assign({}, payload, {
          error: error,
          type: failureType
        }))
      );
    };
  };
}
```

在传给 [`applyMiddleware(...middlewares)`](../api/applyMiddleware.md) 一次以后，你能用相同方式写你的 API-调用 action creators ：

```js
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

Redux 用函数描述逻辑更新减少了模版里大量的 Flux stores 。函数比对象简单，比类更简单得多。

考虑这个 Flux store:

```js
let _todos = [];

export default const TodoStore = assign({}, EventEmitter.prototype, {
  getAll() {
    return _todos;
  }
});

AppDispatcher.register(function (action) {
  switch (action.type) {
  case ActionTypes.ADD_TODO:
    let text = action.text.trim();
    _todos.push(text);
    TodoStore.emitChange();
  }
});
```

用了 Redux 之后，同样的逻辑更新可以被写成 reducing function：

```js
export function todos(state = [], action) {
  switch (action.type) {
  case ActionTypes.ADD_TODO:
    let text = action.text.trim();
    return [...state, text];
  default:
    return state;
  }
}
```

`switch` 语句 *不是* 真正的模版。真正的 Flux 模版是概念性的：发送更新的需求，用 Dispatcher 注册 Store 的需求，Store 是对象的需求 (当你想要一个哪都能跑的 App 的时候复杂度会提升)。

不幸的是很多人仍然靠文档里用没用 `switch` 来选择 Flux 框架。如果你不爱用 `switch` 你可以用一个单独的函数来解决，下面会演示。

### 生成 Reducers

让我们写一个函数使得我们将 reducers 表达为 action types 到 handlers 的映射对象。例如，在我们的 `todos` reducer 里这样定义：

```js
export const todos = createReducer([], {
  [ActionTypes.ADD_TODO](state, action) {
    let text = action.text.trim();
    return [...state, text];
  }
}
```

我们可以写下面的帮忙函数来完成：

```js
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

不难对吧？Redux 没有默认提供这样的帮忙函数，因为有好多种写的方法。可能你想要自动把普通 JS 对象变成不可变对象通过湿化服务器状态。可能你想合并返回状态和当前状态。有很多方法 “获取所有” handler。这些都取决于你为你的团队在特定项目中选择的约定。

Redux reducer 的 API 是 `(state, action) => state`，但是怎么创建这些 reducers 由你来定。
