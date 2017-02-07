# 管理范式化数据

如 [范式化数据](./NormalizingStateShape.md) 章节所提及的，我们经常使用 Normaizr 库将嵌套式数据转化为适合集成到 store 中的范式化数据。但这并不解决针对范式化的数据进一步更新后在应用的其他地方使用的问题。根据喜好有很多种方法可供使用。下面展示一个像文章添加评论的示例。

## 标准方法

### 简单合并

一种方法是将 action 的内容合并到现有的 state。在这种情况下，我们需要一个对数据的深拷贝（非浅拷贝）。Lodash 的 `merge` 方法可以帮我们处理这个：

``` javascript
import merge from "lodash/object/merge";

function commentsById(state = {}, action) {
    switch(action.type) {
        default : {
           if(action.entities && action.entities.comments) {
               return merge({}, state, action.entities.comments.byId);
           }
           return state;
        }
    }
}
```

这样做会让 reducer 保持最小的工作量，但需要 action creator 在 action dispatch 之前做大量的工作来将数据转化成正确的形态。在删除数据项时这种方式也是不适合的。

### reducer 切片组合

如果我们有一个由切片 reducer 组成的嵌套数据，每个切片 reducer 都需要知道如何响应这个 action。因为我们需要让 action 囊括所有相关的数据。譬如更新相应的 Post 对象需要生成一个 comment 的 id，然后使用 id 作为 key 创建一个新的 comment 对象，并且让这个 comment 的 id 包括在所有的 comment id 列表中。下面是一个如何组合这样数据的例子：

> 译者注：结合上章节中范式化之后的 state 阅读

``` javascript
// actions.js
function addComment(postId, commentText) {
    // 为这个 comment 生成一个独一无二的 ID
    const commentId = generateId("comment");

    return {
        type : "ADD_COMMENT",
        payload : {
            postId,
            commentId,
            commentText
        }
    };
}


// reducers/posts.js
function addComment(state, action) {
    const {payload} = action;
    const {postId, commentId} = payload;

    // 查找出相应的文章，简化其余代码
    const post = state[postId];

    return {
        ...state,
        // 用新的 comments 数据更新 Post 对象
        [postId] : {
             ...post,
             comments : post.comments.concat(commentId)             
        }
    };
}

function postsById(state = {}, action) {
    switch(action.type) {
        case "ADD_COMMENT" : return addComment(state, action);
        default : return state;
    }
}

function allPosts(state = [], action) {
    // 省略，这个例子中不需要它
}

const postsReducer = combineReducers({
    byId : postsById,
    allIds : allPosts
});


// reducers/comments.js
function addCommentEntry(state, action) {
    const {payload} = action;
    const {commentId, commentText} = payload;

    // 创建一个新的 Comment 对象
    const comment = {id : commentId, text : commentText};

    // 在查询表中插入新的 Comment 对象
    return {
        ...state,
        [commentId] : comment
    };
}

function commentsById(state = {}, action) {
    switch(action.type) {
        case "ADD_COMMENT" : return addCommentEntry(state, action);
        default : return state;
    }
}


function addCommentId(state, action) {
    const {payload} = action;
    const {commentId} = payload;
    // 把新 Comment 的 ID 添加在 all IDs 的列表后面
    return state.concat(commentId);
}

function allComments(state = [], action) {
    switch(action.type) {
        case "ADD_COMMENT" : return addCommentId(state, action);
        default : return state;
    }
}

const commentsReducer = combineReducers({
    byId : commentsById,
    allIds : allComments
});
```

这个例子之所有有点长，是因为它展示了不同切片 reducer 和 case reducer 是如何配合在一起使用的。注意这里对 “委托” 的理解。postById reducer 切片将工作委拖给 addComment，addComment 将新的评论 id 插入到相应的数据项中。同时 commentsById 和 allComments 的 reducer 切片都有自己的 case reducer，他们更新评论查找表和所有评论 id 列表的表。

## 其他方法

### 基于任务的更新

