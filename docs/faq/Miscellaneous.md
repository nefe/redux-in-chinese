# Redux 常见问题：其它

## 目录

- [有 “真实存在” 且很庞大的 Redux 项目吗？](#miscellaneous-real-projects)
- [如何在 Redux 中实现鉴权？](#miscellaneous-authentication)

## 其他

<a id="miscellaneous-real-projects"></a>
### 有 “真实存在” 且很庞大的 Redux 项目吗？

存在，并且有很多，比如：

- [Twitter's mobile site](https://twitter.com/necolas/status/727538799966715904)
- [Wordpress's new admin page](https://github.com/Automattic/wp-calypso)
- [Firefox's new debugger](https://github.com/jlongster/debugger.html)
- [Mozilla's experimental browser testbed](https://github.com/mozilla/tofino)
- [The HyperTerm terminal application](https://github.com/zeit/hyperterm)

很多，真的有很多！

#### 补充资料

**文档**
- [Introduction: Examples](introduction/Examples.md)

**讨论**
- [Reddit: Large open source react/redux projects？](https://www.reddit.com/r/reactjs/comments/496db2/large_open_source_reactredux_projects/)
- [HN: Is there any huge web application built using Redux？](https://news.ycombinator.com/item？id=10710240)

<a id="miscellaneous-authentication"></a>
### 如何在 Redux 中实现鉴权？

在任何真正的应用中，鉴权都必不可少。当考虑鉴权时须谨记：不管你怎样组织应用，都并不会改变什么，你应当像实现其它功能一样实现鉴权。这实际上很简单：

1. 为 `LOGIN_SUCCESS`、`LOGIN_FAILURE` 等定义 action 常量。

2. 创建接受凭证的 action 创建函数，凭证是指示身份验证成功与否的标志、一个令牌、或者作为负载的错误信息。

3. 使用 Redux Thunk middleware 或者其它适合于触发网络请求（请求 API，如果是合法鉴权则返回令牌）的 middleware 创建一个异步的 action 创建函数。之后在本地存储中保存令牌或者给用户一个非法提示。可以通过执行上一步的 action 创建函数达到此效果。

4. 为每个可能出现的鉴权场景（`LOGIN_SUCCESS`、`LOGIN_FAILURE`等）编写独立的 reducer。

#### 补充资料

**文章**

- [Authentication with JWT by Auth0](https://auth0.com/blog/2016/01/04/secure-your-react-and-redux-app-with-jwt-authentication/)
- [Tips to Handle Authentication in Redux](https://medium.com/@MattiaManzati/tips-to-handle-authentication-in-redux-2-introducing-redux-saga-130d6872fbe7)

**例子**

- [react-redux-jwt-auth-example](https://github.com/joshgeller/react-redux-jwt-auth-example)

**讨论**

- [redux-auth](https://github.com/lynndylanhurley/redux-auth)




