---
id: miscellaneous
title: Miscellaneous
hide_title: false
---

# Redux FAQ: 各种各样的

## 目录

- [有没有更大的、“真正的” Redux 项目？](#are-there-any-larger-real-redux-projects)
- [如何在 Redux 中实现身份验证？](#how-can-i-implement-authentication-in-redux)

## 各种各样的

### 有没有更大的、“真正的” Redux 项目？

是的，很多！ 仅举几例：

- [Twitter's mobile site](https://mobile.twitter.com/)
- [Wordpress's new admin page](https://github.com/Automattic/wp-calypso)
- [Firefox's new debugger](https://github.com/devtools-html/debugger.html)
- [The HyperTerm terminal application](https://github.com/zeit/hyperterm)

还有很多很多！ Redux 插件目录有 **[基于 Redux 的应用程序和示例列表](https://github.com/markerikson/redux-ecosystem-links/blob/master/apps-and-examples.md)** 指向各种大大小小的实际应用。

#### 更多信息

**文档**

- [简介：示例](../introduction/Examples.md)

**讨论**

- [Reddit: 大型开源 react/redux 项目？](https://www.reddit.com/r/reactjs/comments/496db2/large_open_source_reactredux_projects/)
- [HN: 有没有使用 Redux 构建的大型 Web 应用程序？](https://news.ycombinator.com/item?id=10710240)

### 如何在 Redux 中实现身份验证？

身份验证对于任何实际应用程序都是必不可少的。在进行身份验证时，你必须记住，组织应用程序的方式不会发生任何变化，并且你应该以与任何其他功能相同的方式实现身份验证。 它相对简单：

1. 为 `LOGIN_SUCCESS`、`LOGIN_FAILURE` 等创建动作常量。

2. 创建将凭据、表示身份验证是否成功的标志、令牌或错误消息作为有效负载的操作创建者。

3. 使用 Redux Thunk middleware 或你认为适合的任何 middleware 创建异步 action creator，以向 API 发起网络请求，如果凭据有效，则返回令牌。 然后将令牌保存在本地 store 中，或者如果失败则向用户显示响应。 你可以在上一步中编写的 action creator 中执行这些副作用。

4. 创建一个 reducer，为每个可能的身份验证情况（`LOGIN_SUCCESS`、`LOGIN_FAILURE`等）返回下一个 state。

#### 更多信息

**文章**

- [通过 Auth0 使用 JWT 进行身份验证](https://auth0.com/blog/2016/01/04/secure-your-react-and-redux-app-with-jwt-authentication/)
- [在 Redux 中处理身份验证的技巧](https://medium.com/@MattiaManzati/tips-to-handle-authentication-in-redux-2-introducing-redux-saga-130d6872fbe7)

**示例**

- [react-redux-jwt-auth-example](https://github.com/joshgeller/react-redux-jwt-auth-example)

**Libraries**

- [Redux 插件目录：用例 - 身份验证](https://github.com/markerikson/redux-ecosystem-links/blob/master/use-cases.md#authentication)
