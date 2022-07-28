"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[3898],{3905:function(t,e,n){n.d(e,{Zo:function(){return l},kt:function(){return m}});var r=n(7294);function a(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function o(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function s(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?o(Object(n),!0).forEach((function(e){a(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function p(t,e){if(null==t)return{};var n,r,a=function(t,e){if(null==t)return{};var n,r,a={},o=Object.keys(t);for(r=0;r<o.length;r++)n=o[r],e.indexOf(n)>=0||(a[n]=t[n]);return a}(t,e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(r=0;r<o.length;r++)n=o[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(a[n]=t[n])}return a}var i=r.createContext({}),c=function(t){var e=r.useContext(i),n=e;return t&&(n="function"==typeof t?t(e):s(s({},e),t)),n},l=function(t){var e=c(t.components);return r.createElement(i.Provider,{value:e},t.children)},u={inlineCode:"code",wrapper:function(t){var e=t.children;return r.createElement(r.Fragment,{},e)}},d=r.forwardRef((function(t,e){var n=t.components,a=t.mdxType,o=t.originalType,i=t.parentName,l=p(t,["components","mdxType","originalType","parentName"]),d=c(n),m=a,h=d["".concat(i,".").concat(m)]||d[m]||u[m]||o;return n?r.createElement(h,s(s({ref:e},l),{},{components:n})):r.createElement(h,s({ref:e},l))}));function m(t,e){var n=arguments,a=e&&e.mdxType;if("string"==typeof t||a){var o=n.length,s=new Array(o);s[0]=d;var p={};for(var i in e)hasOwnProperty.call(e,i)&&(p[i]=e[i]);p.originalType=t,p.mdxType="string"==typeof t?t:a,s[1]=p;for(var c=2;c<o;c++)s[c]=n[c];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},3806:function(t,e,n){n.r(e),n.d(e,{assets:function(){return l},contentTitle:function(){return i},default:function(){return m},frontMatter:function(){return p},metadata:function(){return c},toc:function(){return u}});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),s=["components"],p={id:"reducing-boilerplate",title:"\u51cf\u5c11\u6837\u677f\u4ee3\u7801",hide_title:!1},i="\u51cf\u5c11\u6837\u677f\u4ee3\u7801",c={unversionedId:"usage/reducing-boilerplate",id:"usage/reducing-boilerplate",title:"\u51cf\u5c11\u6837\u677f\u4ee3\u7801",description:"Redux \u5f88\u5927\u90e8\u5206 \u53d7\u5230 Flux \u7684\u542f\u53d1\uff0c\u800c\u6700\u5e38\u89c1\u7684\u5173\u4e8e Flux \u7684\u62b1\u6028\u662f\u5fc5\u987b\u5199\u4e00\u5927\u5806\u7684\u6837\u677f\u4ee3\u7801\u3002\u5728\u8fd9\u7ae0\u4e2d\uff0c\u6211\u4eec\u5c06\u8003\u8651 Redux \u5982\u4f55\u6839\u636e\u4e2a\u4eba\u98ce\u683c\uff0c\u56e2\u961f\u504f\u597d\uff0c\u957f\u671f\u53ef\u7ef4\u62a4\u6027\u7b49\u81ea\u7531\u51b3\u5b9a\u4ee3\u7801\u7684\u7e41\u590d\u7a0b\u5ea6\u3002",source:"@site/../docs/usage/ReducingBoilerplate.md",sourceDirName:"usage",slug:"/usage/reducing-boilerplate",permalink:"/usage/reducing-boilerplate",draft:!1,tags:[],version:"current",frontMatter:{id:"reducing-boilerplate",title:"\u51cf\u5c11\u6837\u677f\u4ee3\u7801",hide_title:!1},sidebar:"docs",previous:{title:"\u521d\u59cb\u5316 State",permalink:"/usage/structuring-reducers/initializing-state"},next:{title:"Deriving Data with Selectors",permalink:"/usage/deriving-data-selectors"}},l={},u=[{value:"Actions",id:"actions",level:2},{value:"Action Creators",id:"action-creators",level:2},{value:"<code>actionCreators.js</code>",id:"actioncreatorsjs",level:4},{value:"<code>AddTodo.js</code>",id:"addtodojs",level:4},{value:"Action Creators \u751f\u6210\u5668",id:"action-creators-\u751f\u6210\u5668",level:3},{value:"\u5f02\u6b65 Action Creators",id:"\u5f02\u6b65-action-creators",level:2},{value:"<code>actionCreators.js</code>",id:"actioncreatorsjs-1",level:4},{value:"<code>UserInfo.js</code>",id:"userinfojs",level:4},{value:"<code>actionCreators.js</code>",id:"actioncreatorsjs-2",level:4},{value:"<code>UserInfo.js</code>",id:"userinfojs-1",level:4},{value:"Reducers",id:"reducers",level:2},{value:"Reducers \u751f\u6210\u5668",id:"reducers-\u751f\u6210\u5668",level:3}],d={toc:u};function m(t){var e=t.components,n=(0,a.Z)(t,s);return(0,o.kt)("wrapper",(0,r.Z)({},d,n,{components:e,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"\u51cf\u5c11\u6837\u677f\u4ee3\u7801"},"\u51cf\u5c11\u6837\u677f\u4ee3\u7801"),(0,o.kt)("p",null,"Redux \u5f88\u5927\u90e8\u5206 ",(0,o.kt)("a",{parentName:"p",href:"/understanding/history-and-design/prior-art"},"\u53d7\u5230 Flux \u7684\u542f\u53d1"),"\uff0c\u800c\u6700\u5e38\u89c1\u7684\u5173\u4e8e Flux \u7684\u62b1\u6028\u662f\u5fc5\u987b\u5199\u4e00\u5927\u5806\u7684\u6837\u677f\u4ee3\u7801\u3002\u5728\u8fd9\u7ae0\u4e2d\uff0c\u6211\u4eec\u5c06\u8003\u8651 Redux \u5982\u4f55\u6839\u636e\u4e2a\u4eba\u98ce\u683c\uff0c\u56e2\u961f\u504f\u597d\uff0c\u957f\u671f\u53ef\u7ef4\u62a4\u6027\u7b49\u81ea\u7531\u51b3\u5b9a\u4ee3\u7801\u7684\u7e41\u590d\u7a0b\u5ea6\u3002"),(0,o.kt)("h2",{id:"actions"},"Actions"),(0,o.kt)("p",null,"Actions \u662f\u7528\u6765\u63cf\u8ff0\u5728 app \u4e2d\u53d1\u751f\u4e86\u4ec0\u4e48\u7684\u666e\u901a\u5bf9\u8c61\uff0c\u5e76\u4e14\u662f\u63cf\u8ff0\u7a81\u53d8\u6570\u636e\u610f\u56fe\u7684\u552f\u4e00\u9014\u5f84\u3002\u5f88\u91cd\u8981\u7684\u4e00\u70b9\u662f ",(0,o.kt)("strong",{parentName:"p"},"\u4e0d\u5f97\u4e0d dispatch \u7684 action \u5bf9\u8c61\u5e76\u975e\u662f\u4e00\u4e2a\u6837\u677f\u4ee3\u7801\uff0c\u800c\u662f Redux \u7684\u4e00\u4e2a ",(0,o.kt)("a",{parentName:"strong",href:"/understanding/thinking-in-redux/three-principles"},"\u57fa\u672c\u8bbe\u8ba1\u539f\u5219")),"."),(0,o.kt)("p",null,"\u4e0d\u5c11\u6846\u67b6\u58f0\u79f0\u81ea\u5df1\u548c Flux \u5f88\u50cf\uff0c\u53ea\u4e0d\u8fc7\u7f3a\u5c11\u4e86 action \u5bf9\u8c61\u7684\u6982\u5ff5\u3002\u5728\u53ef\u9884\u6d4b\u6027\u65b9\u9762\uff0c\u8fd9\u662f\u4ece Flux \u6216 Redux \u7684\u5012\u9000\u3002\u5982\u679c\u6ca1\u6709\u53ef\u5e8f\u5217\u5316\u7684\u666e\u901a\u5bf9\u8c61 action\uff0c\u4fbf\u65e0\u6cd5\u8bb0\u5f55\u6216\u91cd\u6f14\u7528\u6237\u4f1a\u8bdd\uff0c\u4e5f\u65e0\u6cd5\u5b9e\u73b0 ",(0,o.kt)("a",{parentName:"p",href:"https://www.youtube.com/watch?v=xsSnOQynTHs"},"\u5e26\u6709\u65f6\u95f4\u65c5\u884c\u7684\u70ed\u91cd\u8f7d"),"\u3002\u5982\u679c\u4f60\u66f4\u559c\u6b22\u76f4\u63a5\u4fee\u6539\u6570\u636e\uff0c\u90a3\u4f60\u5e76\u4e0d\u9700\u8981\u4f7f\u7528 Redux \u3002"),(0,o.kt)("p",null,"Action \u4e00\u822c\u957f\u8fd9\u6837:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"{ type: 'ADD_TODO', text: 'Use Redux' }\n{ type: 'REMOVE_TODO', id: 42 }\n{ type: 'LOAD_ARTICLE', response: { ... } }\n")),(0,o.kt)("p",null,"\u4e00\u4e2a\u7ea6\u5b9a\u4fd7\u6210\u7684\u505a\u6cd5\u662f\uff0caction \u62e5\u6709\u4e00\u4e2a\u4e0d\u53d8\u7684 type \u5e2e\u52a9 reducer (\u6216 Flux \u4e2d\u7684 Stores ) \u8bc6\u522b\u5b83\u4eec\u3002\u6211\u4eec\u5efa\u8bae\u4f60\u4f7f\u7528 string \u800c\u4e0d\u662f ",(0,o.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Symbol"},"\u7b26\u53f7\uff08Symbols\uff09")," \u4f5c\u4e3a action type \uff0c\u56e0\u4e3a string \u662f\u53ef\u5e8f\u5217\u5316\u7684\uff0c\u5e76\u4e14\u4f7f\u7528\u7b26\u53f7\u4f1a\u4f7f\u8bb0\u5f55\u548c\u91cd\u6f14\u53d8\u5f97\u56f0\u96be\u3002"),(0,o.kt)("p",null,"\u5728 Flux \u4e2d\uff0c\u4f20\u7edf\u7684\u60f3\u6cd5\u662f\u5c06\u6bcf\u4e2a action type \u5b9a\u4e49\u4e3a string \u5e38\u91cf\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"const ADD_TODO = 'ADD_TODO'\nconst REMOVE_TODO = 'REMOVE_TODO'\nconst LOAD_ARTICLE = 'LOAD_ARTICLE'\n")),(0,o.kt)("p",null,"\u8fd9\u4e48\u505a\u7684\u4f18\u52bf\u662f\u4ec0\u4e48\uff1f",(0,o.kt)("strong",{parentName:"p"},"\u4eba\u4eec\u901a\u5e38\u8ba4\u4e3a\u5e38\u91cf\u4e0d\u662f\u5fc5\u8981\u7684\uff0c\u8fd9\u53e5\u8bdd\u5bf9\u4e8e\u5c0f\u9879\u76ee\u4e5f\u8bb8\u6b63\u786e\u3002")," \u5bf9\u4e8e\u5927\u7684\u9879\u76ee\uff0c\u5c06 action types \u5b9a\u4e49\u4e3a\u5e38\u91cf\u6709\u5982\u4e0b\u597d\u5904\uff1a"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"\u5e2e\u52a9\u7ef4\u62a4\u547d\u540d\u4e00\u81f4\u6027\uff0c\u56e0\u4e3a\u6240\u6709\u7684 action type \u6c47\u603b\u5728\u540c\u4e00\u4f4d\u7f6e\u3002"),(0,o.kt)("li",{parentName:"ul"},"\u6709\u65f6\uff0c\u5728\u5f00\u53d1\u4e00\u4e2a\u65b0\u529f\u80fd\u4e4b\u524d\u4f60\u60f3\u770b\u5230\u6240\u6709\u73b0\u5b58\u7684 actions \u3002\u800c\u4f60\u7684\u56e2\u961f\u91cc\u53ef\u80fd\u5df2\u7ecf\u6709\u4eba\u6dfb\u52a0\u4e86\u4f60\u6240\u9700\u8981\u7684 action\uff0c\u800c\u4f60\u5e76\u4e0d\u77e5\u9053\u3002"),(0,o.kt)("li",{parentName:"ul"},"Action types \u5217\u8868\u5728 Pull Request \u4e2d\u80fd\u67e5\u5230\u6240\u6709\u6dfb\u52a0\uff0c\u5220\u9664\uff0c\u4fee\u6539\u7684\u8bb0\u5f55\u3002\u8fd9\u80fd\u5e2e\u52a9\u56e2\u961f\u4e2d\u7684\u6240\u6709\u4eba\u53ca\u65f6\u8ffd\u8e2a\u65b0\u529f\u80fd\u7684\u8303\u56f4\u4e0e\u5b9e\u73b0\u3002"),(0,o.kt)("li",{parentName:"ul"},"\u5982\u679c\u4f60\u5728 import \u4e00\u4e2a Action \u5e38\u91cf\u7684\u65f6\u5019\u62fc\u5199\u9519\u4e86\uff0c\u4f60\u4f1a\u5f97\u5230 ",(0,o.kt)("inlineCode",{parentName:"li"},"undefined")," \u3002\u5728 dispatch \u8fd9\u4e2a action \u7684\u65f6\u5019\uff0cRedux \u4f1a\u7acb\u5373\u629b\u51fa\u8fd9\u4e2a\u9519\u8bef\uff0c\u4f60\u4e5f\u4f1a\u9a6c\u4e0a\u53d1\u73b0\u9519\u8bef\u3002")),(0,o.kt)("p",null,"\u4f60\u7684\u9879\u76ee\u7ea6\u5b9a\u53d6\u51b3\u4e0e\u4f60\u81ea\u5df1\u3002\u5f00\u59cb\u65f6\uff0c\u53ef\u80fd\u5728\u521a\u5f00\u59cb\u7528\u5185\u8054\u5b57\u7b26\u4e32\uff08inline string\uff09\uff0c\u4e4b\u540e\u8f6c\u4e3a\u5e38\u91cf\uff0c\u4e5f\u8bb8\u518d\u4e4b\u540e\u5c06\u4ed6\u4eec\u5f52\u4e3a\u4e00\u4e2a\u72ec\u7acb\u6587\u4ef6\u3002Redux \u5728\u8fd9\u91cc\u6ca1\u6709\u4efb\u4f55\u5efa\u8bae\uff0c\u9009\u62e9\u4f60\u81ea\u5df1\u6700\u559c\u6b22\u7684\u3002"),(0,o.kt)("h2",{id:"action-creators"},"Action Creators"),(0,o.kt)("p",null,"\u53e6\u4e00\u4e2a\u7ea6\u5b9a\u4fd7\u6210\u7684\u505a\u6cd5\u662f\u901a\u8fc7\u521b\u5efa\u51fd\u6570\u751f\u6210 action \u5bf9\u8c61\uff0c\u800c\u4e0d\u662f\u5728\u4f60 dispatch \u7684\u65f6\u5019\u5185\u8054\u751f\u6210\u5b83\u4eec\u3002"),(0,o.kt)("p",null,"\u4f8b\u5982\uff0c\u4e0d\u662f\u4f7f\u7528\u5bf9\u8c61\u5b57\u9762\u91cf\u8c03\u7528 ",(0,o.kt)("inlineCode",{parentName:"p"},"dispatch")," \uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"// event handler \u91cc\u7684\u67d0\u5904\ndispatch({\n  type: 'ADD_TODO',\n  text: 'Use Redux'\n})\n")),(0,o.kt)("p",null,"\u4f60\u5176\u5b9e\u53ef\u4ee5\u5728\u5355\u72ec\u7684\u6587\u4ef6\u4e2d\u5199\u4e00\u4e2a action creator \uff0c\u7136\u540e\u4ece component \u91cc import\uff1a"),(0,o.kt)("h4",{id:"actioncreatorsjs"},(0,o.kt)("inlineCode",{parentName:"h4"},"actionCreators.js")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"export function addTodo(text) {\n  return {\n    type: 'ADD_TODO',\n    text\n  }\n}\n")),(0,o.kt)("h4",{id:"addtodojs"},(0,o.kt)("inlineCode",{parentName:"h4"},"AddTodo.js")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"import { addTodo } from './actionCreators'\n\n// event handler \u91cc\u7684\u67d0\u5904\ndispatch(addTodo('Use Redux'))\n")),(0,o.kt)("p",null,"Action creators \u603b\u88ab\u5f53\u4f5c\u6837\u677f\u4ee3\u7801\u53d7\u5230\u6279\u8bc4\u3002\u597d\u5427\uff0c\u5176\u5b9e\u4f60\u5e76\u4e0d\u975e\u5f97\u628a\u4ed6\u4eec\u5199\u51fa\u6765\uff01",(0,o.kt)("strong",{parentName:"p"},"\u5982\u679c\u4f60\u89c9\u5f97\u66f4\u9002\u5408\u4f60\u7684\u9879\u76ee\uff0c\u4f60\u53ef\u4ee5\u9009\u7528\u5bf9\u8c61\u5b57\u9762\u91cf")," \u7136\u800c\uff0c\u4f60\u5e94\u8be5\u77e5\u9053\u5199 action creators \u662f\u5b58\u5728\u67d0\u79cd\u4f18\u52bf\u7684\u3002"),(0,o.kt)("p",null,"\u5047\u8bbe\u6709\u4e2a\u8bbe\u8ba1\u5e08\u770b\u5b8c\u6211\u4eec\u7684\u539f\u578b\u4e4b\u540e\u56de\u6765\u8bf4\uff0c\u6211\u4eec\u6700\u591a\u53ea\u5141\u8bb8\u4e09\u4e2a todo \u3002\u6211\u4eec\u53ef\u4ee5\u4f7f\u7528 ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/gaearon/redux-thunk"},"redux-thunk")," \u4e2d\u95f4\u4ef6\uff0c\u5e76\u6dfb\u52a0\u4e00\u4e2a\u63d0\u524d\u9000\u51fa\uff0c\u628a\u6211\u4eec\u7684 action creator \u91cd\u5199\u6210\u56de\u8c03\u5f62\u5f0f\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"function addTodoWithoutCheck(text) {\n  return {\n    type: 'ADD_TODO',\n    text\n  }\n}\n\nexport function addTodo(text) {\n  // Redux Thunk \u4e2d\u95f4\u4ef6\u5141\u8bb8\u8fd9\u79cd\u5f62\u5f0f\n  // \u5728\u4e0b\u9762\u7684 \u201c\u5f02\u6b65 Action Creators\u201d \u6bb5\u843d\u4e2d\u6709\u5199\n  return function(dispatch, getState) {\n    if (getState().todos.length === 3) {\n      // \u63d0\u524d\u9000\u51fa\n      return\n    }\n    dispatch(addTodoWithoutCheck(text))\n  }\n}\n")),(0,o.kt)("p",null,"\u6211\u4eec\u521a\u4fee\u6539\u4e86 ",(0,o.kt)("inlineCode",{parentName:"p"},"addTodo")," action creator \u7684\u884c\u4e3a\uff0c\u4f7f\u5f97\u5b83\u5bf9\u8c03\u7528\u5b83\u7684\u4ee3\u7801\u5b8c\u5168\u4e0d\u53ef\u89c1\u3002",(0,o.kt)("strong",{parentName:"p"},"\u6211\u4eec\u4e0d\u7528\u62c5\u5fc3\u53bb\u6bcf\u4e2a\u6dfb\u52a0 todo \u7684\u5730\u65b9\u770b\u4e00\u770b\uff0c\u4ee5\u786e\u8ba4\u4ed6\u4eec\u6709\u4e86\u8fd9\u4e2a\u68c0\u67e5")," Action creator \u8ba9\u4f60\u53ef\u4ee5\u89e3\u8026\u989d\u5916\u7684\u5206\u53d1 action \u903b\u8f91\u4e0e\u5b9e\u9645\u53d1\u9001\u8fd9\u4e9b action \u7684 components\u3002\u5f53\u4f60\u6709\u5927\u91cf\u5f00\u53d1\u5de5\u4f5c\u4e14\u9700\u6c42\u7ecf\u5e38\u53d8\u66f4\u7684\u65f6\u5019\uff0c\u8fd9\u79cd\u65b9\u6cd5\u5341\u5206\u7b80\u4fbf\u6613\u7528\u3002"),(0,o.kt)("h3",{id:"action-creators-\u751f\u6210\u5668"},"Action Creators \u751f\u6210\u5668"),(0,o.kt)("p",null,"\u67d0\u4e9b\u6846\u67b6\u5982 ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/acdlite/flummox"},"Flummox")," \u81ea\u52a8\u4ece action creator \u51fd\u6570\u5b9a\u4e49\u751f\u6210 action type \u5e38\u91cf\u3002\u8fd9\u4e2a\u60f3\u6cd5\u662f\u8bf4\u4f60\u4e0d\u9700\u8981\u540c\u65f6\u5b9a\u4e49 ",(0,o.kt)("inlineCode",{parentName:"p"},"ADD_TODO")," \u5e38\u91cf\u548c ",(0,o.kt)("inlineCode",{parentName:"p"},"addTodo()")," action creator \u3002\u8fd9\u6837\u7684\u65b9\u6cd5\u5728\u5e95\u5c42\u4e5f\u751f\u6210\u4e86 action type \u5e38\u91cf\uff0c\u4f46\u4ed6\u4eec\u662f\u9690\u5f0f\u751f\u6210\u7684\u3001\u95f4\u63a5\u7ea7\uff0c\u4f1a\u9020\u6210\u6df7\u4e71\u3002\u56e0\u6b64\u6211\u4eec\u5efa\u8bae\u76f4\u63a5\u6e05\u6670\u5730\u521b\u5efa action type \u5e38\u91cf\u3002"),(0,o.kt)("p",null,"\u5199\u7b80\u5355\u7684 action creator \u5f88\u5bb9\u6613\u8ba9\u4eba\u538c\u70e6\uff0c\u4e14\u5f80\u5f80\u6700\u7ec8\u751f\u6210\u591a\u4f59\u7684\u6837\u677f\u4ee3\u7801\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"export function addTodo(text) {\n  return {\n    type: 'ADD_TODO',\n    text\n  }\n}\n\nexport function editTodo(id, text) {\n  return {\n    type: 'EDIT_TODO',\n    id,\n    text\n  }\n}\n\nexport function removeTodo(id) {\n  return {\n    type: 'REMOVE_TODO',\n    id\n  }\n}\n")),(0,o.kt)("p",null,"\u4f60\u53ef\u4ee5\u5199\u4e00\u4e2a\u7528\u4e8e\u751f\u6210 action creator \u7684\u51fd\u6570\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"function makeActionCreator(type, ...argNames) {\n  return function(...args) {\n    const action = { type }\n    argNames.forEach((arg, index) => {\n      action[argNames[index]] = args[index]\n    })\n    return action\n  }\n}\n\nconst ADD_TODO = 'ADD_TODO'\nconst EDIT_TODO = 'EDIT_TODO'\nconst REMOVE_TODO = 'REMOVE_TODO'\n\nexport const addTodo = makeActionCreator(ADD_TODO, 'text')\nexport const editTodo = makeActionCreator(EDIT_TODO, 'id', 'text')\nexport const removeTodo = makeActionCreator(REMOVE_TODO, 'id')\n")),(0,o.kt)("p",null,"\u4e00\u4e9b\u5de5\u5177\u5e93\u4e5f\u53ef\u4ee5\u5e2e\u52a9\u751f\u6210 action creator \uff0c\u4f8b\u5982 ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/pauldijou/redux-act"},"redux-act")," \u548c ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/acdlite/redux-actions"},"redux-actions"),"\u3002\u8fd9\u4e9b\u5e93\u53ef\u4ee5\u6709\u6548\u51cf\u5c11\u4f60\u7684\u6837\u677f\u4ee3\u7801\uff0c\u5e76\u7d27\u5b88\u4f8b\u5982 ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/acdlite/flux-standard-action"},"Flux Standard Action (FSA)")," \u4e00\u7c7b\u7684\u6807\u51c6\u3002"),(0,o.kt)("h2",{id:"\u5f02\u6b65-action-creators"},"\u5f02\u6b65 Action Creators"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/understanding/thinking-in-redux/glossary#middleware"},"\u4e2d\u95f4\u4ef6")," \u8ba9\u4f60\u5728\u6bcf\u4e2a action \u5bf9\u8c61 dispatch \u51fa\u53bb\u4e4b\u524d\uff0c\u6ce8\u5165\u4e00\u4e2a\u81ea\u5b9a\u4e49\u7684\u903b\u8f91\u3002\u5f02\u6b65 action \u662f\u4e2d\u95f4\u4ef6\u7684\u6700\u5e38\u89c1\u7684\u4f7f\u7528\u573a\u666f\u3002"),(0,o.kt)("p",null,"\u5982\u679c\u6ca1\u6709\u4e2d\u95f4\u4ef6\uff0c",(0,o.kt)("a",{parentName:"p",href:"/api/store#dispatchaction"},(0,o.kt)("inlineCode",{parentName:"a"},"dispatch"))," \u53ea\u80fd\u63a5\u6536\u4e00\u4e2a\u666e\u901a\u5bf9\u8c61\u3002\u56e0\u6b64\u6211\u4eec\u5fc5\u987b\u5728 components \u91cc\u9762\u8fdb\u884c AJAX \u8c03\u7528\uff1a"),(0,o.kt)("h4",{id:"actioncreatorsjs-1"},(0,o.kt)("inlineCode",{parentName:"h4"},"actionCreators.js")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"export function loadPostsSuccess(userId, response) {\n  return {\n    type: 'LOAD_POSTS_SUCCESS',\n    userId,\n    response\n  }\n}\n\nexport function loadPostsFailure(userId, error) {\n  return {\n    type: 'LOAD_POSTS_FAILURE',\n    userId,\n    error\n  }\n}\n\nexport function loadPostsRequest(userId) {\n  return {\n    type: 'LOAD_POSTS_REQUEST',\n    userId\n  }\n}\n")),(0,o.kt)("h4",{id:"userinfojs"},(0,o.kt)("inlineCode",{parentName:"h4"},"UserInfo.js")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"import { Component } from 'react'\nimport { connect } from 'react-redux'\nimport {\n  loadPostsRequest,\n  loadPostsSuccess,\n  loadPostsFailure\n} from './actionCreators'\n\nclass Posts extends Component {\n  loadData(userId) {\n    // \u8c03\u7528 React Redux `connect()` \u6ce8\u5165\u7684 props \uff1a\n    const { dispatch, posts } = this.props\n\n    if (posts[userId]) {\n      // \u8fd9\u91cc\u662f\u88ab\u7f13\u5b58\u7684\u6570\u636e\uff01\u5565\u4e5f\u4e0d\u505a\u3002\n      return\n    }\n\n    // Reducer \u53ef\u4ee5\u901a\u8fc7\u8bbe\u7f6e `isFetching` \u54cd\u5e94\u8fd9\u4e2a action\n    // \u56e0\u6b64\u8ba9\u6211\u4eec\u663e\u793a\u4e00\u4e2a Spinner \u63a7\u4ef6\u3002\n    dispatch(loadPostsRequest(userId))\n\n    // Reducer \u53ef\u4ee5\u901a\u8fc7\u586b\u5199 `users` \u54cd\u5e94\u8fd9\u4e9b actions\n    fetch(`http://myapi.com/users/${userId}/posts`).then(\n      response => dispatch(loadPostsSuccess(userId, response)),\n      error => dispatch(loadPostsFailure(userId, error))\n    )\n  }\n\n  componentDidMount() {\n    this.loadData(this.props.userId)\n  }\n\n  componentDidUpdate(prevProps) {\n    if (prevProps.userId !== this.props.userId) {\n      this.loadData(this.props.userId)\n    }\n  }\n\n  render() {\n    if (this.props.isFetching) {\n      return <p>Loading...</p>\n    }\n\n    const posts = this.props.posts.map(post => (\n      <Post post={post} key={post.id} />\n    ))\n\n    return <div>{posts}</div>\n  }\n}\n\nexport default connect(state => ({\n  posts: state.posts,\n  isFetching: state.isFetching\n}))(Posts)\n")),(0,o.kt)("p",null,"\u7136\u800c\uff0c\u4e0d\u4e45\u5c31\u9700\u8981\u518d\u6765\u4e00\u904d\uff0c\u56e0\u4e3a\u4e0d\u540c\u7684 components \u4ece\u540c\u6837\u7684 API \u7aef\u70b9\u8bf7\u6c42\u6570\u636e\u3002\u800c\u4e14\u6211\u4eec\u60f3\u8981\u5728\u591a\u4e2a components \u4e2d\u91cd\u7528\u4e00\u4e9b\u903b\u8f91\uff08\u6bd4\u5982\uff0c\u5f53\u7f13\u5b58\u6570\u636e\u6709\u6548\u7684\u65f6\u5019\u63d0\u524d\u9000\u51fa\uff09\u3002"),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"\u4e2d\u95f4\u4ef6\u8ba9\u6211\u4eec\u80fd\u5199\u8868\u8fbe\u66f4\u6e05\u6670\u7684\u3001\u6f5c\u5728\u7684\u5f02\u6b65 action creators\u3002")," \u5b83\u5141\u8bb8\u6211\u4eec dispatch \u666e\u901a\u5bf9\u8c61\u4e4b\u5916\u7684\u4e1c\u897f\uff0c\u5e76\u4e14\u89e3\u91ca\u5b83\u4eec\u7684\u503c\u3002\u6bd4\u5982\uff0c\u4e2d\u95f4\u4ef6\u80fd \u201c\u6355\u6349\u201d \u5230\u5df2\u7ecf dispatch \u7684 Promises \u5e76\u628a\u4ed6\u4eec\u53d8\u4e3a\u4e00\u5bf9\u8bf7\u6c42\u548c\u6210\u529f/\u5931\u8d25\u7684 action."),(0,o.kt)("p",null,"\u4e2d\u95f4\u4ef6\u6700\u7b80\u5355\u7684\u4f8b\u5b50\u662f ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/gaearon/redux-thunk"},"redux-thunk"),". ",(0,o.kt)("strong",{parentName:"p"},"\u201cThunk\u201d \u4e2d\u95f4\u4ef6\u8ba9\u4f60\u53ef\u4ee5\u628a action creators \u5199\u6210 \u201cthunks\u201d\uff0c\u4e5f\u5c31\u662f\u8fd4\u56de\u51fd\u6570\u7684\u51fd\u6570\u3002")," \u8fd9\u4f7f\u5f97\u63a7\u5236\u88ab\u53cd\u8f6c\u4e86\uff1a\u4f60\u53ef\u4ee5\u901a\u8fc7\u53c2\u6570\u62ff\u5230 ",(0,o.kt)("inlineCode",{parentName:"p"},"dispatch")," \uff0c\u6240\u4ee5\u4f60\u4e5f\u80fd dispatch \u591a\u6b21 action creator\u3002"),(0,o.kt)("blockquote",null,(0,o.kt)("h5",{parentName:"blockquote",id:"\u6ce8\u610f"},"\u6ce8\u610f"),(0,o.kt)("p",{parentName:"blockquote"},"Thunk \u53ea\u662f\u4e00\u4e2a\u4e2d\u95f4\u4ef6\u7684\u4f8b\u5b50\u3002\u4e2d\u95f4\u4ef6\u4e0d\u4ec5\u4ec5\u53ea\u80fd\u5904\u7406 \u201cdispatch \u51fd\u6570\u201d\uff1a\u800c\u662f\u5173\u4e8e\u4f60\u53ef\u4ee5\u4f7f\u7528\u7279\u5b9a\u7684\u4e2d\u95f4\u4ef6\u6765 dispatch \u4efb\u4f55\u8be5\u4e2d\u95f4\u4ef6\u53ef\u4ee5\u5904\u7406\u7684\u4e1c\u897f\u3002\u4f8b\u5b50\u4e2d\u7684 Thunk \u4e2d\u95f4\u4ef6\u6dfb\u52a0\u4e86\u4e00\u4e2a\u7279\u5b9a\u7684\u884c\u4e3a\u7528\u6765 dispatch \u51fd\u6570\uff0c\u4f46\u8fd9\u5b9e\u9645\u505a\u4ec0\u4e48\u53d6\u51b3\u4e8e\u4f60\u7528\u7684\u4e2d\u95f4\u4ef6\u3002")),(0,o.kt)("p",null,"\u7528 ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/gaearon/redux-thunk"},"redux-thunk")," \u91cd\u5199\u4e0a\u9762\u7684\u4ee3\u7801\uff1a"),(0,o.kt)("h4",{id:"actioncreatorsjs-2"},(0,o.kt)("inlineCode",{parentName:"h4"},"actionCreators.js")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"export function loadPosts(userId) {\n  // \u7528 thunk \u4e2d\u95f4\u4ef6\u89e3\u91ca\uff1a\n  return function(dispatch, getState) {\n    const { posts } = getState()\n    if (posts[userId]) {\n      // \u8fd9\u91cc\u662f\u6570\u636e\u7f13\u5b58\uff01\u5565\u4e5f\u4e0d\u505a\u3002\n      return\n    }\n\n    dispatch({\n      type: 'LOAD_POSTS_REQUEST',\n      userId\n    })\n\n    // \u5f02\u6b65\u5206\u53d1\u539f\u5473 action\n    fetch(`http://myapi.com/users/${userId}/posts`).then(\n      response =>\n        dispatch({\n          type: 'LOAD_POSTS_SUCCESS',\n          userId,\n          response\n        }),\n      error =>\n        dispatch({\n          type: 'LOAD_POSTS_FAILURE',\n          userId,\n          error\n        })\n    )\n  }\n}\n")),(0,o.kt)("h4",{id:"userinfojs-1"},(0,o.kt)("inlineCode",{parentName:"h4"},"UserInfo.js")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"import { Component } from 'react'\nimport { connect } from 'react-redux'\nimport { loadPosts } from './actionCreators'\n\nclass Posts extends Component {\n  componentDidMount() {\n    this.props.dispatch(loadPosts(this.props.userId))\n  }\n\n  componentDidUpdate(prevProps) {\n    if (prevProps.userId !== this.props.userId) {\n      this.props.dispatch(loadPosts(this.props.userId))\n    }\n  }\n\n  render() {\n    if (this.props.isFetching) {\n      return <p>Loading...</p>\n    }\n\n    const posts = this.props.posts.map(post => (\n      <Post post={post} key={post.id} />\n    ))\n\n    return <div>{posts}</div>\n  }\n}\n\nexport default connect(state => ({\n  posts: state.posts,\n  isFetching: state.isFetching\n}))(Posts)\n")),(0,o.kt)("p",null,"\u8fd9\u6837\u6253\u5f97\u5b57\u5c11\u591a\u4e86\uff01\u5982\u679c\u4f60\u559c\u6b22\uff0c\u4f60\u8fd8\u662f\u53ef\u4ee5\u4fdd\u7559 \u201c\u539f\u5473\u201d action creators \u6bd4\u5982\u4ece\u4e00\u4e2a\u5bb9\u5668 ",(0,o.kt)("inlineCode",{parentName:"p"},"loadPosts")," action creator \u91cc\u7528\u5230\u7684 ",(0,o.kt)("inlineCode",{parentName:"p"},"loadPostsSuccess")," \u3002"),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"\u6700\u540e\uff0c\u4f60\u53ef\u4ee5\u7f16\u5199\u4f60\u81ea\u5df1\u7684\u4e2d\u95f4\u4ef6")," \u4f60\u53ef\u4ee5\u628a\u4e0a\u9762\u7684\u6a21\u5f0f\u6cdb\u5316\uff0c\u7136\u540e\u4ee3\u4e4b\u4ee5\u8fd9\u6837\u7684\u5f02\u6b65 action creators \uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"export function loadPosts(userId) {\n  return {\n    // \u8981\u5728\u4e4b\u524d\u548c\u4e4b\u540e\u53d1\u9001\u7684 action types\n    types: ['LOAD_POSTS_REQUEST', 'LOAD_POSTS_SUCCESS', 'LOAD_POSTS_FAILURE'],\n    // \u68c0\u67e5\u7f13\u5b58 (\u53ef\u9009):\n    shouldCallAPI: state => !state.users[userId],\n    // \u8fdb\u884c\u53d6\uff1a\n    callAPI: () => fetch(`http://myapi.com/users/${userId}/posts`),\n    // \u5728 actions \u7684\u5f00\u59cb\u548c\u7ed3\u675f\u6ce8\u5165\u7684\u53c2\u6570\n    payload: { userId }\n  }\n}\n")),(0,o.kt)("p",null,"\u89e3\u91ca\u8fd9\u4e2a actions \u7684\u4e2d\u95f4\u4ef6\u53ef\u4ee5\u50cf\u8fd9\u6837\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"function callAPIMiddleware({ dispatch, getState }) {\n  return next => action => {\n    const { types, callAPI, shouldCallAPI = () => true, payload = {} } = action\n\n    if (!types) {\n      // Normal action: pass it on\n      return next(action)\n    }\n\n    if (\n      !Array.isArray(types) ||\n      types.length !== 3 ||\n      !types.every(type => typeof type === 'string')\n    ) {\n      throw new Error('Expected an array of three string types.')\n    }\n\n    if (typeof callAPI !== 'function') {\n      throw new Error('Expected callAPI to be a function.')\n    }\n\n    if (!shouldCallAPI(getState())) {\n      return\n    }\n\n    const [requestType, successType, failureType] = types\n\n    dispatch(\n      Object.assign({}, payload, {\n        type: requestType\n      })\n    )\n\n    return callAPI().then(\n      response =>\n        dispatch(\n          Object.assign({}, payload, {\n            response,\n            type: successType\n          })\n        ),\n      error =>\n        dispatch(\n          Object.assign({}, payload, {\n            error,\n            type: failureType\n          })\n        )\n    )\n  }\n}\n")),(0,o.kt)("p",null,"\u5728\u4f20\u7ed9 ",(0,o.kt)("a",{parentName:"p",href:"/api/applymiddleware"},(0,o.kt)("inlineCode",{parentName:"a"},"applyMiddleware(...middlewares)"))," \u4e00\u6b21\u4ee5\u540e\uff0c\u4f60\u80fd\u7528\u76f8\u540c\u65b9\u5f0f\u5199\u4f60\u7684 API \u8c03\u7528 action creators \uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"export function loadPosts(userId) {\n  return {\n    types: ['LOAD_POSTS_REQUEST', 'LOAD_POSTS_SUCCESS', 'LOAD_POSTS_FAILURE'],\n    shouldCallAPI: state => !state.users[userId],\n    callAPI: () => fetch(`http://myapi.com/users/${userId}/posts`),\n    payload: { userId }\n  }\n}\n\nexport function loadComments(postId) {\n  return {\n    types: [\n      'LOAD_COMMENTS_REQUEST',\n      'LOAD_COMMENTS_SUCCESS',\n      'LOAD_COMMENTS_FAILURE'\n    ],\n    shouldCallAPI: state => !state.posts[postId],\n    callAPI: () => fetch(`http://myapi.com/posts/${postId}/comments`),\n    payload: { postId }\n  }\n}\n\nexport function addComment(postId, message) {\n  return {\n    types: [\n      'ADD_COMMENT_REQUEST',\n      'ADD_COMMENT_SUCCESS',\n      'ADD_COMMENT_FAILURE'\n    ],\n    callAPI: () =>\n      fetch(`http://myapi.com/posts/${postId}/comments`, {\n        method: 'post',\n        headers: {\n          Accept: 'application/json',\n          'Content-Type': 'application/json'\n        },\n        body: JSON.stringify({ message })\n      }),\n    payload: { postId, message }\n  }\n}\n")),(0,o.kt)("h2",{id:"reducers"},"Reducers"),(0,o.kt)("p",null,"Redux \u7528\u51fd\u6570\u63cf\u8ff0\u903b\u8f91\u66f4\u65b0\u51cf\u5c11\u4e86 Flux stores \u91cc\u7684\u5927\u91cf\u6837\u677f\u4ee3\u7801\u3002\u51fd\u6570\u6bd4\u5bf9\u8c61\u7b80\u5355\uff0c\u6bd4\u7c7b\u66f4\u7b80\u5355\u5f97\u591a\u3002"),(0,o.kt)("p",null,"\u8fd9\u4e2a Flux store:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"const _todos = []\n\nconst TodoStore = Object.assign({}, EventEmitter.prototype, {\n  getAll() {\n    return _todos\n  }\n})\n\nAppDispatcher.register(function(action) {\n  switch (action.type) {\n    case ActionTypes.ADD_TODO:\n      const text = action.text.trim()\n      _todos.push(text)\n      TodoStore.emitChange()\n  }\n})\n\nexport default TodoStore\n")),(0,o.kt)("p",null,"\u7528\u4e86 Redux \u4e4b\u540e\uff0c\u540c\u6837\u7684\u903b\u8f91\u66f4\u65b0\u53ef\u4ee5\u88ab\u5199\u6210 reducing function\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"export function todos(state = [], action) {\n  switch (action.type) {\n    case ActionTypes.ADD_TODO:\n      const text = action.text.trim()\n      return [...state, text]\n    default:\n      return state\n  }\n}\n")),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"switch")," \u8bed\u53e5 ",(0,o.kt)("em",{parentName:"p"},"\u4e0d\u662f")," \u771f\u6b63\u7684\u6837\u677f\u4ee3\u7801\u3002\u771f\u6b63\u7684 Flux \u6837\u677f\u4ee3\u7801\u662f\u6982\u5ff5\u6027\u7684\uff1a\u53d1\u9001\u66f4\u65b0\u7684\u9700\u6c42\uff0c\u7528 Dispatcher \u6ce8\u518c Store \u7684\u9700\u6c42\uff0cStore \u662f\u5bf9\u8c61\u7684\u9700\u6c42 (\u5f53\u4f60\u60f3\u8981\u4e00\u4e2a\u54ea\u90fd\u80fd\u8dd1\u7684 App \u7684\u65f6\u5019\u590d\u6742\u5ea6\u4f1a\u63d0\u5347)\u3002"),(0,o.kt)("p",null,"\u4e0d\u5e78\u7684\u662f\u5f88\u591a\u4eba\u4ecd\u7136\u9760\u6587\u6863\u91cc\u7528\u6ca1\u7528 ",(0,o.kt)("inlineCode",{parentName:"p"},"switch")," \u6765\u9009\u62e9 Flux \u6846\u67b6\u3002\u5982\u679c\u4f60\u4e0d\u7231\u7528 ",(0,o.kt)("inlineCode",{parentName:"p"},"switch")," \u4f60\u53ef\u4ee5\u7528\u4e00\u4e2a\u5355\u72ec\u7684\u51fd\u6570\u6765\u89e3\u51b3\uff0c\u4e0b\u9762\u4f1a\u6f14\u793a\u3002"),(0,o.kt)("h3",{id:"reducers-\u751f\u6210\u5668"},"Reducers \u751f\u6210\u5668"),(0,o.kt)("p",null,"\u5199\u4e00\u4e2a\u51fd\u6570\u5c06 reducers \u8868\u8fbe\u4e3a action types \u5230 handlers \u7684\u6620\u5c04\u5bf9\u8c61\u3002\u4f8b\u5982\uff0c\u5982\u679c\u60f3\u5728 ",(0,o.kt)("inlineCode",{parentName:"p"},"todos")," reducer \u91cc\u8fd9\u6837\u5b9a\u4e49\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"export const todos = createReducer([], {\n  [ActionTypes.ADD_TODO]: (state, action) => {\n    const text = action.text.trim()\n    return [...state, text]\n  }\n})\n")),(0,o.kt)("p",null,"\u6211\u4eec\u53ef\u4ee5\u7f16\u5199\u4e0b\u9762\u7684\u8f85\u52a9\u51fd\u6570\u6765\u5b8c\u6210\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"function createReducer(initialState, handlers) {\n  return function reducer(state = initialState, action) {\n    if (handlers.hasOwnProperty(action.type)) {\n      return handlers[action.type](state, action)\n    } else {\n      return state\n    }\n  }\n}\n")),(0,o.kt)("p",null,"\u4e0d\u96be\u5bf9\u5427\uff1f\u9274\u4e8e\u5199\u6cd5\u591a\u79cd\u591a\u6837\uff0cRedux \u6ca1\u6709\u9ed8\u8ba4\u63d0\u4f9b\u8fd9\u6837\u7684\u8f85\u52a9\u51fd\u6570\u3002\u53ef\u80fd\u4f60\u60f3\u8981\u81ea\u52a8\u5730\u5c06\u666e\u901a JS \u5bf9\u8c61\u53d8\u6210 Immutable \u5bf9\u8c61\uff0c\u4ee5\u586b\u6ee1\u670d\u52a1\u5668\u72b6\u6001\u7684\u5bf9\u8c61\u6570\u636e\u3002\u53ef\u80fd\u4f60\u60f3\u5408\u5e76\u8fd4\u56de\u72b6\u6001\u548c\u5f53\u524d\u72b6\u6001\u3002\u6709\u591a\u79cd\u591a\u6837\u7684\u65b9\u6cd5\u6765 \u201c\u83b7\u53d6\u6240\u6709\u201d handler\uff0c\u5177\u4f53\u600e\u4e48\u505a\u5219\u53d6\u51b3\u4e8e\u9879\u76ee\u4e2d\u4f60\u548c\u4f60\u7684\u56e2\u961f\u7684\u7ea6\u5b9a\u3002"),(0,o.kt)("p",null,"Redux reducer \u7684 API \u662f ",(0,o.kt)("inlineCode",{parentName:"p"},"(state, action) => newState"),"\uff0c\u4f46\u662f\u600e\u4e48\u521b\u5efa\u8fd9\u4e9b reducers \u7531\u4f60\u6765\u5b9a\u3002"))}m.isMDXComponent=!0}}]);