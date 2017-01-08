# 子应用隔离

考虑一下这样的场景：有一个大应用（对应 `<BigApp>` 组件）包含了很多小的“子应用”（对应 `SubApp` 组件）：

```js
import React, { Component } from 'react'
import SubApp from './subapp'

class BigApp extends Component {
  render() {
    return (
      <div>
        <SubApp />
        <SubApp />
        <SubApp />
      </div>
    )
  }
}
```

这些 `<SubApp>` 是完全独立的。它们并不会共享数据或 action，也互不可见且不需要通信。

这时最好的做法是不要把它混入到标准 Redux 的 reducer 组件中。
对于一般型的应用，还是建议使用 reducer 组件。但对于 “应用集合”，“仪表板”，或者企业级软件这些把多个本来独立的工具凑到一起打包的场景，可以试下子应用的方案。

子应用的方案还适用于有多个产品或垂直业务的大团队。小团队可以独立发布子应用或者互相独立于自己的“应用壳”中。

下面是 connect 过的子应用的根组件。
像其它组件一样，它还可以渲染更多子组件，connect 或者没有 connect 的都可以。通常只要把它使用 `<Provider>` 渲染就够了。

```js
class App extends Component { ... }
export default connect(mapStateToProps)(App)
```

但是，如果不想让外部知道子应用的组件是 Redux 应用的话，可以不调用 `ReactDOM.render(<Provider><App /></Provider>)`。

或者可以在“大应用”中同时运行它的多个实例呢，还能保证每个在黑盒里运行，外界对 Redux 无感知。

为了使用 React API 来隐藏 Redux 的痕迹，在组件的构造方法里初始化 store 并把它包到一个特殊的组件中：

```js
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import reducer from './reducers'
import App from './App'

class SubApp extends Component {
  constructor(props) {
    super(props)
    this.store = createStore(reducer)
  }

  render() {
    return (
      <Provider store={this.store}>
        <App />
      </Provider>
    )
  }
}
```

这样的话每个实例都是独立的。

如果应用间需要共享数据，*不* 推荐使用这个模式。
但是，如果大应用完全不需要访问子应用内部数据的话非常有用，
同时我们还想把 Redux 作为一种内部细节实现方式对外部隐藏。
每个组件实例都有它自己的 store，所以它们彼此是*不可见*的。
