"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[5327],{3905:function(e,t,n){n.d(t,{Zo:function(){return d},kt:function(){return m}});var r=n(7294);function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function u(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?u(Object(n),!0).forEach((function(t){c(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):u(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,c=function(e,t){if(null==e)return{};var n,r,c={},u=Object.keys(e);for(r=0;r<u.length;r++)n=u[r],t.indexOf(n)>=0||(c[n]=e[n]);return c}(e,t);if(Object.getOwnPropertySymbols){var u=Object.getOwnPropertySymbols(e);for(r=0;r<u.length;r++)n=u[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(c[n]=e[n])}return c}var i=r.createContext({}),s=function(e){var t=r.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},d=function(e){var t=s(e.components);return r.createElement(i.Provider,{value:t},e.children)},l={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var n=e.components,c=e.mdxType,u=e.originalType,i=e.parentName,d=o(e,["components","mdxType","originalType","parentName"]),p=s(n),m=c,f=p["".concat(i,".").concat(m)]||p[m]||l[m]||u;return n?r.createElement(f,a(a({ref:t},d),{},{components:n})):r.createElement(f,a({ref:t},d))}));function m(e,t){var n=arguments,c=t&&t.mdxType;if("string"==typeof e||c){var u=n.length,a=new Array(u);a[0]=p;var o={};for(var i in t)hasOwnProperty.call(t,i)&&(o[i]=t[i]);o.originalType=e,o.mdxType="string"==typeof e?e:c,a[1]=o;for(var s=2;s<u;s++)a[s]=n[s];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}p.displayName="MDXCreateElement"},1773:function(e,t,n){n.r(t),n.d(t,{assets:function(){return d},contentTitle:function(){return i},default:function(){return m},frontMatter:function(){return o},metadata:function(){return s},toc:function(){return l}});var r=n(7462),c=n(3366),u=(n(7294),n(3905)),a=["components"],o={id:"reusing-reducer-logic",title:"Reducer \u903b\u8f91\u590d\u7528",description:"Structuring Reducers > Reducer \u903b\u8f91\u590d\u7528: Patterns for creating reusable reducers",hide_title:!1},i="Reducer \u903b\u8f91\u590d\u7528",s={unversionedId:"usage/structuring-reducers/reusing-reducer-logic",id:"usage/structuring-reducers/reusing-reducer-logic",title:"Reducer \u903b\u8f91\u590d\u7528",description:"Structuring Reducers > Reducer \u903b\u8f91\u590d\u7528: Patterns for creating reusable reducers",source:"@site/../docs/usage/structuring-reducers/ReusingReducerLogic.md",sourceDirName:"usage/structuring-reducers",slug:"/usage/structuring-reducers/reusing-reducer-logic",permalink:"/usage/structuring-reducers/reusing-reducer-logic",draft:!1,tags:[],version:"current",frontMatter:{id:"reusing-reducer-logic",title:"Reducer \u903b\u8f91\u590d\u7528",description:"Structuring Reducers > Reducer \u903b\u8f91\u590d\u7528: Patterns for creating reusable reducers",hide_title:!1},sidebar:"docs",previous:{title:"\u7ba1\u7406\u8303\u5f0f\u5316\u6570\u636e",permalink:"/usage/structuring-reducers/updating-normalized-data"},next:{title:"\u4e0d\u53ef\u53d8\u66f4\u65b0\u6a21\u5f0f",permalink:"/usage/structuring-reducers/immutable-update-patterns"}},d={},l=[{value:"\u4f7f\u7528\u9ad8\u9636 Reducer \u6765\u5b9a\u5236\u884c\u4e3a",id:"\u4f7f\u7528\u9ad8\u9636-reducer-\u6765\u5b9a\u5236\u884c\u4e3a",level:2}],p={toc:l};function m(e){var t=e.components,n=(0,c.Z)(e,a);return(0,u.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,u.kt)("h1",{id:"reducer-\u903b\u8f91\u590d\u7528"},"Reducer \u903b\u8f91\u590d\u7528"),(0,u.kt)("p",null,"\u968f\u7740\u5e94\u7528\u7a0b\u5e8f\u7684\u589e\u957f\uff0c\u5728 reducer \u903b\u8f91\u4e2d\u5f00\u59cb\u51fa\u73b0\u4e00\u4e9b\u5e38\u89c1\u7684\u6a21\u5f0f\u3002\u4f60\u53ef\u80fd\u4f1a\u53d1\u73b0\u4e00\u90e8\u5206 reducer \u903b\u8f91\u5bf9\u4e8e\u4e0d\u540c\u7c7b\u578b\u7684\u6570\u636e\u505a\u7740\u76f8\u540c\u7684\u5de5\u4f5c\uff0c\u4f60\u60f3\u901a\u8fc7\u5bf9\u6bcf\u79cd\u6570\u636e\u7c7b\u578b\u590d\u7528\u76f8\u540c\u7684\u516c\u5171\u903b\u8f91\u6765\u51cf\u5c11\u91cd\u590d\u7684\u4ee3\u7801\u3002\u6216\u8005\uff0c\u4f60\u53ef\u80fd\u60f3\u8981\u5728 store \u4e2d\u5904\u7406\u67d0\u4e2a\u7c7b\u578b\u7684\u6570\u636e\u7684\u591a\u4e2a\u201d\u5b9e\u4f8b\u201c\u3002\u7136\u800c\uff0cRedux store \u91c7\u7528\u5168\u5c40\u7ed3\u6784\u7684\u8bbe\u8ba1\u672c\u8eab\u5c31\u662f\u4e00\u79cd\u6298\u8877\uff1a\u4f18\u70b9\u662f\u6613\u4e8e\u8ffd\u8e2a\u5e94\u7528\u7a0b\u5e8f\u7684\u6574\u4f53\u72b6\u6001\uff0c\u4f46\u662f\uff0c\u4e5f\u53ef\u80fd\u66f4\u96be\u7684\u201d\u547d\u4e2d\u201c\u90a3\u4e9b\u9700\u8981\u66f4\u65b0\u7279\u5b9a\u4e00\u90e8\u5206\u72b6\u6001\u7684 action\uff0c\u7279\u522b\u662f\u5f53\u4f60\u4f7f\u7528\u4e86 ",(0,u.kt)("inlineCode",{parentName:"p"},"combineReducers"),"\u3002"),(0,u.kt)("p",null,"\u4f8b\u5982\uff0c\u5047\u8bbe\u60f3\u5728\u7a0b\u5e8f\u4e2d\u8ffd\u8e2a\u591a\u4e2a\u8ba1\u6570\u5668\uff0c\u5206\u522b\u547d\u540d\u4e3a A\uff0cB\uff0c\u548c C\u3002\u5b9a\u4e49\u521d\u59cb\u7684 ",(0,u.kt)("inlineCode",{parentName:"p"},"counter")," reducer\uff0c\u7136\u540e\u4f7f\u7528 ",(0,u.kt)("inlineCode",{parentName:"p"},"combineReducers")," \u53bb\u8bbe\u7f6e\u72b6\u6001\u3002"),(0,u.kt)("pre",null,(0,u.kt)("code",{parentName:"pre",className:"language-javascript"},"function counter(state = 0, action) {\n  switch (action.type) {\n    case 'INCREMENT':\n      return state + 1\n    case 'DECREMENT':\n      return state - 1\n    default:\n      return state\n  }\n}\n\nconst rootReducer = combineReducers({\n  counterA: counter,\n  counterB: counter,\n  counterC: counter\n})\n")),(0,u.kt)("p",null,"\u4e0d\u5e78\u7684\u662f\uff0c\u8fd9\u6837\u8bbe\u7f6e\u6709\u4e00\u4e2a\u95ee\u9898\u3002\u56e0\u4e3a ",(0,u.kt)("inlineCode",{parentName:"p"},"combineReducers")," \u5c06\u4f1a\u4f7f\u7528\u76f8\u540c\u7684 action \u8c03\u7528\u6bcf\u4e00\u4e2a reducer\uff0c\u53d1\u9001 ",(0,u.kt)("inlineCode",{parentName:"p"},"{type: 'INCREMENT'}")," \u5b9e\u9645\u4e0a\u5c06\u4f1a\u5bfc\u81f4\u6240\u6709\u4e09\u4e2a\u8ba1\u6570\u5668\u7684\u503c\u88ab\u589e\u52a0\uff0c\u800c\u4e0d\u4ec5\u4ec5\u662f\u5176\u4e2d\u4e00\u4e2a\u3002\u6211\u4eec\u9700\u8981\u4e00\u4e9b\u65b9\u6cd5\u53bb\u5c01\u88c5 ",(0,u.kt)("inlineCode",{parentName:"p"},"counter")," \u7684\u903b\u8f91\uff0c\u4ee5\u6b64\u6765\u4fdd\u8bc1\u53ea\u6709\u6211\u4eec\u5173\u5fc3\u7684\u8ba1\u6570\u5668\u88ab\u66f4\u65b0\u3002"),(0,u.kt)("h2",{id:"\u4f7f\u7528\u9ad8\u9636-reducer-\u6765\u5b9a\u5236\u884c\u4e3a"},"\u4f7f\u7528\u9ad8\u9636 Reducer \u6765\u5b9a\u5236\u884c\u4e3a"),(0,u.kt)("p",null,"\u6b63\u5982\u5728 ",(0,u.kt)("a",{parentName:"p",href:"/usage/structuring-reducers/splitting-reducer-logic"},"Reducer \u903b\u8f91\u62c6\u5206")," \u5b9a\u4e49\u7684\u90a3\u6837\uff0c\u9ad8\u9636 reducer \u662f\u4e00\u4e2a\u63a5\u6536 reducer \u51fd\u6570\u4f5c\u4e3a\u53c2\u6570\uff0c\u5e76\u8fd4\u56de\u65b0\u7684 reducer \u51fd\u6570\u7684\u51fd\u6570\u3002\u5b83\u4e5f\u53ef\u4ee5\u88ab\u770b\u4f5c\u6210\u4e00\u4e2a\u201creducer \u5de5\u5382\u201d\u3002",(0,u.kt)("inlineCode",{parentName:"p"},"combineReducers")," \u5c31\u662f\u4e00\u4e2a\u9ad8\u9636 reduce \u7684\u4f8b\u5b50\u3002\u6211\u4eec\u53ef\u4ee5\u4f7f\u7528\u8fd9\u79cd\u6a21\u5f0f\u6765\u521b\u5efa\u7279\u5b9a\u7248\u672c\u7684 reducer \u51fd\u6570\uff0c\u6bcf\u4e2a\u7248\u672c\u53ea\u54cd\u5e94\u7279\u5b9a\u7684 action\u3002"),(0,u.kt)("p",null,"\u521b\u5efa\u7279\u5b9a\u7684 reducer \u6709\u4e24\u79cd\u6700\u5e38\u89c1\u7684\u65b9\u5f0f\uff0c\u4e00\u4e2a\u662f\u4f7f\u7528\u7ed9\u5b9a\u7684\u524d\u7f00\u6216\u8005\u540e\u7f00\u751f\u6210\u65b0\u7684 action \u5e38\u91cf\uff0c\u53e6\u4e00\u4e2a\u662f\u5728 action \u5bf9\u8c61\u4e0a\u9644\u52a0\u989d\u5916\u7684\u4fe1\u606f\u3002\u4e0b\u9762\u662f\u5b83\u4eec\u5927\u6982\u7684\u6837\u5b50\uff1a"),(0,u.kt)("pre",null,(0,u.kt)("code",{parentName:"pre",className:"language-javascript"},"function createCounterWithNamedType(counterName = '') {\n  return function counter(state = 0, action) {\n    switch (action.type) {\n      case `INCREMENT_${counterName}`:\n        return state + 1\n      case `DECREMENT_${counterName}`:\n        return state - 1\n      default:\n        return state\n    }\n  }\n}\n\nfunction createCounterWithNameData(counterName = '') {\n  return function counter(state = 0, action) {\n    const { name } = action\n    if (name !== counterName) return state\n\n    switch (action.type) {\n      case `INCREMENT`:\n        return state + 1\n      case `DECREMENT`:\n        return state - 1\n      default:\n        return state\n    }\n  }\n}\n")),(0,u.kt)("p",null,"\u73b0\u5728\u6211\u4eec\u5e94\u8be5\u53ef\u4ee5\u4f7f\u7528\u5b83\u4eec\u4efb\u4f55\u4e00\u4e2a\u53bb\u751f\u6210\u6211\u4eec\u7279\u5b9a\u7684\u8ba1\u6570\u5668 reducer\uff0c\u7136\u540e\u53d1\u9001 action\uff0c\u5e76\u53ea\u4f1a\u5f71\u54cd\u5173\u5fc3\u7684\u90a3\u90e8\u5206\u7684 state\uff1a"),(0,u.kt)("pre",null,(0,u.kt)("code",{parentName:"pre",className:"language-javascript"},"const rootReducer = combineReducers({\n  counterA: createCounterWithNamedType('A'),\n  counterB: createCounterWithNamedType('B'),\n  counterC: createCounterWithNamedType('C')\n})\n\nstore.dispatch({ type: 'INCREMENT_B' })\nconsole.log(store.getState())\n// {counterA : 0, counterB : 1, counterC : 0}\n")),(0,u.kt)("p",null,"\u6211\u4eec\u5728\u67d0\u79cd\u7a0b\u5ea6\u4e0a\u4e5f\u53ef\u4ee5\u6539\u53d8\u8fd9\u4e2a\u65b9\u6cd5\uff0c\u521b\u5efa\u4e00\u4e2a\u66f4\u52a0\u901a\u7528\u7684\u9ad8\u9636 reducer\uff0c\u5b83\u53ef\u4ee5\u63a5\u6536\u4e00\u4e2a\u7ed9\u5b9a\u7684 reducer\uff0c\u4e00\u4e2a\u540d\u5b57\u6216\u8005\u6807\u8bc6\u7b26\uff1a"),(0,u.kt)("pre",null,(0,u.kt)("code",{parentName:"pre",className:"language-javascript"},"function counter(state = 0, action) {\n  switch (action.type) {\n    case 'INCREMENT':\n      return state + 1\n    case 'DECREMENT':\n      return state - 1\n    default:\n      return state\n  }\n}\n\nfunction createNamedWrapperReducer(reducerFunction, reducerName) {\n  return (state, action) => {\n    const { name } = action\n    const isInitializationCall = state === undefined\n    if (name !== reducerName && !isInitializationCall) return state\n\n    return reducerFunction(state, action)\n  }\n}\n\nconst rootReducer = combineReducers({\n  counterA: createNamedWrapperReducer(counter, 'A'),\n  counterB: createNamedWrapperReducer(counter, 'B'),\n  counterC: createNamedWrapperReducer(counter, 'C')\n})\n")),(0,u.kt)("p",null,"\u751a\u81f3\u8fd8\u53ef\u4ee5\u5199\u4e00\u4e2a\u901a\u7528\u7684\u9ad8\u9636 reducer \u8fc7\u6ee4\u5668\uff1a"),(0,u.kt)("pre",null,(0,u.kt)("code",{parentName:"pre",className:"language-javascript"},"function createFilteredReducer(reducerFunction, reducerPredicate) {\n  return (state, action) => {\n    const isInitializationCall = state === undefined\n    const shouldRunWrappedReducer =\n      reducerPredicate(action) || isInitializationCall\n    return shouldRunWrappedReducer ? reducerFunction(state, action) : state\n  }\n}\n\nconst rootReducer = combineReducers({\n  // \u68c0\u67e5\u540e\u7f00\n  counterA: createFilteredReducer(counter, action =>\n    action.type.endsWith('_A')\n  ),\n  // \u68c0\u67e5 action \u4e2d\u7684\u989d\u5916\u6570\u636e\n  counterB: createFilteredReducer(counter, action => action.name === 'B'),\n  // \u54cd\u5e94\u6240\u6709\u7684 'INCREMENT' action\uff0c\u4f46\u4e0d\u54cd\u5e94 'DECREMENT'\n  counterC: createFilteredReducer(\n    counter,\n    action => action.type === 'INCREMENT'\n  )\n})\n")),(0,u.kt)("p",null,"\u8fd9\u4e9b\u57fa\u672c\u7684\u6a21\u5f0f\u53ef\u4ee5\u8ba9\u4f60\u5728 UI \u5185\u5904\u7406\u4e00\u4e2a\u667a\u80fd\u8fde\u63a5\u7684 component \u7684\u591a\u4e2a\u5b9e\u4f8b\u3002\u5bf9\u4e8e\u50cf\u5206\u9875\u6216\u8005\u6392\u5e8f\u8fd9\u4e9b\u901a\u7528\u7684\u529f\u80fd\uff0c\u53ef\u4ee5\u590d\u7528\u76f8\u540c\u7684\u903b\u8f91\u3002"))}m.isMDXComponent=!0}}]);