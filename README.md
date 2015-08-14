# [Redux 中文文档](http://github.com/camsong/redux-in-chinese)

在线 Gitbook 地址：http://camsong.github.io/redux-in-chinese/

Redux 是 JavaScript 状态容器，提供可预测化的状态管理。

可以让你构建一致化的应用，运行于不同的环境（客户端、服务器、原生应用），并且易于测试。不仅于此，它还提供
超爽的开发体验，比如有一个[时间旅行调试器可以编辑后实时预览](https://github.com/gaearon/redux-devtools)。

Redux 除了和 [React](https://facebook.github.io/react/) 一起用外，还支持其它界面库。
体小精悍（只有2kB）且没有任何依赖。

### 评价

>[“Love what you’re doing with Redux”](https://twitter.com/jingc/status/616608251463909376)
>Jing Chen，Flux 作者

>[“I asked for comments on Redux in FB's internal JS discussion group, and it was universally praised. Really awesome work.”](https://twitter.com/fisherwebdev/status/616286955693682688)
>Bill Fisher，Flux 作者

>[“It's cool that you are inventing a better Flux by not doing Flux at all.”](https://twitter.com/andrestaltz/status/616271392930201604)
>André Staltz，Cycle 作者

### 开发经历

Redux 的开发最早开始于我在准备 React Europe 演讲[热加载与时间旅行](https://www.youtube.com/watch?v=xsSnOQynTHs)的时候，当初的目标是创建一个状态管理库，来提供最简化 API，但同时做到行为的完全可预测，因此才得以实现日志打印，热加载，时间旅行，同构应用，录制和重放，而不需要任何开发参与。

### 启示

Redux 由 [Flux] 演变而来，但受 [Elm](http://elm-lang.org/guide/architecture) 的启发，避开了 Flux 的复杂性。不管你有没有使用过它们，只需几分钟就能上手 Redux。

### 安装

安装稳定版：

```
npm install --save redux
```

多数情况下，你还需要使用 [React 绑定库](http://github.com/gaearon/react-redux) 和 [开发者工具]。

```
npm install --save react-redux
npm install --save-dev redux-devtools
```

### 要点

应用中所有的 state 都以一个对象树的形式储存在一个单一的 *store* 中。
惟一改变 state 的办法是触发 *action*，一个描述发生什么的对象。
为了描述 action 如何改变 state 树，你需要编写 *reducers*。

就是这样！

```js
import { createStore } from 'redux';

/**
 * 这是一个 reducer，形式为 (state, action) => state 的纯函数。
 * 描述了 action 如何把 state 转变成下一个 state。
 *
 * state 的形式取决于你，可以是基本类型、数组、对象、
 * 甚至是 Immutable.js 生成的数据结构。惟一的要点是
 * 当 state 变化时需要返回全新的对象，而不是修改传入的参数。
 *
 * 下面例子使用 `switch` 语句和字符串来做判断，但你可以写帮助类(helper)
 * 根据不同的约定（如方法映射）来判断，只要适用你的项目即可。
 */
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

// 创建 Redux store 来存放应用的状态。
// API 是 { subscribe, dispatch, getState }。
let store = createStore(counter);

// 可以手动订阅更新，也可以事件绑定到视图层。
store.subscribe(() =>
  console.log(store.getState())
);

// 改变内部 state 惟一方法是 dispatch 一个 action。
// action 可以被序列化，用日记记录和储存下来，后期还可以以回放的方式执行
store.dispatch({ type: 'INCREMENT' });
// 1
store.dispatch({ type: 'INCREMENT' });
// 2
store.dispatch({ type: 'DECREMENT' });
// 1
```
你应该把要做的修改变成一个普通对象，这个对象被叫做 *action*，而不是直接修改 state。然后编写专门的函数来决定每个 action 如何改变应用的 state，这个函数被叫做 *reducer*。

如果你以前使用 Flux，你需要知道一个非常重要的区别。Redux 没有 Dispatcher 且不支持多个 store。相反，只有一个单一的 store 和一个根级的 reduce 函数（reducer）。随着应用不断变大，你应该把根级的 reducer 拆成多个小的 reducers，分别独立地操作 state 树的不同部分，而不是添加新的 stores。这就像一个 React 应用只有一个根级的组件，这个根组件又由很多小组件构成。

用这个架构开发计数器有点杀鸡用牛刀，但它的美在于做复杂应用和庞大系统时优秀的扩展能力。由于它可以用 action 追溯应用的每一次修改，因此才有强大的开发工具。如录制用户会话并回放所有 action 来重现它。

### 交流

打开 Slack，加入 [Reactiflux](http://reactiflux.com/) 中的 **#redux** 频道。

### 感谢

* [Elm 架构](https://github.com/evancz/elm-architecture-tutorial) 介绍了使用 reducers 来操作 state 数据；
* [Turning the database inside-out](http://blog.confluent.io/2015/03/04/turning-the-database-inside-out-with-apache-samza/) 大开脑洞;
* [ClojureScript 里使用 Figwheel](http://www.youtube.com/watch?v=j-kj2qwJa_E) for convincing me that re-evaluation should “just work”;
* [Webpack](https://github.com/webpack/docs/wiki/hot-module-replacement-with-webpack) 热模块替换;
* [Flummox](https://github.com/acdlite/flummox) 教我在 Flux 里去掉样板文件和单例对象；
* [disto](https://github.com/threepointone/disto) 演示使用热加载 Stores 的可行性；
* [NuclearJS](https://github.com/optimizely/nuclear-js) 证明这样的架构性能可以很好；
* [Om](https://github.com/omcljs/om) 普及 state 惟一原子化的思想。
* [Cycle](https://github.com/staltz/cycle) 介绍了 function 是如何在很多场景都是最好的工具；
* [React](https://github.com/facebook/react) 实践启迪。

非常感谢 [Jamie Paton](http://jdpaton.github.io/) 把 `redux` NPM 包转让给我。

### 许可协议

MIT
