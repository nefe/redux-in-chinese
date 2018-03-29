# [Redux 中文文档](http://github.com/camsong/redux-in-chinese) [![Backers on Open Collective](https://opencollective.com/redux-in-chinese/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/redux-in-chinese/sponsors/badge.svg)](#sponsors) [![Join the chat at https://gitter.im/camsong/redux-in-chinese](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/camsong/redux-in-chinese?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

<img src='https://camo.githubusercontent.com/f28b5bc7822f1b7bb28a96d8d09e7d79169248fc/687474703a2f2f692e696d6775722e636f6d2f4a65567164514d2e706e67' height='60'>

> :tada: :tada: :tada:
 本文档从建立之初，帮助了非常多的小伙伴学习 Redux，也收到了 Redux 作者 Dan 的多次点赞。目前每天浏览量大概在一万左右。但由于几位作者工作都比较忙，很多文档已经过期，却也没有时间更新。如果你有时间，希望你和我们一起翻译，帮助更多人，欢迎提交 PR。不知何处下手不用怕？我们为你准备好了完善的 [ETC 翻译文档](https://github.com/react-guide/etc)。:point_right: 回复 issue 认领 https://github.com/camsong/redux-in-chinese/issues :heart: :heart: :heart:

> 在线 Gitbook 地址：http://cn.redux.js.org/
> 英文原版：http://redux.js.org/
> 学了这个还不尽兴？推荐极精简的 [Redux Tutorial 教程](https://github.com/react-guide/redux-tutorial-cn#redux-tutorial)
> React 核心开发者写的 [React 设计思想](https://github.com/react-guide/react-basic)

> :arrow_down: 离线下载：[pdf 格式](https://github.com/camsong/redux-in-chinese/raw/master/offline/redux-in-chinese.pdf)，[epub 格式](https://github.com/camsong/redux-in-chinese/raw/master/offline/redux-in-chinese.epub)，[mobi 格式](https://github.com/camsong/redux-in-chinese/raw/master/offline/redux-in-chinese.mobi)

Redux 是 JavaScript 状态容器，提供可预测化的状态管理。
(如果你需要一个 WordPress 框架，请查看 [Redux Framework](https://reduxframework.com/)。)

可以让你构建一致化的应用，运行于不同的环境（客户端、服务器、原生应用），并且易于测试。不仅于此，它还提供
超爽的开发体验，比如有一个[时间旅行调试器可以编辑后实时预览](https://github.com/gaearon/redux-devtools)。

Redux 除了和 [React](https://facebook.github.io/react/) 一起用外，还支持其它界面库。
它体小精悍（只有2kB，包括依赖）。

### 评价

>[“Love what you’re doing with Redux”](https://twitter.com/jingc/status/616608251463909376)
>Jing Chen，Flux 作者

>[“I asked for comments on Redux in FB's internal JS discussion group, and it was universally praised. Really awesome work.”](https://twitter.com/fisherwebdev/status/616286955693682688)
>Bill Fisher，Flux 作者

>[“It's cool that you are inventing a better Flux by not doing Flux at all.”](https://twitter.com/andrestaltz/status/616271392930201604)
>André Staltz，Cycle 作者

### 开始之前

> 也推荐阅读你可能并不需要Redux：
> [“You Might Not Need Redux”](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)

### 开发经历

Redux 的开发最早开始于我在准备 React Europe 演讲[热加载与时间旅行](https://www.youtube.com/watch?v=xsSnOQynTHs)的时候，当初的目标是创建一个状态管理库，来提供最简化 API，但同时做到行为的完全可预测，因此才得以实现日志打印，热加载，时间旅行，同构应用，录制和重放，而不需要任何开发参与。

### 启示

Redux 由 [Flux](http://facebook.github.io/flux/) 演变而来，但受 [Elm](http://elm-lang.org/guide/architecture) 的启发，避开了 Flux 的复杂性。
不管你有没有使用过它们，只需几分钟就能上手 Redux。

### 安装

安装稳定版：

```
npm install --save redux
```

以上基于使用 [npm](https://www.npmjs.com/) 来做包管理工具的情况下。

否则你可以直接在 [unpkg 上访问这些文件](https://unpkg.com/redux/)，下载下来，或者把让你的包管理工具指向它。

一般情况下人们认为 Redux 就是一些 [CommonJS](http://webpack.github.io/docs/commonjs.html) 模块的集合。这些模块就是你在使用 [Webpack](http://webpack.github.io/)、[Browserify](http://browserify.org/)、或者 Node 环境时引入的。如果你想追求时髦并使用 [Rollup](http://rollupjs.org/)，也是支持的。

你也可以不使用模块打包工具。`redux` 的 npm 包里 [`dist` 目录](https://unpkg.com/redux/dist/)包含了预编译好的生产环境和开发环境下的 [UMD](https://github.com/umdjs/umd) 文件。可以直接使用，而且支持大部分流行的 JavaScript 包加载器和环境。比如，你可以直接在页面上的 `<script>` 标签 中引入 UMD 文件，也可以[让 `Bower` 来安装](https://github.com/reactjs/redux/pull/1181#issuecomment-167361975)。UMD 文件可以让你使用 `window.Redux` 全局变量来访问 Redux。

Redux 源文件由 ES2015 编写，但是会预编译到 CommonJS 和 UMD 规范的 ES5，所以它可以支持 [任何现代浏览器](http://caniuse.com/#feat=es5)。你不必非得使用 Babel 或模块打包器来使用 Redux。

#### 附加包

多数情况下，你还需要使用 [React 绑定库](http://github.com/gaearon/react-redux)和[开发者工具](http://github.com/gaearon/redux-devtools)。

```
npm install --save react-redux
npm install --save-dev redux-devtools
```

需要提醒的是，和 Redux 不同，很多 Redux 生态下的包并不提供 UMD 文件，所以为了提升开发体验，我们建议使用像 [Webpack](http://webpack.github.io/) 和 [Browserify](http://browserify.org/) 这样的 CommonJS 模块打包器。

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

如果你以前使用 Flux，那么你只需要注意一个重要的区别。Redux 没有 Dispatcher 且不支持多个 store。相反，只有一个单一的 store 和一个根级的 reduce 函数（reducer）。随着应用不断变大，你应该把根级的 reducer 拆成多个小的 reducers，分别独立地操作 state 树的不同部分，而不是添加新的 stores。这就像一个 React 应用只有一个根级的组件，这个根组件又由很多小组件构成。

用这个架构开发计数器有点杀鸡用牛刀，但它的美在于做复杂应用和庞大系统时优秀的扩展能力。由于它可以用 action 追溯应用的每一次修改，因此才有强大的开发工具。如录制用户会话并回放所有 action 来重现它。

### Redux 作者教你学

[Redux 入门](https://egghead.io/series/getting-started-with-redux) 是由 Redux 作者 Dan Abramov 讲述的包含 30 个视频的课程。它涵盖了本文档的“基础”部分，同时还有不可变（immutability）、测试、Redux 最佳实践、搭配 React 使用的讲解。**这个课程将永久免费。**

还等什么？

#### [开始观看 30 个免费视频！](https://egghead.io/series/getting-started-with-redux)

### 文档

* [介绍](http://camsong.github.io/redux-in-chinese//docs/introduction/index.html)
* [基础](http://camsong.github.io/redux-in-chinese//docs/basics/index.html)
* [高级](http://camsong.github.io/redux-in-chinese//docs/advanced/index.html)
* [技巧](http://camsong.github.io/redux-in-chinese//docs/recipes/index.html)
* [常见问题](http://camsong.github.io/redux-in-chinese//docs/FAQ.html)
* [排错](http://camsong.github.io/redux-in-chinese//docs/Troubleshooting.html)
* [词汇表](http://camsong.github.io/redux-in-chinese//docs/Glossary.html)
* [API 文档](http://camsong.github.io/redux-in-chinese//docs/api/index.html)

### 示例

* [原生 Counter](http://camsong.github.io/redux-in-chinese/docs/introduction/Examples.html#counter-vanilla) ([source](https://github.com/rackt/redux/tree/master/examples/counter-vanilla))
* [Counter](http://camsong.github.io/redux-in-chinese/docs/introduction/Examples.html#counter) ([source](https://github.com/rackt/redux/tree/master/examples/counter))
* [Todos](http://camsong.github.io/redux-in-chinese/docs/introduction/Examples.html#todos) ([source](https://github.com/rackt/redux/tree/master/examples/todos))
* [可撤销的 Todos](http://camsong.github.io/redux-in-chinese/docs/introduction/Examples.html#todos-with-undo) ([source](https://github.com/rackt/redux/tree/master/examples/todos-with-undo))
* [TodoMVC](http://camsong.github.io/redux-in-chinese/docs/introduction/Examples.html#todomvc) ([source](https://github.com/rackt/redux/tree/master/examples/todomvc))
* [购物车](http://camsong.github.io/redux-in-chinese/docs/introduction/Examples.html#shopping-cart) ([source](https://github.com/rackt/redux/tree/master/examples/shopping-cart))
* [Tree View](http://camsong.github.io/redux-in-chinese/docs/introduction/Examples.html#tree-view) ([source](https://github.com/rackt/redux/tree/master/examples/tree-view))
* [异步](http://camsong.github.io/redux-in-chinese/docs/introduction/Examples.html#async) ([source](https://github.com/rackt/redux/tree/master/examples/async))
* [Universal](http://camsong.github.io/redux-in-chinese/docs/introduction/Examples.html#universal) ([source](https://github.com/rackt/redux/tree/master/examples/universal))
* [Real World](http://camsong.github.io/redux-in-chinese/docs/introduction/Examples.html#real-world) ([source](https://github.com/rackt/redux/tree/master/examples/real-world))

如果你是 NPM 新手，创建和运行一个新的项目有难度，或者不知道上面的代码应该放到哪里使用，请下载 [simplest-redux-example](https://github.com/jackielii/simplest-redux-example) 这个示例，它是一个集成了 React、Browserify 和 Redux 的最简化的示例项目。

### 交流

打开 Discord，加入 [Reactiflux](http://reactiflux.com/) 中的 **#redux** 频道。

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

### 作者列表

> 定期更新，谢谢各位辛勤贡献

* [Cam Song 会影@camsong](https://github.com/camsong)
* [Jovey Zheng@jovey-zheng](https://github.com/jovey-zheng)
* [Pandazki@pandazki](https://github.com/pandazki)
* [Shangbin Yang@rccoder](https://github.com/rccoder)
* [Doray Hong@dorayx](https://github.com/dorayx)
* [Yuwei Wang@yuweiw823](https://github.com/yuweiw823)
* [Yudong@hashtree](https://github.com/hashtree)
* [Arcthur@arcthur](https://github.com/arcthur)
* [Desen Meng@demohi](https://github.com/demohi)
* [Zhe Zhang@zhe](https://github.com/zhe)
* [alcat2008](https://github.com/alcat2008)
* [Frozenme](https://github.com/Frozenme)
* [姜杨军@Yogi-Jiang](https://github.com/Yogi-Jiang)
* [Byron Bai@happybai](https://github.com/happybai)
* [Guo Cheng@guocheng](https://github.com/guocheng)
* [omytea](https://github.com/omytea)
* [Fred Wang](https://github.com/namelos)
* [Amo Wu](https://github.com/amowu)
* [C. T. Lin](https://github.com/chentsulin)
* [钱利江](https://github.com/timqian)
* [云谦](https://github.com/sorrycc)
* [denvey](https://github.com/denvey)
* [三点](https://github.com/zousandian)
* [Eric Wong](https://github.com/ele828)
* [Owen Yang](https://github.com/owenyang0)
* [Cai Huanyu](https://github.com/Darmody)

**本文档翻译流程符合 [ETC 翻译规范](https://github.com/react-guide/ETC)，欢迎你来一起完善**

## Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="graphs/contributors"><img src="https://opencollective.com/redux-in-chinese/contributors.svg?width=890&button=false" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/redux-in-chinese#backer)]

<a href="https://opencollective.com/redux-in-chinese#backers" target="_blank"><img src="https://opencollective.com/redux-in-chinese/backers.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/redux-in-chinese#sponsor)]

<a href="https://opencollective.com/redux-in-chinese/sponsor/0/website" target="_blank"><img src="https://opencollective.com/redux-in-chinese/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/redux-in-chinese/sponsor/1/website" target="_blank"><img src="https://opencollective.com/redux-in-chinese/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/redux-in-chinese/sponsor/2/website" target="_blank"><img src="https://opencollective.com/redux-in-chinese/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/redux-in-chinese/sponsor/3/website" target="_blank"><img src="https://opencollective.com/redux-in-chinese/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/redux-in-chinese/sponsor/4/website" target="_blank"><img src="https://opencollective.com/redux-in-chinese/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/redux-in-chinese/sponsor/5/website" target="_blank"><img src="https://opencollective.com/redux-in-chinese/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/redux-in-chinese/sponsor/6/website" target="_blank"><img src="https://opencollective.com/redux-in-chinese/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/redux-in-chinese/sponsor/7/website" target="_blank"><img src="https://opencollective.com/redux-in-chinese/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/redux-in-chinese/sponsor/8/website" target="_blank"><img src="https://opencollective.com/redux-in-chinese/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/redux-in-chinese/sponsor/9/website" target="_blank"><img src="https://opencollective.com/redux-in-chinese/sponsor/9/avatar.svg"></a>


