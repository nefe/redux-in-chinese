"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[3666],{3905:function(e,t,r){r.d(t,{Zo:function(){return s},kt:function(){return m}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var c=n.createContext({}),l=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},s=function(e){var t=l(e.components);return n.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,s=p(e,["components","mdxType","originalType","parentName"]),d=l(r),m=a,f=d["".concat(c,".").concat(m)]||d[m]||u[m]||o;return r?n.createElement(f,i(i({ref:t},s),{},{components:r})):n.createElement(f,i({ref:t},s))}));function m(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=d;var p={};for(var c in t)hasOwnProperty.call(t,c)&&(p[c]=t[c]);p.originalType=e,p.mdxType="string"==typeof e?e:a,i[1]=p;for(var l=2;l<o;l++)i[l]=r[l];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},7204:function(e,t,r){r.r(t),r.d(t,{assets:function(){return s},contentTitle:function(){return c},default:function(){return m},frontMatter:function(){return p},metadata:function(){return l},toc:function(){return u}});var n=r(7462),a=r(3366),o=(r(7294),r(3905)),i=["components"],p={id:"createstore",title:"createStore",hide_title:!0,description:"API > createStore: creating a core Redux store"},c=void 0,l={unversionedId:"api/createstore",id:"api/createstore",title:"createStore",description:"API > createStore: creating a core Redux store",source:"@site/../docs/api/createStore.md",sourceDirName:"api",slug:"/api/createstore",permalink:"/api/createstore",draft:!1,tags:[],version:"current",frontMatter:{id:"createstore",title:"createStore",hide_title:!0,description:"API > createStore: creating a core Redux store"},sidebar:"docs",previous:{title:"API \u53c2\u8003",permalink:"/api/api-reference"},next:{title:"Store",permalink:"/api/store"}},s={},u=[{value:"\u53c2\u6570",id:"\u53c2\u6570",level:4},{value:"\u8fd4\u56de\u503c",id:"\u8fd4\u56de\u503c",level:4},{value:"\u793a\u4f8b",id:"\u793a\u4f8b",level:4},{value:"\u5c0f\u8d34\u58eb",id:"\u5c0f\u8d34\u58eb",level:4}],d={toc:u};function m(e){var t=e.components,r=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"createstorereducer-preloadedstate-enhancer"},(0,o.kt)("inlineCode",{parentName:"h1"},"createStore(reducer, [preloadedState], [enhancer])")),(0,o.kt)("p",null,"\u521b\u5efa\u4e00\u4e2a\u5305\u542b\u7a0b\u5e8f\u5b8c\u6574 state \u6811\u7684 Redux ",(0,o.kt)("a",{parentName:"p",href:"/api/store"},"store")," \u3002\n\u5e94\u7528\u4e2d\u5e94\u6709\u4e14\u4ec5\u6709\u4e00\u4e2a store\u3002"),(0,o.kt)("h4",{id:"\u53c2\u6570"},"\u53c2\u6570"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("inlineCode",{parentName:"p"},"reducer")," ",(0,o.kt)("em",{parentName:"p"},"(Function)"),": \u63a5\u6536\u4e24\u4e2a\u53c2\u6570\uff0c\u5206\u522b\u662f\u5f53\u524d\u7684 state \u6811\u548c\u8981\u5904\u7406\u7684 ",(0,o.kt)("a",{parentName:"p",href:"/understanding/thinking-in-redux/glossary#action"},"action"),"\uff0c\u8fd4\u56de\u65b0\u7684 ",(0,o.kt)("a",{parentName:"p",href:"/understanding/thinking-in-redux/glossary#state"},"state \u6811"),"\u3002")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},"[",(0,o.kt)("inlineCode",{parentName:"p"},"preloadedState"),"]"," ",(0,o.kt)("em",{parentName:"p"},"(any)"),": \u521d\u59cb\u65f6\u7684 state\u3002\u4f60\u53ef\u4ee5\u51b3\u5b9a\u662f\u5426\u628a\u670d\u52a1\u7aef\u4f20\u6765\u7684 state \u6c34\u5408\uff08hydrate\uff09\u540e\u4f20\u7ed9\u5b83\uff0c\u6216\u8005\u4ece\u4e4b\u524d\u4fdd\u5b58\u7684\u7528\u6237\u4f1a\u8bdd\u4e2d\u6062\u590d\u4e00\u4e2a\u4f20\u7ed9\u5b83\u3002\u5982\u679c\u4f60\u4f7f\u7528 ",(0,o.kt)("a",{parentName:"p",href:"/api/combinereducers"},(0,o.kt)("inlineCode",{parentName:"a"},"combineReducers"))," \u521b\u5efa ",(0,o.kt)("inlineCode",{parentName:"p"},"reducer"),"\uff0c\u5b83\u5fc5\u987b\u662f\u4e00\u4e2a\u666e\u901a\u5bf9\u8c61\uff0c\u4e0e\u4f20\u5165\u7684 keys \u4fdd\u6301\u540c\u6837\u7684\u7ed3\u6784\u3002\u5426\u5219\uff0c\u4f60\u53ef\u4ee5\u81ea\u7531\u4f20\u5165\u4efb\u4f55 ",(0,o.kt)("inlineCode",{parentName:"p"},"reducer")," \u53ef\u7406\u89e3\u7684\u5185\u5bb9\u3002")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("inlineCode",{parentName:"p"},"enhancer")," ",(0,o.kt)("em",{parentName:"p"},"(Function)"),": Store enhancer\u3002\u4f60\u53ef\u4ee5\u9009\u62e9\u6307\u5b9a\u5b83\u4ee5\u4f7f\u7528\u7b2c\u4e09\u65b9\u529f\u80fd\uff0c\u5982middleware\u3001\u65f6\u95f4\u65c5\u884c\u3001\u6301\u4e45\u5316\u6765\u589e\u5f3a store\u3002Redux \u4e2d\u552f\u4e00\u5185\u7f6e\u7684 store enhander \u662f ",(0,o.kt)("a",{parentName:"p",href:"/api/applymiddleware"},(0,o.kt)("inlineCode",{parentName:"a"},"applyMiddleware()")),"\u3002"))),(0,o.kt)("h4",{id:"\u8fd4\u56de\u503c"},"\u8fd4\u56de\u503c"),(0,o.kt)("p",null,"(",(0,o.kt)("a",{parentName:"p",href:"/api/store"},(0,o.kt)("em",{parentName:"a"},(0,o.kt)("inlineCode",{parentName:"em"},"Store"))),"): \u4fdd\u5b58\u4e86\u5e94\u7528\u7a0b\u5e8f\u6240\u6709 state \u7684\u5bf9\u8c61\u3002\u6539\u53d8 state \u7684\u60df\u4e00\u65b9\u6cd5\u662f ",(0,o.kt)("a",{parentName:"p",href:"/api/store#dispatchaction"},"dispatch action"),"\u3002\u4f60\u4e5f\u53ef\u4ee5 ",(0,o.kt)("a",{parentName:"p",href:"/api/store#subscribelistener"},"subscribe")," state \u7684\u53d8\u5316\uff0c\u7136\u540e\u66f4\u65b0 UI\u3002"),(0,o.kt)("h4",{id:"\u793a\u4f8b"},"\u793a\u4f8b"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"import { createStore } from 'redux'\n\nfunction todos(state = [], action) {\n  switch (action.type) {\n    case 'ADD_TODO':\n      return state.concat([action.text])\n    default:\n      return state\n  }\n}\n\nconst store = createStore(todos, ['Use Redux'])\n\nstore.dispatch({\n  type: 'ADD_TODO',\n  text: 'Read the docs'\n})\n\nconsole.log(store.getState())\n// [ 'Use Redux', 'Read the docs' ]\n")),(0,o.kt)("h4",{id:"\u5c0f\u8d34\u58eb"},"\u5c0f\u8d34\u58eb"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"\u5e94\u7528\u4e2d\u4e0d\u8981\u521b\u5efa\u591a\u4e2a store\uff01\u76f8\u53cd\uff0c\u4f7f\u7528 ",(0,o.kt)("a",{parentName:"p",href:"/api/combinereducers"},(0,o.kt)("inlineCode",{parentName:"a"},"combineReducers"))," \u6765\u628a\u591a\u4e2a reducer \u521b\u5efa\u6210\u4e00\u4e2a\u6839 reducer\u3002")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"Redux state \u901a\u5e38\u662f\u666e\u901a JS \u5bf9\u8c61\u6216\u8005\u6570\u7ec4\u3002")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"\u5982\u679c state \u662f\u666e\u901a\u5bf9\u8c61\uff0c\u6c38\u8fdc\u4e0d\u8981\u4fee\u6539\u5b83\uff01\u4e0d\u53ef\u53d8\u66f4\u65b0\u9700\u8981\u590d\u5236\u6bcf\u4e2a\u7ea7\u522b\u7684\u6570\u636e\uff0c\u901a\u5e38\u4f7f\u7528\u5bf9\u8c61\u6269\u5c55\u8fd0\u7b97\u7b26\uff08",(0,o.kt)("inlineCode",{parentName:"p"},"return { ...state, ...newData }"),"\uff09\u3002")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"\u5bf9\u4e8e\u670d\u52a1\u7aef\u8fd0\u884c\u7684\u540c\u6784\u5e94\u7528\uff0c\u4e3a\u6bcf\u4e00\u4e2a\u8bf7\u6c42\u521b\u5efa\u4e00\u4e2a store \u5b9e\u4f8b\uff0c\u4ee5\u6b64\u8ba9 store \u76f8\u9694\u79bb\u3002dispatch \u4e00\u7cfb\u5217\u8bf7\u6c42\u6570\u636e\u7684 action \u5230 store \u5b9e\u4f8b\u4e0a\uff0c\u7b49\u5f85\u8bf7\u6c42\u5b8c\u6210\u540e\u518d\u5728\u670d\u52a1\u7aef\u6e32\u67d3\u5e94\u7528\u3002")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"\u5f53 store \u521b\u5efa\u540e\uff0cRedux \u4f1a dispatch \u4e00\u4e2a action \u5230 reducer \u4e0a\uff0c\u6765\u7528\u521d\u59cb\u7684 state \u6765\u586b\u5145 store\u3002\u4f60\u4e0d\u9700\u8981\u5904\u7406\u8fd9\u4e2a action\u3002\u4f46\u8981\u8bb0\u4f4f\uff0c\u5982\u679c\u7b2c\u4e00\u4e2a\u53c2\u6570\u4e5f\u5c31\u662f\u4f20\u5165\u7684 state \u662f ",(0,o.kt)("inlineCode",{parentName:"p"},"undefined")," \u7684\u8bdd\uff0creducer \u5e94\u8be5\u8fd4\u56de\u521d\u59cb\u7684 state \u503c\u3002")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},"\u8981\u4f7f\u7528\u591a\u4e2a store enhancer \u7684\u65f6\u5019\uff0c\u4f60\u53ef\u80fd\u9700\u8981\u4f7f\u7528 ",(0,o.kt)("a",{parentName:"p",href:"/api/compose"},"compose")))))}m.isMDXComponent=!0}}]);