reducer 仅仅是个函数，因此有无数种方法来拆分这个逻辑。使用切片 reducer 是最常见，但也可以在更面向任务的结构中组织行为。由于通常会涉及到更多嵌套的更新，因此常常会使用 [dot-prop-immutable](https://github.com/debitoor/dot-prop-immutable)、[object-path-immutable](https://github.com/mariocasciaro/object-path-immutable) 等库实现不可变更新。

``` javascript
import posts from "./postsReducer";
import comments from "./commentsReducer";
import dotProp from "dot-prop-immutable";
import {combineReducers} from "redux";
import reduceReducers from "reduce-reducers";

const combinedReducer = combineReducers({
    posts,
    comments
});


function addComment(state, action) {
    const {payload} = action;
    const {postId, commentId, commentText} = payload;

    // State here is the entire combined state
    const updatedWithPostState = dotProp.set(
        state,
        `posts.byId.${postId}.comments`,
        comments => comments.concat(commentId)
    );

    const updatedWithCommentsTable = dotProp.set(
        updatedWithPostState,
        `comments.byId.${commentId}`,
        {id : commentId, text : commentText}
    );

    const updatedWithCommentsList = dotProp.set(
        updatedWithCommentsTable,
        `comments.allIds`,
        allIds => allIds.concat(commentId);
    );

    return updatedWithCommentsList;
}

const featureReducers = createReducer({}, {
    ADD_COMMENT : addComment,
};

const rootReducer = reduceReducers(
    combinedReducer,
    featureReducers
);
```

这种方法让 `ADD_COMMENT` 这个 case 要干哪些事更加清楚，但需要更新嵌套逻辑和对特定状态树的了解。最后这取决于你如何组织 reducer 逻辑，或许你根本不需要这样做。

### Redux-ORM

[Redux-ORM](https://github.com/tommikaikkonen/redux-orm) 库提供了一个非常有用的抽象层，用于管理 Redux store 中存储的范式化数据。它允许你声明 Model 类并且定义他们之间的关系。然后它可以为你的数据类型生成新“表”，充当用于查找数据的特殊选择器工具，并且对数据执行不可变更新。

有几种方法可以用 Redux-ORM 执行数据更新。首选，Redux-ORM 文档建议在每个 Model 子类上定义 reducer 函数，然后将自动生成的组合 reducer 函数放到 store 中：

``` javascript
// models.js
import {Model, many, Schema} from "redux-orm";

export class Post extends Model {
  static get fields() {
    return {
      // 定义一个多边关系 - 一个 Post 可以有多个 Comments，
      // 字段名是 “comments”
      comments : many("Comment")
    };
  }

  static reducer(state, action, Post) {
    switch(action.type) {
      case "CREATE_POST" : {
        // 排队创建一个 Post 实例
        Post.create(action.payload);
        break;
      }
      case "ADD_COMMENT" : {
        const {payload} = action;
        const {postId, commentId} = payload;
        // 排队增加一个 Comment ID 和 Post 实例的联系
        Post.withId(postId).comments.add(commentId);
        break;
      }
    }

    // Redux-ORM 将在返回后自动应用排队的更新
  }
}
Post.modelName = "Post";

export class Comment extends Model {
  static get fields() {
    return {};
  }

  static reducer(state, action, Comment) {
    switch(action.type) {
      case "ADD_COMMENT" : {
        const {payload} = action;
        const {commentId, commentText} = payload;

        // 排队创建一个 Comment 实例
        Comment.create({id : commentId, text : commentText});
        break;
      }   
    }

    // Redux-ORM 将在返回后自动应用排队的更新
  }
}
Comment.modelName = "Comment";

// 创建 Schema 实例，然后和 Post、Comment 数据模型挂钩起来
export const schema = new Schema();
schema.register(Post, Comment);


// main.js
import { createStore, combineReducers } from 'redux'
import {schema} from "./models";

const rootReducer = combineReducers({
  // 插入 Redux-ORM 自动生成的 reducer，这将
  // 初始化一个数据模型 “表”，并且和我们在
  // 每个 Model 子类中定义的 reducer 逻辑挂钩起来
  entities : schema.reducer()
});

// dispatch 一个 action 以创建一个 Post 实例
store.dispatch({
  type : "CREATE_POST",
  payload : {
    id : 1,
    name : "Test Post Please Ignore"
  }
});

// dispath 一个 action 以创建一个 Comment 实例作为上个 Post 的子元素
store.dispatch({
  type : "ADD_COMMENT",
  payload : {
    postId : 1,
    commentId : 123,
    commentText : "This is a comment"
  }
});
```

Redux-ORM 库维护要应用的内部更新队列。这些更新是不可变更新，这个库简化了这个更新过程。

使用 Redux-ORM 的另一个变化是用一个单一的 case reducer 作为抽象层。

``` javascript
import {schema} from "./models";

// 假设这个 case reducer 正在我们的 “entities” 切片 reducer 使用，
// 并且我们在 Redux-ORM 的 Model 子类上没有定义 reducer
function addComment(entitiesState, action) {
    const session = schema.from(entitiesState);
    const {Post, Comment} = session;
    const {payload} = action;
    const {postId, commentId, commentText} = payload;

    const post = Post.withId(postId);
    post.comments.add(commentId);

    Comment.create({id : commentId, text : commentText});

    return session.reduce();
}
```

总之，Redux-ORM 提供了一组非常有用的抽象，用于定义数据类型之间的关系，在我们的 state 中创建了一个 “表”，检索和反规划关系数据，以及将不可变更新应用于关系数据。
