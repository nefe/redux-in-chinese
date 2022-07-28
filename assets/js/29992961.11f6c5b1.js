"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[9150],{3905:function(e,r,n){n.d(r,{Zo:function(){return s},kt:function(){return m}});var t=n(7294);function c(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function u(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function o(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?u(Object(n),!0).forEach((function(r){c(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):u(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function a(e,r){if(null==e)return{};var n,t,c=function(e,r){if(null==e)return{};var n,t,c={},u=Object.keys(e);for(t=0;t<u.length;t++)n=u[t],r.indexOf(n)>=0||(c[n]=e[n]);return c}(e,r);if(Object.getOwnPropertySymbols){var u=Object.getOwnPropertySymbols(e);for(t=0;t<u.length;t++)n=u[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(c[n]=e[n])}return c}var d=t.createContext({}),i=function(e){var r=t.useContext(d),n=r;return e&&(n="function"==typeof e?e(r):o(o({},r),e)),n},s=function(e){var r=i(e.components);return t.createElement(d.Provider,{value:r},e.children)},l={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},p=t.forwardRef((function(e,r){var n=e.components,c=e.mdxType,u=e.originalType,d=e.parentName,s=a(e,["components","mdxType","originalType","parentName"]),p=i(n),m=c,k=p["".concat(d,".").concat(m)]||p[m]||l[m]||u;return n?t.createElement(k,o(o({ref:r},s),{},{components:n})):t.createElement(k,o({ref:r},s))}));function m(e,r){var n=arguments,c=r&&r.mdxType;if("string"==typeof e||c){var u=n.length,o=new Array(u);o[0]=p;var a={};for(var d in r)hasOwnProperty.call(r,d)&&(a[d]=r[d]);a.originalType=e,a.mdxType="string"==typeof e?e:c,o[1]=a;for(var i=2;i<u;i++)o[i]=n[i];return t.createElement.apply(null,o)}return t.createElement.apply(null,n)}p.displayName="MDXCreateElement"},8430:function(e,r,n){n.r(r),n.d(r,{assets:function(){return s},contentTitle:function(){return d},default:function(){return m},frontMatter:function(){return a},metadata:function(){return i},toc:function(){return l}});var t=n(7462),c=n(3366),u=(n(7294),n(3905)),o=["components"],a={id:"code-splitting",title:"\u4ee3\u7801\u5206\u5272",hide_title:!1},d="\u4ee3\u7801\u5206\u5272",i={unversionedId:"usage/code-splitting",id:"usage/code-splitting",title:"\u4ee3\u7801\u5206\u5272",description:"\u5728\u5927\u578b Web \u5e94\u7528\u7a0b\u5e8f\u4e2d\uff0c\u901a\u5e38\u9700\u8981\u5c06\u5e94\u7528\u7a0b\u5e8f\u4ee3\u7801\u62c6\u5206\u4e3a\u591a\u4e2a\u53ef\u4ee5\u6309\u9700\u52a0\u8f7d\u7684 JS \u5305\u3002 \u8fd9\u79cd\u79f0\u4e3a\u201c\u4ee3\u7801\u5206\u5272\u201d\u7684\u7b56\u7565\u901a\u8fc7\u51cf\u5c0f\u521d\u6b21\u52a0\u8f7d\u65f6\u7684 JS \u7684\u5305\u7684\u5927\u5c0f\uff0c\u6765\u63d0\u9ad8\u5e94\u7528\u7a0b\u5e8f\u7684\u6027\u80fd\u3002",source:"@site/../docs/usage/CodeSplitting.md",sourceDirName:"usage",slug:"/usage/code-splitting",permalink:"/usage/code-splitting",draft:!1,tags:[],version:"current",frontMatter:{id:"code-splitting",title:"\u4ee3\u7801\u5206\u5272",hide_title:!1},sidebar:"docs",previous:{title:"Configuring Your Store",permalink:"/usage/configuring-your-store"},next:{title:"\u670d\u52a1\u7aef\u6e32\u67d3",permalink:"/usage/server-rendering"}},s={},l=[{value:"\u57fa\u672c\u539f\u5219",id:"\u57fa\u672c\u539f\u5219",level:2},{value:"\u4f7f\u7528 <code>replaceReducer</code>",id:"\u4f7f\u7528-replacereducer",level:3},{value:"Reducer \u6ce8\u5165",id:"reducer-\u6ce8\u5165",level:2},{value:"\u5b9a\u4e49\u4e00\u4e2a <code>injectReducer</code> \u51fd\u6570",id:"\u5b9a\u4e49\u4e00\u4e2a-injectreducer-\u51fd\u6570",level:3},{value:"\u4f7f\u7528 &#39;Reducer Manager&#39;",id:"\u4f7f\u7528-reducer-manager",level:3},{value:"\u5e93\u548c\u6846\u67b6",id:"\u5e93\u548c\u6846\u67b6",level:2}],p={toc:l};function m(e){var r=e.components,n=(0,c.Z)(e,o);return(0,u.kt)("wrapper",(0,t.Z)({},p,n,{components:r,mdxType:"MDXLayout"}),(0,u.kt)("h1",{id:"\u4ee3\u7801\u5206\u5272"},"\u4ee3\u7801\u5206\u5272"),(0,u.kt)("p",null,"\u5728\u5927\u578b Web \u5e94\u7528\u7a0b\u5e8f\u4e2d\uff0c\u901a\u5e38\u9700\u8981\u5c06\u5e94\u7528\u7a0b\u5e8f\u4ee3\u7801\u62c6\u5206\u4e3a\u591a\u4e2a\u53ef\u4ee5\u6309\u9700\u52a0\u8f7d\u7684 JS \u5305\u3002 \u8fd9\u79cd\u79f0\u4e3a\u201c\u4ee3\u7801\u5206\u5272\u201d\u7684\u7b56\u7565\u901a\u8fc7\u51cf\u5c0f\u521d\u6b21\u52a0\u8f7d\u65f6\u7684 JS \u7684\u5305\u7684\u5927\u5c0f\uff0c\u6765\u63d0\u9ad8\u5e94\u7528\u7a0b\u5e8f\u7684\u6027\u80fd\u3002"),(0,u.kt)("p",null,"\u8981\u4f7f\u7528 Redux \u8fdb\u884c\u4ee3\u7801\u62c6\u5206\uff0c\u6211\u4eec\u5e0c\u671b\u80fd\u591f\u5c06 reducer \u52a8\u6001\u6dfb\u52a0\u5230 store\u3002 \u4f46\u662f\uff0cRedux \u5b9e\u9645\u4e0a\u53ea\u6709\u4e00\u4e2a root reducer \u51fd\u6570\u3002 \u8fd9\u4e2a root reducer \u901a\u5e38\u662f\u5728\u521d\u59cb\u5316\u5e94\u7528\u7a0b\u5e8f\u65f6\u901a\u8fc7\u8c03\u7528 ",(0,u.kt)("inlineCode",{parentName:"p"},"combineReducers\uff08\uff09")," \u6216\u7c7b\u4f3c\u51fd\u6570\u751f\u6210\u7684\u3002 \u4e3a\u4e86\u52a8\u6001\u6dfb\u52a0\u66f4\u591a\u7684 reducer\uff0c\u6211\u4eec\u9700\u8981\u518d\u6b21\u8c03\u7528\u8be5\u51fd\u6570\u6765\u91cd\u65b0\u751f\u6210 root reducer\u3002 \u4e0b\u9762\uff0c\u6211\u4eec\u5c06\u8ba8\u8bba\u53ef\u4ee5\u89e3\u51b3\u6b64\u95ee\u9898\u7684\u4e00\u4e9b\u65b9\u6cd5\uff0c\u5e76\u63a8\u8350\u63d0\u4f9b\u6b64\u529f\u80fd\u7684\u4e24\u4e2a\u5e93\u3002"),(0,u.kt)("h2",{id:"\u57fa\u672c\u539f\u5219"},"\u57fa\u672c\u539f\u5219"),(0,u.kt)("h3",{id:"\u4f7f\u7528-replacereducer"},"\u4f7f\u7528 ",(0,u.kt)("inlineCode",{parentName:"h3"},"replaceReducer")),(0,u.kt)("p",null,"Redux store \u66b4\u9732\u51fa\u4e00\u4e2a ",(0,u.kt)("inlineCode",{parentName:"p"},"replaceReducer")," \u51fd\u6570\uff0c\u8be5\u51fd\u6570\u4f7f\u7528\u65b0\u7684 root reducer \u66ff\u4ee3\u5f53\u524d\u6d3b\u52a8\u7684 root reducer\u3002\u8c03\u7528\u8be5\u51fd\u6570\u5c06\u66ff\u6362\u5185\u90e8 reducer \u7684\u5f15\u7528\uff0c\u5e76 dispatch \u4e00\u4e2a action \u4ee5\u521d\u59cb\u5316\u65b0\u52a0\u5165\u7684 reducer\uff1a"),(0,u.kt)("pre",null,(0,u.kt)("code",{parentName:"pre",className:"language-js"},"const newRootReducer = combineReducers({\n  existingSlice: existingSliceReducer,\n  newSlice: newSliceReducer\n})\n\nstore.replaceReducer(newRootReducer)\n")),(0,u.kt)("h2",{id:"reducer-\u6ce8\u5165"},"Reducer \u6ce8\u5165"),(0,u.kt)("h3",{id:"\u5b9a\u4e49\u4e00\u4e2a-injectreducer-\u51fd\u6570"},"\u5b9a\u4e49\u4e00\u4e2a ",(0,u.kt)("inlineCode",{parentName:"h3"},"injectReducer")," \u51fd\u6570"),(0,u.kt)("p",null,"\u6211\u4eec\u53ef\u80fd\u60f3\u4ece\u5e94\u7528\u7a0b\u5e8f\u7684\u4efb\u4f55\u5730\u65b9\u8c03\u7528 ",(0,u.kt)("inlineCode",{parentName:"p"},"store.replaceReducer\uff08\uff09"),"\u3002\u56e0\u6b64\uff0c\u5b83\u4f7f\u6211\u4eec\u53ef\u4ee5\u5f88\u8f7b\u6613\u7684\u5b9a\u4e49\u4e00\u4e2a\u53ef\u91cd\u7528\u7684 ",(0,u.kt)("inlineCode",{parentName:"p"},"injectReducer()")," \u51fd\u6570\u3002\u8be5\u51fd\u6570\u80fd\u591f\u4fdd\u6301\u5bf9\u6240\u6709\u73b0\u6709 slice reducer \u7684\u5f15\u7528\uff0c\u5e76\u53ef\u5c06\u65b0 reducer \u9644\u52a0\u5230 store \u5b9e\u4f8b\u3002"),(0,u.kt)("pre",null,(0,u.kt)("code",{parentName:"pre",className:"language-js"},"import { createStore } from 'redux'\n\n// \u5b9a\u4e49\u5c06\u59cb\u7ec8\u5b58\u5728\u4e8e\u5e94\u7528\u7a0b\u5e8f\u4e2d\u7684 Reducer\nconst staticReducers = {\n  users: usersReducer,\n  posts: postsReducer\n}\n\n// Configure the store\nexport default function configureStore(initialState) {\n  const store = createStore(createReducer(), initialState)\n\n  // \u6dfb\u52a0\u4e00\u4e2a\u5bf9\u8c61\u4ee5\u8ddf\u8e2a\u5df2\u6ce8\u518c\u7684\u5f02\u6b65 Reducer\n  store.asyncReducers = {}\n\n  //\u521b\u5efa\u6ce8\u5165 reducer \u51fd\u6570\n  // \u6b64\u51fd\u6570\u6dfb\u52a0 async reducer\uff0c\u5e76\u521b\u5efa\u4e00\u4e2a\u65b0\u7684\u7ec4\u5408 reducer\n  store.injectReducer = (key, asyncReducer) => {\n    store.asyncReducers[key] = asyncReducer\n    store.replaceReducer(createReducer(this.asyncReducers))\n  }\n\n  // \u8fd4\u56de\u4fee\u6539\u540e\u7684 store\n  return store\n}\n\nfunction createReducer(asyncReducers) {\n  return combineReducers({\n    ...staticReducers,\n    ...asyncReducers\n  })\n}\n")),(0,u.kt)("p",null,"\u73b0\u5728\uff0c\u53ea\u9700\u8981\u8c03\u7528 ",(0,u.kt)("inlineCode",{parentName:"p"},"store.injectReducer")," \u51fd\u6570\u5373\u53ef\u5411 store \u6dfb\u52a0\u65b0\u7684 reducer\u3002"),(0,u.kt)("h3",{id:"\u4f7f\u7528-reducer-manager"},"\u4f7f\u7528 'Reducer Manager'"),(0,u.kt)("p",null,"\u53e6\u4e00\u79cd\u65b9\u6cd5\u662f\u521b\u5efa\u4e00\u4e2a 'Reducer Manager' \u5bf9\u8c61\uff0c\u5b83\u8ddf\u8e2a\u6240\u6709\u5df2\u6ce8\u518c\u7684 Reducer \u5e76\u66b4\u9732\u51fa ",(0,u.kt)("inlineCode",{parentName:"p"},"reduce()")," \u51fd\u6570\u3002 \u8bf7\u53c2\u8003\u4ee5\u4e0b\u793a\u4f8b\uff1a"),(0,u.kt)("pre",null,(0,u.kt)("code",{parentName:"pre",className:"language-js"},"export function createReducerManager(initialReducers) {\n  // \u521b\u5efa\u4e00\u4e2a\u5c06 key \u6620\u5c04\u5230 reducer \u7684\u5bf9\u8c61\n  const reducers = { ...initialReducers }\n\n  // \u521b\u5efa\u521d\u59cb CombinedReducer\n  let combinedReducer = combineReducers(reducers)\n\n  // \u5b58\u50a8 key \u7684\u6570\u7ec4\uff0c\u7528\u4e8e\u5220\u9664 reducer \u65f6\u5220\u9664 state \u4e2d\u5bf9\u5e94\u7684\u6570\u636e\n  const keysToRemove = []\n\n  return {\n    getReducerMap: () => reducers,\n\n    // \u8fd9\u4e2a root reducer \u51fd\u6570\u5728\u8be5\u5bf9\u8c61\u4e2d\u66b4\u9732\u51fa\n    // \u5e76\u5c06\u4f20\u9012\u7ed9 store\n    reduce: (state, action) => {\n      // \u5982\u679c\u5df2\u5220\u9664\u4efb\u4f55 reducer\uff0c\u8bf7\u5148\u6e05\u7406 state \u4e2d\u5bf9\u5e94\u7684\u503c\n      if (keysToRemove.length > 0) {\n        state = { ...state }\n        for (let key of keysToRemove) {\n          delete state[key]\n        }\n        keysToRemove = []\n      }\n\n      // Delegate to the combined reducer\n      return combinedReducer(state, action)\n    },\n\n    // \u6dfb\u52a0\u5177\u6709\u6307\u5b9a key \u7684\u65b0 reducer\n    add: (key, reducer) => {\n      if (!key || reducers[key]) {\n        return\n      }\n\n      // \u5c06 reducer \u6dfb\u52a0\u5230 reducer \u6620\u5c04\u4e2d\n      reducers[key] = reducer\n\n      // \u751f\u6210\u65b0\u7684 combined reducer\n      combinedReducer = combineReducers(reducers)\n    },\n\n    // \u4f7f\u7528\u6307\u5b9a\u7684 key \u5220\u9664 reducer\n    remove: key => {\n      if (!key || !reducers[key]) {\n        return\n      }\n\n      // \u4ece reducer \u6620\u5c04\u4e2d\u5220\u9664\u5b83\n      delete reducers[key]\n\n      // \u5c06 key \u6dfb\u52a0\u5230\u8981\u6e05\u7406\u7684 key \u5217\u8868\u4e2d\n      keysToRemove.push(key)\n\n      // \u751f\u6210\u65b0\u7684 combined reducer\n      combinedReducer = combineReducers(reducers)\n    }\n  }\n}\n\nconst staticReducers = {\n  users: usersReducer,\n  posts: postsReducer\n}\n\nexport function configureStore(initialState) {\n  const reducerManager = createReducerManager(staticReducers)\n\n  // \u4f7f\u7528 root reducer \u51fd\u6570\u521b\u5efa\u4e00\u4e2a store\uff0c\u8be5 root reducer \u51fd\u6570\u662f manager \u66b4\u9732\u51fa\u7684\u51fd\u6570\u3002\n  const store = createStore(reducerManager.reduce, initialState)\n\n  // \u53ef\u9009\uff1a\u5c06 reducer manager \u6dfb\u52a0\u5230 store \u4e0a\uff0c\u4ee5\u4fbf\u4e8e\u8bbf\u95ee\n  store.reducerManager = reducerManager\n}\n")),(0,u.kt)("p",null,"\u8981\u6dfb\u52a0\u65b0\u7684 reducer\uff0c\u73b0\u5728\u53ef\u4ee5\u8c03\u7528 ",(0,u.kt)("inlineCode",{parentName:"p"},'store.reducerManager.add("asyncState", asyncReducer)'),"\u3002"),(0,u.kt)("p",null,"\u8981\u5220\u9664 reducer \u73b0\u5728\u53ef\u4ee5\u8c03\u7528 ",(0,u.kt)("inlineCode",{parentName:"p"},'store.reducerManager.remove("asyncState")'),"\u3002"),(0,u.kt)("h2",{id:"\u5e93\u548c\u6846\u67b6"},"\u5e93\u548c\u6846\u67b6"),(0,u.kt)("p",null,"\u4ee5\u4e0b\u6709\u4e00\u4e9b\u4f18\u79c0\u7684\u5e93\u53ef\u4ee5\u5e2e\u52a9\u60a8\u81ea\u52a8\u6dfb\u52a0\u4e0a\u8ff0\u529f\u80fd\uff1a"),(0,u.kt)("ul",null,(0,u.kt)("li",{parentName:"ul"},(0,u.kt)("a",{parentName:"li",href:"https://github.com/Microsoft/redux-dynamic-modules"},(0,u.kt)("inlineCode",{parentName:"a"},"redux-dynamic-modules")),":\n\u8be5\u5e93\u5f15\u5165\u4e86\u201cRedux Module\u201d\u7684\u6982\u5ff5\uff0c\u5b83\u662f\u4e00\u7ec4\u5e94\u8be5\u52a8\u6001\u52a0\u8f7d\u7684 Redux \u90e8\u4ef6\uff08Reducer\uff0cmiddleware\uff09\u3002\u5b83\u8fd8\u66b4\u9732\u51fa\u4e00\u4e2a React \u9ad8\u9636\u7ec4\u4ef6\u7528\u6765\u5728\u5e94\u7528\u7ec4\u4ef6\u52a0\u8f7d\u540e\u52a0\u8f7d Module\u3002 \u6b64\u5916\uff0c\u5b83\u8fd8\u4e0e\u8bf8\u5982 ",(0,u.kt)("inlineCode",{parentName:"li"},"redux-thunk")," \u548c ",(0,u.kt)("inlineCode",{parentName:"li"},"redux-saga")," \u4e4b\u7c7b\u7684\u5e93\u96c6\u6210\uff0c\u4ee5\u4f7f\u8fd9\u4e9b\u5e93\u53ef\u4ee5\u52a8\u6001\u52a0\u8f7d\u4ed6\u4eec\u7684\u90e8\u4ef6\uff08thunk\uff0csagas\uff09\u3002"),(0,u.kt)("li",{parentName:"ul"},(0,u.kt)("a",{parentName:"li",href:"https://github.com/markerikson/redux-ecosystem-links/blob/master/reducers.md#dynamic-reducer-injection"},"Redux \u751f\u6001\u7cfb\u7edf\u94fe\u63a5: Reducer - Reducer \u52a8\u6001\u6ce8\u5165"))))}m.isMDXComponent=!0}}]);