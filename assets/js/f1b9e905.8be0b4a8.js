"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[1333],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return c}});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var u=r.createContext({}),d=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},p=function(e){var t=d(e.components);return r.createElement(u.Provider,{value:t},e.children)},k={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},s=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,l=e.originalType,u=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),s=d(n),c=o,m=s["".concat(u,".").concat(c)]||s[c]||k[c]||l;return n?r.createElement(m,a(a({ref:t},p),{},{components:n})):r.createElement(m,a({ref:t},p))}));function c(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var l=n.length,a=new Array(l);a[0]=s;var i={};for(var u in t)hasOwnProperty.call(t,u)&&(i[u]=t[u]);i.originalType=e,i.mdxType="string"==typeof e?e:o,a[1]=i;for(var d=2;d<l;d++)a[d]=n[d];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}s.displayName="MDXCreateElement"},2483:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return u},default:function(){return c},frontMatter:function(){return i},metadata:function(){return d},toc:function(){return k}});var r=n(7462),o=n(3366),l=(n(7294),n(3905)),a=["components"],i={id:"why-rtk-is-redux-today",title:"\u4e3a\u4ec0\u4e48 Redux Toolkit \u662f\u5982\u4eca\u4f7f\u7528 Redux \u7684\u65b9\u5f0f",description:"\u7b80\u4ecb > \u4e3a\u4ec0\u4e48 RTK \u662f\u5982\u4eca\u4f7f\u7528 Redux \u7684\u65b9\u5f0f:  \u8be6\u7ec6\u4ecb\u7ecd RTK \u5982\u4f55\u66ff\u4ee3 Redux \u6838\u5fc3\u529f\u80fd"},u=void 0,d={unversionedId:"introduction/why-rtk-is-redux-today",id:"introduction/why-rtk-is-redux-today",title:"\u4e3a\u4ec0\u4e48 Redux Toolkit \u662f\u5982\u4eca\u4f7f\u7528 Redux \u7684\u65b9\u5f0f",description:"\u7b80\u4ecb > \u4e3a\u4ec0\u4e48 RTK \u662f\u5982\u4eca\u4f7f\u7528 Redux \u7684\u65b9\u5f0f:  \u8be6\u7ec6\u4ecb\u7ecd RTK \u5982\u4f55\u66ff\u4ee3 Redux \u6838\u5fc3\u529f\u80fd",source:"@site/../docs/introduction/why-rtk-is-redux-today.md",sourceDirName:"introduction",slug:"/introduction/why-rtk-is-redux-today",permalink:"/introduction/why-rtk-is-redux-today",draft:!1,tags:[],version:"current",frontMatter:{id:"why-rtk-is-redux-today",title:"\u4e3a\u4ec0\u4e48 Redux Toolkit \u662f\u5982\u4eca\u4f7f\u7528 Redux \u7684\u65b9\u5f0f",description:"\u7b80\u4ecb > \u4e3a\u4ec0\u4e48 RTK \u662f\u5982\u4eca\u4f7f\u7528 Redux \u7684\u65b9\u5f0f:  \u8be6\u7ec6\u4ecb\u7ecd RTK \u5982\u4f55\u66ff\u4ee3 Redux \u6838\u5fc3\u529f\u80fd"},sidebar:"docs",previous:{title:"\u5b89\u88c5",permalink:"/introduction/installation"},next:{title:"\u6838\u5fc3\u6982\u5ff5",permalink:"/introduction/core-concepts"}},p={},k=[{value:"\u4ec0\u4e48\u662f Redux Toolkit?",id:"\u4ec0\u4e48\u662f-redux-toolkit",level:2},{value:"Redux Toolkit \u4e0e Redux \u6838\u5fc3\u5305\u6709\u4ec0\u4e48\u533a\u522b",id:"redux-toolkit-\u4e0e-redux-\u6838\u5fc3\u5305\u6709\u4ec0\u4e48\u533a\u522b",level:2},{value:"&quot;Redux&quot;\u662f\u4ec0\u4e48?",id:"redux\u662f\u4ec0\u4e48",level:3},{value:"Redux \u6838\u5fc3\u5305\u505a\u4e86\u4ec0\u4e48?",id:"redux-\u6838\u5fc3\u5305\u505a\u4e86\u4ec0\u4e48",level:3},{value:"Redux Toolkit \u505a\u4e86\u54ea\u4e9b\u4e8b?",id:"redux-toolkit-\u505a\u4e86\u54ea\u4e9b\u4e8b",level:3},{value:"\u4e3a\u4ec0\u4e48\u6211\u4eec\u63a8\u8350\u4f7f\u7528 Redux Toolkit",id:"\u4e3a\u4ec0\u4e48\u6211\u4eec\u63a8\u8350\u4f7f\u7528-redux-toolkit",level:2},{value:"\u66f4\u591a\u4fe1\u606f",id:"\u66f4\u591a\u4fe1\u606f",level:2}],s={toc:k};function c(e){var t=e.components,n=(0,o.Z)(e,a);return(0,l.kt)("wrapper",(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h2",{id:"\u4ec0\u4e48\u662f-redux-toolkit"},"\u4ec0\u4e48\u662f Redux Toolkit?"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"https://redux-toolkit.js.org"},(0,l.kt)("strong",{parentName:"a"},"Redux Toolkit"))," (\u4e5f\u79f0\u4e3a ",(0,l.kt)("strong",{parentName:"p"},'"RTK"')," ) \u662f\u6211\u4eec\u5b98\u65b9\u63a8\u8350\u7684\u7f16\u5199 Redux \u903b\u8f91\u7684\u65b9\u6cd5\u3002",(0,l.kt)("inlineCode",{parentName:"p"},"@reduxjs/toolkit")," \u5305\u5c01\u88c5\u4e86\u6838\u5fc3\u7684 ",(0,l.kt)("inlineCode",{parentName:"p"},"redux")," \u5305\uff0c\u5305\u542b\u6211\u4eec\u8ba4\u4e3a\u6784\u5efa Redux \u5e94\u7528\u6240\u5fc5\u987b\u7684 API \u65b9\u6cd5\u548c\u5e38\u7528\u4f9d\u8d56\u3002 Redux Toolkit \u96c6\u6210\u4e86\u6211\u4eec\u5efa\u8bae\u7684\u6700\u4f73\u5b9e\u8df5\uff0c\u7b80\u5316\u4e86\u5927\u90e8\u5206 Redux \u4efb\u52a1\uff0c\u963b\u6b62\u4e86\u5e38\u89c1\u9519\u8bef\uff0c\u5e76\u8ba9\u7f16\u5199 Redux \u5e94\u7528\u7a0b\u5e8f\u53d8\u5f97\u66f4\u5bb9\u6613\u3002"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"\u5982\u679c\u4eca\u5929\u4f60\u8981\u5199\u4efb\u4f55\u7684 Redux \u903b\u8f91\uff0c\u4f60\u90fd\u5e94\u8be5\u4f7f\u7528 Redux Toolkit \u6765\u7f16\u5199\u4ee3\u7801")),(0,l.kt)("p",null,"RTK \u5305\u62ec\u4e00\u4e9b\u5b9e\u7528\u7a0b\u5e8f\uff0c\u53ef\u4ee5\u5e2e\u52a9\u7b80\u5316\u8bb8\u591a\u5e38\u89c1\u7684\u7528\u4f8b\uff0c\u5305\u62ec ",(0,l.kt)("a",{parentName:"p",href:"https://redux-toolkit.js.org/api/configureStore"},"\u914d\u7f6e Redux store"),"\u3001\n",(0,l.kt)("a",{parentName:"p",href:"https://redux-toolkit.js.org/api/createreducer"},"\u521b\u5efa reducer \u51fd\u6570\u5e76\u4f7f\u7528\u4e0d\u53ef\u53d8\u66f4\u65b0\u903b\u8f91"),"\n\u548c ",(0,l.kt)("a",{parentName:"p",href:"https://redux-toolkit.js.org/api/createslice"},'\u4e00\u6b21\u6027\u521b\u5efa\u72b6\u6001\u7684\u67d0\u4e2a"\u7247\u6bb5"\uff08slice\uff09'),"\u3002"),(0,l.kt)("p",null,"\u65e0\u8bba\u4f60\u662f\u521a\u63a5\u89e6 Redux \u7684\u65b0\u7528\u6237\u6b63\u5728\u8bbe\u8ba1\u4f60\u7684\u7b2c\u4e00\u4e2a\u9879\u76ee\uff0c\u8fd8\u662f\u5df2\u6709\u7ecf\u9a8c\u7684\u7528\u6237\u60f3\u7b80\u5316\u4e00\u4e2a\u73b0\u6709\u7684\u5e94\u7528\uff0c",(0,l.kt)("strong",{parentName:"p"},(0,l.kt)("a",{parentName:"strong",href:"https://redux-toolkit.js.org/"},"Redux Toolkit"))," \u90fd\u80fd\u591f\u5e2e\u52a9\u4f60\u5199\u51fa\u66f4\u597d\u7684 Redux \u4ee3\u7801\u3002"),(0,l.kt)("h2",{id:"redux-toolkit-\u4e0e-redux-\u6838\u5fc3\u5305\u6709\u4ec0\u4e48\u533a\u522b"},"Redux Toolkit \u4e0e Redux \u6838\u5fc3\u5305\u6709\u4ec0\u4e48\u533a\u522b"),(0,l.kt)("h3",{id:"redux\u662f\u4ec0\u4e48"},'"Redux"\u662f\u4ec0\u4e48?'),(0,l.kt)("p",null,'\u7b2c\u4e00\u4e2a\u9700\u8981\u95ee\u7684\u95ee\u9898\u662f\uff1a"Redux \u662f\u4ec0\u4e48\uff1f"'),(0,l.kt)("p",null,"Redux \u5b9e\u9645\u4e0a\u662f:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u5305\u542b\u5168\u5c40\u72b6\u6001\u7684\u5355\u4e00\u4ed3\u5e93"),(0,l.kt)("li",{parentName:"ul"},"\u5f53\u5e94\u7528\u4e2d\u53d1\u751f\u67d0\u4e9b\u4e8b\u60c5\u65f6\uff0c\u5206\u53d1\u666e\u901a\u5bf9\u8c61(plain object) \u52a8\u4f5c(action)\u7ed9\u4ed3\u5e93"),(0,l.kt)("li",{parentName:"ul"},"Pure reducer \u51fd\u6570\u67e5\u770b\u8fd9\u4e9b\u52a8\u4f5c(action)\u5e76\u4e14\u8fd4\u56de\u4e0d\u53ef\u66f4\u65b0\u7684\u72b6\u6001\u3002")),(0,l.kt)("p",null,"\u867d\u7136\u5e76\u975e\u5fc5\u987b\uff0c",(0,l.kt)("a",{parentName:"p",href:"/tutorials/fundamentals/part-7-standard-patterns"},"\u4f60\u7684 Redux \u4ee3\u7801\u901a\u5e38\u8fd8\u5305\u62ec"),":"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u521b\u5efa\u52a8\u4f5c\u5bf9\u8c61\u7684 action creator \u51fd\u6570"),(0,l.kt)("li",{parentName:"ul"},"\u542f\u7528\u526f\u4f5c\u7528(side effect)\u80fd\u529b\u7684\u4e2d\u95f4\u4ef6"),(0,l.kt)("li",{parentName:"ul"},"\u5305\u542b\u6709\u526f\u4f5c\u7528\u7684\u540c\u6b65\u6216\u5f02\u6b65\u903b\u8f91\u7684 thunk \u51fd\u6570"),(0,l.kt)("li",{parentName:"ul"},"\u80fd\u591f\u6309\u7167 ID \u67e5\u627e\u5143\u7d20\u7684\u6807\u51c6\u5316\u72b6\u6001"),(0,l.kt)("li",{parentName:"ul"},"\u4f7f\u7528 Reselect \u5e93\u4f18\u5316\u521b\u5efa\u7684\u9009\u62e9\u5668\u51fd\u6570"),(0,l.kt)("li",{parentName:"ul"},"\u4f7f\u7528 Redux DevTools Extension \u6765\u67e5\u770b\u52a8\u4f5c\u5386\u53f2\u8bb0\u5f55\u548c\u4fee\u6539\u72b6\u6001"),(0,l.kt)("li",{parentName:"ul"},"\u4f7f\u7528 TypeScript \u7ed9\u52a8\u4f5c\u3001\u72b6\u6001\u548c\u5176\u4ed6\u7684\u51fd\u6570\u8fdb\u884c\u7c7b\u578b\u5b9a\u4e49")),(0,l.kt)("p",null,"\u6b64\u5916\uff0cRedux \u901a\u5e38\u4e0e React-Redux \u5e93\u4e00\u8d77\u4f7f\u7528\u8ba9 React \u7ec4\u4ef6\u53ef\u4ee5\u8bbf\u95ee Redux store\u3002"),(0,l.kt)("h3",{id:"redux-\u6838\u5fc3\u5305\u505a\u4e86\u4ec0\u4e48"},"Redux \u6838\u5fc3\u5305\u505a\u4e86\u4ec0\u4e48?"),(0,l.kt)("p",null,"Redux \u6838\u5fc3\u5305\u662f\u4e00\u4e2a\u975e\u5e38\u5c0f\u3001\u6709\u610f\u907f\u514d\u4e3b\u89c2\u7acb\u573a\u7684\u5e93\u3002\u5b83\u63d0\u4f9b\u4e86\u4e00\u4e9b\u5c0f\u7684 API \u539f\u8bed:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"createStore")," \u5b9e\u9645\u521b\u5efa\u4e00\u4e2a Redux \u5b58\u50a8\u5b9e\u4f8b"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"combineReducers")," \u5c06\u591a\u4e2a reducer \u51fd\u6570\u5408\u5e76\u6210\u4e3a\u4e00\u4e2a\u66f4\u5927\u7684 reducer"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"applyMiddleware")," \u5c06\u591a\u4e2a\u4e2d\u95f4\u4ef6\u7ec4\u5408\u6210\u4e00\u4e2a store \u589e\u5f3a\u5668"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"compose")," \u5c06\u591a\u4e2a store \u589e\u5f3a\u5668\u5408\u5e76\u6210\u4e00\u4e2a\u5355\u4e00\u7684 store \u589e\u5f3a\u5668")),(0,l.kt)("p",null,"\u9664\u6b64\u4ee5\u5916\uff0c\u4f60\u5e94\u7528\u4e2d\u7684\u6240\u6709\u5176\u4ed6\u4e0e Redux \u76f8\u5173\u7684\u903b\u8f91\u5168\u9700\u8981\u4f60\u81ea\u5df1\u64b0\u5199\u3002"),(0,l.kt)("p",null,"\u597d\u6d88\u606f\u662f\uff0c\u8fd9\u610f\u5473\u7740 Redux \u80fd\u591f\u4ee5\u8bb8\u591a\u4e0d\u540c\u7684\u65b9\u5f0f\u4f7f\u7528\u3002\u574f\u6d88\u606f\u662f\uff0cRedux \u6838\u5fc3\u5305\u4e0d\u63d0\u4f9b\u4efb\u4f55\u8f85\u52a9\u51fd\u6570\u6765\u5e2e\u52a9\u4f60\u64b0\u5199\u4efb\u4f55\u4ee3\u7801\u3002"),(0,l.kt)("p",null,"\u4f8b\u5982\uff0creducer \u51fd\u6570\u53ea\u4e0d\u8fc7\u662f\u4e00\u4e2a\u666e\u901a\u7684\u51fd\u6570\u3002\u5728 Redux Toolkit \u4e4b\u524d\uff0c\u4f60\u901a\u5e38\u4f1a\u4f7f\u7528 switch \u8bed\u53e5\u548c\u624b\u52a8\u66f4\u65b0 state \u6765\u7f16\u5199 reducer\u3002\u4f60\u901a\u5e38\u8fd8\u9700\u8981\u624b\u5199\u52a8\u4f5c\u521b\u5efa\u5668\u51fd\u6570\u548c\u52a8\u4f5c\u7c7b\u578b\u53d8\u91cf:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="\u4f20\u7edf\u7684\u624b\u5199 Redux \u7528\u6cd5"',title:'"\u4f20\u7edf\u7684\u624b\u5199',Redux:!0,'\u7528\u6cd5"':!0},"const ADD_TODO = 'ADD_TODO'\nconst TODO_TOGGLED = 'TODO_TOGGLED'\n\nexport const addTodo = text => ({\n  type: ADD_TODO,\n  payload: { text, id: nanoid() }\n})\n\nexport const todoToggled = id => ({\n  type: TODO_TOGGLED,\n  payload: id\n})\n\nexport const todosReducer = (state = [], action) => {\n  switch (action.type) {\n    case ADD_TODO:\n      return state.concat({\n        id: action.payload.id,\n        text: action.payload.text,\n        completed: false\n      })\n    case TODO_TOGGLED:\n      return state.map(todo => {\n        if (todo.id !== action.payload.id) return todo\n\n        return {\n          ...todo,\n          completed: !todo.completed\n        }\n      })\n    default:\n      return state\n  }\n}\n")),(0,l.kt)("p",null,"\u8fd9\u4e9b\u4ee3\u7801\u4e0d\u4f9d\u8d56\u4e8e Redux \u5e93\u7684\u4efb\u4f55 API\u3002\u4f46\u662f\u8fd9\u6837\u9700\u8981\u5199\u5f88\u591a\u6837\u677f\u4ee3\u7801\u3002\u4e0d\u53ef\u53d8\u66f4\u65b0\u9700\u8981\u5f88\u591a\u624b\u5de5\u7f16\u5199\u7684\u5bf9\u8c61\u5c55\u5f00\u548c\u6570\u7ec4\u64cd\u4f5c\uff0c\u8fd9\u5f88\u5bb9\u6613\u51fa\u9519\u7136\u540e\u610f\u5916\u7684\u4fee\u6539\u72b6\u6001\uff08\u8fd9\u662fRedux bug \u7684\u9996\u8981\u539f\u56e0\uff09\u3002\u5c06\u4e00\u4e2a\u529f\u80fd\u7684\u4ee3\u7801\u5206\u6563\u5230\u591a\u4e2a\u6587\u4ef6\u4e5f\u5f88\u5e38\u89c1\uff0c\u867d\u7136\u4e0d\u662f\u5fc5\u987b\u7684\u3002\u4f8b\u5982 ",(0,l.kt)("inlineCode",{parentName:"p"},"actions/todos.js"),"\u3001 ",(0,l.kt)("inlineCode",{parentName:"p"},"constants/todos.js")," \u548c ",(0,l.kt)("inlineCode",{parentName:"p"},"reducers/todos.js"),"."),(0,l.kt)("p",null,"\u6b64\u5916\uff0c\u914d\u7f6e store \u901a\u5e38\u9700\u8981\u4e00\u7cfb\u5217\u6b65\u9aa4\u6765\u6dfb\u52a0\u5e38\u7528\u7684\u4e2d\u95f4\u4ef6\uff0c\u4f8b\u5982 thunk \u548c\u542f\u7528 Redux DevTools Extension \u652f\u6301\uff0c\u5c3d\u7ba1\u8fd9\u4e9b\u90fd\u662f\u51e0\u4e4e\u6bcf\u4e2a Redux \u5e94\u7528\u7a0b\u5e8f\u4e2d\u4f7f\u7528\u7684\u6807\u51c6\u5de5\u5177\u3002"),(0,l.kt)("h3",{id:"redux-toolkit-\u505a\u4e86\u54ea\u4e9b\u4e8b"},"Redux Toolkit \u505a\u4e86\u54ea\u4e9b\u4e8b?"),(0,l.kt)("p",null,"\u867d\u7136\u8fd9\u4e9b\u786e\u5b9e\u662f Redux \u6587\u6863\u4e2d\u6700\u65e9\u5c55\u793a\u7684\u6a21\u5f0f\uff0c\u4f46\u4e0d\u5e78\u7684\u662f\u5b83\u4eec\u9700\u8981\u5927\u91cf\u5197\u957f\u91cd\u590d\u7684\u4ee3\u7801\u3002\u8fd9\u4e9b\u6837\u677f\u6a21\u677f\u4ee3\u7801\u5728\u5b9e\u73b0 Redux \u529f\u80fd\u4e0a\u5e76\u4e0d\u5fc5\u8981\u3002\u6700\u91cd\u8981\u7684\u662f\uff0c\u8fd9\u4e9b\u6837\u677f\u4ee3\u7801\u4f1a\u63d0\u4f9b\u66f4\u591a\u72af\u9519\u7684\u673a\u4f1a\u3002"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"\u6211\u4eec\u7279\u610f\u521b\u5efa Redux Toolkit \u6765\u6d88\u9664\u624b\u5199 Redux \u903b\u8f91\u4e2d\u7684\u300c\u6837\u677f\u4ee3\u7801\u300d\uff0c\u9632\u6b62\u5e38\u89c1\u9519\u8bef\uff0c\u5e76\u63d0\u4f9b\u7b80\u5316\u6807\u51c6 Redux \u4efb\u52a1\u7684 API\u3002")),(0,l.kt)("p",null,"Redux Toolkit \u4ee5\u4e24\u4e2a\u5173\u952e\u7684 API \u5f00\u59cb\uff0c\u8fd9\u7b80\u5316\u4e86\u5728\u6bcf\u4e2a Redux \u5e94\u7528\u4e2d\u5e38\u89c1\u7684\u64cd\u4f5c\uff1a"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"configureStore")," \u901a\u8fc7\u5355\u4e2a\u51fd\u6570\u8c03\u7528\u8bbe\u7f6e\u4e00\u4e2a\u914d\u7f6e\u5b8c\u5584\u7684 Redux store\uff0c\u5305\u62ec\u5408\u5e76 reducer\u3001\u6dfb\u52a0 thunk \u4e2d\u95f4\u4ef6\u4ee5\u53ca\u8bbe\u7f6e Redux DevTools \u96c6\u6210\u3002\u4e0e ",(0,l.kt)("inlineCode",{parentName:"li"},"createStore")," \u76f8\u6bd4\u66f4\u5bb9\u6613\u914d\u7f6e\uff0c\u56e0\u4e3a\u5b83\u63a5\u53d7\u547d\u540d\u9009\u9879\u53c2\u6570\u3002"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"createSlice")," \u8ba9\u4f60\u4f7f\u7528 ",(0,l.kt)("a",{parentName:"li",href:"https://immerjs.github.io/immer/"},"Immer \u5e93"),' \u6765\u7f16\u5199 reducer\uff0c\u53ef\u4ee5\u4f7f\u7528 "mutating" JS \u8bed\u6cd5\uff0c\u6bd4\u5982 ',(0,l.kt)("inlineCode",{parentName:"li"},"state.value = 123"),"\uff0c\u4e0d\u9700\u8981\u4f7f\u7528\u62d3\u5c55\u8fd0\u7b97\u7b26\u3002 \u5185\u90e8\u57fa\u4e8e\u4f60\u7684 reducer \u540d\u79f0\u751f\u6210 action type \u5b57\u7b26\u4e32\u3002\u6700\u540e\uff0c\u5b83\u5728 TypeScript \u4e2d\u8868\u73b0\u7684\u5f88\u597d\u3002")),(0,l.kt)("p",null,"\u8fd9\u610f\u5473\u7740\u60a8\u9700\u8981\u7f16\u5199\u7684\u4ee3\u7801\u53ef\u4ee5\u5927\u5927\u7b80\u5316\u3002\u4f8b\u5982\uff0c\u76f8\u540c\u7684\u4efb\u52a1 reducer \u53ef\u4ee5\u5982\u4e0b\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="features/todos/todosSlice.js"',title:'"features/todos/todosSlice.js"'},"import { createSlice } from '@reduxjs/toolkit'\n\nconst todosSlice = createSlice({\n  name: 'todos',\n  initialState: [],\n  reducers: {\n    todoAdded(state, action) {\n      state.push({\n        id: action.payload.id,\n        text: action.payload.text,\n        completed: false\n      })\n    },\n    todoToggled(state, action) {\n      const todo = state.find(todo => todo.id === action.payload)\n      todo.completed = !todo.completed\n    }\n  }\n})\n\nexport const { todoAdded, todoToggled } = todosSlice.actions\nexport default todosSlice.reducer\n")),(0,l.kt)("p",null,"\u6240\u6709\u7684 action creators \u548c action types \u90fd\u81ea\u52a8\u751f\u6210\u4e86\uff0creducer \u4ee3\u7801\u4e5f\u66f4\u77ed\u66f4\u6613\u61c2\u3002\u5728\u6bcf\u4e2a case \u4e2d\u66f4\u6e05\u695a\u5730\u5c55\u793a\u4e86\u5b9e\u9645\u66f4\u65b0\u4e86\u54ea\u4e9b\u5185\u5bb9\uff0c\u6574\u4f53\u903b\u8f91\u4e5f\u66f4\u4e3a\u6e05\u6670\u3002"),(0,l.kt)("p",null,"\u4f7f\u7528 ",(0,l.kt)("inlineCode",{parentName:"p"},"configureStore"),"\uff0c\u53ef\u4ee5\u5c06store\u7684\u8bbe\u7f6e\u7b80\u5316\u4e3a\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="app/store.js"',title:'"app/store.js"'},"import { configureStore } from '@reduxjs/toolkit'\nimport todosReducer from '../features/todos/todosSlice'\nimport filtersReducer from '../features/filters/filtersSlice'\n\nexport const store = configureStore({\n  reducer: {\n    todos: todosReducer,\n    filters: filtersReducer\n  }\n})\n")),(0,l.kt)("p",null,"\u6ce8\u610f\uff0c",(0,l.kt)("strong",{parentName:"p"},"\u6b64 ",(0,l.kt)("inlineCode",{parentName:"strong"},"configureStore")," \u5373\u53ef\u81ea\u52a8\u5b8c\u6210\u8fc7\u53bb\u624b\u52a8\u5b8c\u6210\u7684\u5e38\u89c4\u914d\u7f6e\u5de5\u4f5c"),":"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"slice reducers \u81ea\u52a8\u4f20\u9012\u7ed9 ",(0,l.kt)("inlineCode",{parentName:"li"},"combineReducers()")),(0,l.kt)("li",{parentName:"ul"},"\u81ea\u52a8\u6dfb\u52a0\u4e86 ",(0,l.kt)("inlineCode",{parentName:"li"},"redux-thunk")," \u4e2d\u95f4\u4ef6"),(0,l.kt)("li",{parentName:"ul"},"\u6dfb\u52a0\u4e86 Dev-mode \u4e2d\u95f4\u4ef6\u6765\u6355\u83b7\u610f\u5916\u7684\u53d8\u66f4"),(0,l.kt)("li",{parentName:"ul"},"\u81ea\u52a8\u8bbe\u7f6e\u4e86 Redux DevTools Extension"),(0,l.kt)("li",{parentName:"ul"},"\u4e2d\u95f4\u4ef6\u548c DevTools \u589e\u5f3a\u5668\u88ab\u7ec4\u5408\u5728\u4e00\u8d77\u6dfb\u52a0\u5230\u4e86 store \u4e2d")),(0,l.kt)("p",null,"\u540c\u65f6\uff0c",(0,l.kt)("strong",{parentName:"p"},(0,l.kt)("inlineCode",{parentName:"strong"},"configureStore")," \u63d0\u4f9b\u4e86\u53ef\u9009\u9879\uff0c\u4f7f\u7528\u6237\u80fd\u591f\u4fee\u6539\u8fd9\u4e9b\u9ed8\u8ba4\u884c\u4e3a")," (\u5982\u5173\u95ed thunk \u5e76\u6dfb\u52a0 saga\uff0c\u6216\u5728\u751f\u4ea7\u73af\u5883\u4e2d\u7981\u7528 DevTools)\uff0c"),(0,l.kt)("p",null,"\u53e6\u5916\uff0cRedux Toolkit \u8fd8\u5305\u62ec\u5176\u4ed6\u7528\u4e8e\u5b8c\u6210\u5e38\u89c1 Redux \u4efb\u52a1\u7684 API:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"createAsyncThunk"),': \u62bd\u8c61"\u5f02\u6b65\u8bf7\u6c42\u524d\u540e\u5206\u53d1 action"\u7684\u6a21\u5f0f'),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"createEntityAdapter"),": \u63d0\u4f9b\u9884\u6784\u5efa\u7684 reducer \u548c selector \u7528\u4e8e\u7ba1\u7406\u89c4\u8303\u5316\u72b6\u6001\uff08normalized state\uff09\u7684 CRUD \u64cd\u4f5c"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"createSelector"),": \u91cd\u65b0\u5bfc\u51fa\u6807\u51c6\u7684 Reselect API \u7528\u4e8e\u6784\u5efa Memoized \u9009\u62e9\u5668"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"createListenerMiddleware"),": \u4e00\u4e2a\u526f\u4f5c\u7528\u4e2d\u95f4\u4ef6\uff0c\u7528\u4e8e\u54cd\u5e94\u5206\u53d1 action \u65f6\u4e4b\u884c\u67d0\u4e9b\u903b\u8f91")),(0,l.kt)("p",null,'\u6700\u540e\uff0cRTK \u5305\u8fd8\u5305\u542b"RTK Query"\uff0c\u4e00\u4e2a\u4e3a Redux \u5e94\u7528\u63d0\u4f9b\u7684\u5b8c\u6574\u7684\u6570\u636e\u83b7\u53d6\u548c\u7f13\u5b58\u89e3\u51b3\u65b9\u6848\uff0c\u4f5c\u4e3a\u72ec\u7acb\u7684\u53ef\u9009 ',(0,l.kt)("inlineCode",{parentName:"p"},"@reduxjs/toolkit/query")," \u5165\u53e3\u3002\u5b83\u5141\u8bb8\u4f60\u5b9a\u4e49\u7aef\u70b9\uff08REST\uff0cGraphQL\u6216\u4efb\u4f55\u5f02\u6b65\u51fd\u6570\uff09\u5e76\u751f\u6210 reducer \u548c\u4e2d\u95f4\u4ef6\u6765\u5b8c\u6574\u7ba1\u7406\u6570\u636e\u83b7\u53d6\uff0c\u52a0\u8f7d\u72b6\u6001\u66f4\u65b0\u548c\u7ed3\u679c\u7f13\u5b58\u3002\u5b83\u8fd8\u4f1a\u81ea\u52a8\u751f\u6210 React hooks\uff0c\u53ef\u7528\u4e8e\u7ec4\u4ef6\u83b7\u53d6\u6570\u636e\uff0c\u6bd4\u5982 ",(0,l.kt)("inlineCode",{parentName:"p"},"const { data, isFetching} = useGetPokemonQuery('pikachu')")),(0,l.kt)("p",null,"\u8fd9\u4e9b API \u90fd\u662f\u53ef\u9009\u7684\uff0c\u4e14\u6bcf\u4e2a API \u90fd\u662f\u4e3a\u7279\u5b9a\u7684\u4f7f\u7528\u60c5\u51b5\u8bbe\u8ba1\u7684\uff0c",(0,l.kt)("strong",{parentName:"p"},"\u4f60\u53ef\u4ee5\u6839\u636e\u81ea\u5df1\u7684\u9700\u8981\u5728\u5e94\u7528\u7a0b\u5e8f\u4e2d\u81ea\u7531\u9009\u62e9\u4f7f\u7528\u54ea\u4e9b API"),"\u3002 \u4f46\u662f\uff0c\u4e3a\u4e86\u66f4\u597d\u7684\u5b8c\u6210\u8fd9\u4e9b\u4efb\u52a1\uff0c\u6211\u4eec\u5f3a\u70c8\u5efa\u8bae\u60a8\u4f7f\u7528\u6240\u6709 API\u3002"),(0,l.kt)("p",null,"\u8bf7\u6ce8\u610f\uff0c",(0,l.kt)("strong",{parentName:"p"},'Redux Toolkit \u4ecd\u65e7\u662f "Redux"\uff01')," \u5b83\u4ecd\u7136\u6709\u4e00\u4e2a\u5355\u4e00\u7684 store\uff0c\u4f7f\u7528\u5206\u53d1\u52a8\u4f5c\u5bf9\u8c61\u8fdb\u884c\u66f4\u65b0\uff0c\u4e14\u5177\u6709\u53d8\u66f4\u72b6\u6001\u7684 reducer\uff0c\u6b64\u5916\u8fd8\u53ef\u4ee5\u7f16\u5199 thunk \u6765\u5904\u7406\u5f02\u6b65\u903b\u8f91\uff0c\u7ba1\u7406\u89c4\u8303\u5316\u7684\u72b6\u6001\uff0c\u7528 TypeScript \u7c7b\u578b\u5316\u4ee3\u7801\uff0c\u4f7f\u7528 DevTools\u3002",(0,l.kt)("strong",{parentName:"p"},"\u53ea\u4e0d\u8fc7\u5bf9\u4e8e\u76f8\u540c\u7684\u7ed3\u679c\u4f60\u9700\u8981\u5199\u66f4\u5c11\u7684\u4ee3\u7801\uff01")),(0,l.kt)("h2",{id:"\u4e3a\u4ec0\u4e48\u6211\u4eec\u63a8\u8350\u4f7f\u7528-redux-toolkit"},"\u4e3a\u4ec0\u4e48\u6211\u4eec\u63a8\u8350\u4f7f\u7528 Redux Toolkit"),(0,l.kt)("p",null,"\u4f5c\u4e3a Redux \u7684\u7ef4\u62a4\u8005\uff0c\u6211\u4eec\u7684\u7acb\u573a\u662f\uff1a"),(0,l.kt)("p",null,":::\u63d0\u793a"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"\u6211\u4eec\u8ba4\u4e3a\u6240\u6709\u4f7f\u7528 Redux \u7684\u5f00\u53d1\u8005\u90fd\u5e94\u8be5\u4f7f\u7528 Redux Toolkit \u6765\u7f16\u5199\u4ee3\u7801\uff0c\u56e0\u4e3a\u5b83\u80fd\u7b80\u5316\u4f60\u7684\u4ee3\u7801\u7684\u540c\u65f6\u6d88\u9664\u8bb8\u591a\u5e38\u89c1\u7684 Redux \u95ee\u9898\u548c Bug\uff01")),(0,l.kt)("p",null,":::"),(0,l.kt)("p",null,'\u65e9\u671f Redux \u6a21\u5f0f\u4e2d\u7684"\u6837\u677f\u4ee3\u7801"\u548c\u590d\u6742\u6027\u4ece\u6765\u5c31\u4e0d\u662f Redux \u4e0d\u53ef\u6216\u7f3a\u7684\u4e00\u90e8\u5206\u3002\u8fd9\u4e9b\u6a21\u5f0f\u5b58\u5728\u7684\u539f\u56e0\u662f\uff1a'),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},'\u65e9\u671f"Flux \u67b6\u6784"\u4e5f\u4f7f\u7528\u4e86\u8fd9\u4e9b\u76f8\u540c\u7684\u65b9\u6cd5'),(0,l.kt)("li",{parentName:"ul"},"\u65e9\u671f\u7684 Redux \u6587\u6863\u4e2d\u663e\u793a\u4e86\u50cf\u52a8\u4f5c\u7c7b\u578b\u5e38\u91cf\u4e4b\u7c7b\u7684\u4e1c\u897f\uff0c\u4ee5\u4fbf\u5c06\u4ee3\u7801\u6839\u636e\u7c7b\u578b\u5212\u5206\u5230\u4e0d\u540c\u7684\u6587\u4ef6\u4e2d"),(0,l.kt)("li",{parentName:"ul"},"\u7531\u4e8e JavaScript \u672c\u8d28\u4e0a\u662f mutable \u8bed\u8a00\uff0c\u6240\u4ee5\u7f16\u5199 immutable \u7684\u66f4\u65b0\u9700\u8981\u624b\u52a8\u8fdb\u884c\u5bf9\u8c61\u62d3\u5c55\u548c\u6570\u7ec4\u66f4\u65b0"),(0,l.kt)("li",{parentName:"ul"},"Redux \u521d\u59cb\u6784\u5efa\u53ea\u82b1\u4e86\u51e0\u4e2a\u661f\u671f\u7684\u65f6\u95f4\uff0c\u6545\u610f\u8bbe\u8ba1\u4e3a\u4ec5\u4ec5\u662f\u4e00\u7ec4\u57fa\u672c\u7684 API")),(0,l.kt)("p",null,"\u6b64\u5916\uff0cRedux \u793e\u533a\u91c7\u7528\u7684\u4e00\u4e9b\u7279\u5b9a\u65b9\u6cd5\u4f1a\u589e\u52a0\u989d\u5916\u7684\u6837\u677f\u4ee3\u7801\uff1a"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u63a8\u5d07\u4f7f\u7528 ",(0,l.kt)("inlineCode",{parentName:"li"},"redux-saga")," \u4e2d\u95f4\u4ef6\u4f5c\u4e3a\u5904\u7406\u526f\u4f5c\u7528\u7684\u60ef\u7528\u65b9\u6cd5"),(0,l.kt)("li",{parentName:"ul"},"\u575a\u6301\u624b\u52a8\u4e66\u5199 TypeScript \u7c7b\u578b\u6765\u4e3a Redux \u64cd\u4f5c\u5bf9\u8c61\u6dfb\u52a0\u7c7b\u578b\uff0c\u521b\u5efa\u8054\u5408\u7c7b\u578b\u6765\u5728\u7c7b\u578b\u7ea7\u522b\u9650\u5236\u53ef\u4ee5\u5206\u53d1\u7684\u52a8\u4f5c")),(0,l.kt)("p",null,"\u591a\u5e74\u6765\uff0c\u6211\u4eec\u770b\u5230\u4eba\u4eec\u7a76\u7adf\u5982\u4f55\u5728\u5b9e\u9645\u60c5\u51b5\u4e2d\u4f7f\u7528 Redux\u3002\u6211\u4eec\u770b\u5230\u793e\u533a\u4e3a\u751f\u6210\u64cd\u4f5c\u7c7b\u578b\u3001creators\u3001\u5f02\u6b65\u903b\u8f91\u3001\u526f\u4f5c\u7528\u548c\u6570\u636e\u83b7\u53d6\u7b49\u4efb\u52a1\u7f16\u5199\u4e86\u6570\u767e\u4e2a\u63d2\u4ef6\u5e93\u3002\u6211\u4eec\u8fd8\u770b\u5230\u4e00\u76f4\u7ed9\u6211\u4eec\u7684\u7528\u6237\u5e26\u6765\u75db\u82e6\u7684\u95ee\u9898\uff0c\u6bd4\u5982\u610f\u5916\u7684\u6539\u53d8\u72b6\u6001\uff0c\u4ec5\u4e3a\u8ba9\u4e00\u4e2a\u7b80\u5355\u7684\u72b6\u6001\u66f4\u65b0\u800c\u5199\u4e86\u6570\u5341\u884c\u4ee3\u7801\u3001\u5e76\u4e14\u5f88\u96be\u8ffd\u8e2a\u4ee3\u7801\u5e93\u5982\u4f55\u878d\u5408\u5728\u4e00\u8d77\u3002\u6211\u4eec\u5e2e\u52a9\u8fc7\u6210\u5343\u4e0a\u4e07\u7684\u7528\u6237\u5728\u8bd5\u56fe\u5b66\u4e60\u548c\u4f7f\u7528 Redux \u65f6\u611f\u5230\u56f0\u60d1\uff0c\u96be\u4ee5\u7406\u89e3\u6240\u6709\u90e8\u5206\u5982\u4f55\u5951\u5408\uff0c\u5e76\u4e14\u88ab\u9700\u8981\u7f16\u5199\u7684\u989d\u5916\u4ee3\u7801\u6570\u91cf\u548c\u5fc5\u8981\u7406\u89e3\u7684\u6982\u5ff5\u6240\u56f0\u6270\u3002\u6211\u4eec",(0,l.kt)("strong",{parentName:"p"},"\u77e5\u9053"),"\u6211\u4eec\u7684\u7528\u6237\u9762\u4e34\u7684\u95ee\u9898\u3002"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"\u6211\u4eec\u7279\u522b\u4e3a\u89e3\u51b3\u8fd9\u4e9b\u95ee\u9898\u8bbe\u8ba1\u4e86 Redux Toolkit\uff01")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"Redux Toolkit \u901a\u8fc7\u5355\u4e00\u6e05\u6670\u7684\u51fd\u6570\u8c03\u7528\u7b80\u5316 store \u8bbe\u7f6e\uff0c\u540c\u65f6\u4fdd\u7559\u5b8c\u5168\u914d\u7f6e store \u9009\u9879\u7684\u80fd\u529b\uff08\u5982\u679c\u9700\u8981\u7684\u8bdd\uff09"),(0,l.kt)("li",{parentName:"ul"},"Redux Toolkit \u6d88\u9664\u610f\u5916\u7684 mutations\uff0c\u8fd9\u4e00\u76f4\u662f Redux bug \u7684\u9996\u8981\u539f\u56e0"),(0,l.kt)("li",{parentName:"ul"},"Redux Toolkit \u6d88\u9664\u4e86\u624b\u5199\u4efb\u4f55 action creator \u6216 action type \u7684\u9700\u6c42"),(0,l.kt)("li",{parentName:"ul"},"Redux Toolkit \u6d88\u9664\u4e86\u7f16\u5199\u5bb9\u6613\u51fa\u9519\u7684\u624b\u52a8\u4e0d\u53ef\u53d8\u66f4\u65b0\u903b\u8f91\u7684\u9700\u6c42"),(0,l.kt)("li",{parentName:"ul"},"Redux Toolkit \u8ba9\u4f60\u53ef\u4ee5\u628a Redux \u76f8\u5173\u7684\u4ee3\u7801\u5168\u90e8\u653e\u5728\u4e00\u4e2a\u6587\u4ef6\u4e2d\uff0c\u800c\u4e0d\u662f\u5206\u5e03\u5728\u591a\u4e2a\u72ec\u7acb\u6587\u4ef6\u4e2d"),(0,l.kt)("li",{parentName:"ul"},"Redux Toolkit \u63d0\u4f9b\u4f18\u79c0\u7684 TypeScript \u652f\u6301\uff0c\u5176 API \u88ab\u8bbe\u8ba1\u6210\u53ef\u4ee5\u7ed9\u4f60\u5f88\u597d\u7684\u7c7b\u578b\u5b89\u5168\u6027\uff0c\u540c\u65f6\u51cf\u5c11\u4f60\u4ee3\u7801\u4e2d\u9700\u8981\u5b9a\u4e49\u7684\u7c7b\u578b\u6570\u91cf"),(0,l.kt)("li",{parentName:"ul"},"RTK Query \u53ef\u4ee5\u6d88\u9664\u7f16\u5199\u4efb\u4f55 thunk\u3001reducer\u3001action creator \u6216\u8005 \u526f\u4f5c\u7528\u94a9\u5b50\u6765\u7ba1\u7406\u6570\u636e\u83b7\u53d6\u548c\u8ddf\u8e2a\u52a0\u8f7d\u72b6\u6001\u7684\u9700\u6c42")),(0,l.kt)("p",null,"\u6b63\u56e0\u4e3a\u5982\u6b64:"),(0,l.kt)("p",null,":::\u63d0\u793a"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"\u6211\u4eec\u7279\u522b\u5efa\u8bae\u6211\u4eec\u7684\u7528\u6237\u4f7f\u7528 Redux Toolkit (",(0,l.kt)("inlineCode",{parentName:"strong"},"@reduxjs/toolkit")," \u5305)\uff0c\u4e0d\u5efa\u8bae\u5728\u65b0\u7684 Redux \u4ee3\u7801\u4e2d\u4f7f\u7528\u65e7\u7684 ",(0,l.kt)("inlineCode",{parentName:"strong"},"Redux")," \u6838\u5fc3\u5305\uff01")),(0,l.kt)("p",null,":::"),(0,l.kt)("p",null,"\u5373\u4f7f\u5bf9\u4e8e\u73b0\u6709\u7684\u9879\u76ee\uff0c\u6211\u4eec\u4e5f\u5efa\u8bae\u81f3\u5c11\u628a ",(0,l.kt)("inlineCode",{parentName:"p"},"createStore"),"\u66ff\u6362\u4e3a ",(0,l.kt)("inlineCode",{parentName:"p"},"configureStore")," \u56e0\u4e3a\u5f00\u53d1\u6a21\u5f0f\u7684\u4e2d\u95f4\u4ef6\u4e5f\u5c06\u5e2e\u52a9\u60a8\u6355\u6349\u73b0\u6709\u4ee3\u7801\u5e93\u4e2d\u7684\u610f\u5916\u53d8\u5f02\u548c\u53ef\u5e8f\u5217\u5316\u9519\u8bef\u3002\u6211\u4eec\u8fd8\u9f13\u52b1\u60a8\u5c06\u4f7f\u7528\u9891\u7387\u8f83\u9ad8\u7684\uff08\u4ee5\u53ca\u4eca\u540e\u60a8\u7f16\u5199\u7684\uff09reducer \u5207\u6362\u5230 ",(0,l.kt)("inlineCode",{parentName:"p"},"createSlice")," - \u4ee3\u7801\u66f4\u77ed\u66f4\u6613\u61c2\uff0c\u5b89\u5168\u6027\u63d0\u9ad8\u4e5f\u4f1a\u5e2e\u52a9\u60a8\u5c06\u6765\u8282\u7701\u65f6\u95f4\u548c\u7cbe\u529b\u3002"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},(0,l.kt)("inlineCode",{parentName:"strong"},"redux")," \u6838\u5fc3\u5305\u4ecd\u7136\u53ef\u4ee5\u5de5\u4f5c\uff0c\u4f46\u662f\u4eca\u5929\u6765\u770b\u6211\u4eec\u8ba4\u4e3a\u5b83\u5df2\u7ecf\u8fc7\u65f6\u4e86"),". \u5b83\u7684\u6240\u6709 API \u4e5f\u90fd\u4ece",(0,l.kt)("inlineCode",{parentName:"p"},"@reduxjs/toolkit")," \u4e2d\u8fdb\u884c\u4e86\u91cd\u65b0\u5bfc\u51fa\uff0c\u5e76\u4e14 ",(0,l.kt)("inlineCode",{parentName:"p"},"configureStore")," \u51fd\u6570\u53ef\u4ee5\u5b8c\u6210 ",(0,l.kt)("inlineCode",{parentName:"p"},"createStore")," \u7684\u6240\u6709\u5de5\u4f5c\uff0c\u4f46\u662f\u6709\u7740\u66f4\u597d\u7684\u9ed8\u8ba4\u884c\u4e3a\u548c\u53ef\u914d\u7f6e\u6027\u3002"),(0,l.kt)("p",null,"\u7406\u89e3\u57fa\u7840\u6982\u5ff5\u80fd\u591f\u5e2e\u52a9\u4f60\u7406\u89e3 Redux Toolkit \u4e3a\u4f60\u505a\u4e86\u4ec0\u4e48\u3002\u8fd9\u5c31\u662f\u4e3a\u4ec0\u4e48 ",(0,l.kt)("a",{parentName:"p",href:"/tutorials/fundamentals/part-1-overview"},'"Redux \u57fa\u7840" \u6559\u7a0b \u6ca1\u6709\u4efb\u4f55\u62bd\u8c61\u7684\u5c55\u793a\u4e86 Redux \u7684\u5de5\u4f5c\u539f\u7406'),". \u4f46\u662f\uff0c\u5b83\u5c55\u793a\u7684\u8fd9\u4e9b\u4f8b\u5b50\u53ea\u80fd\u4f5c\u4e3a\u5b66\u4e60\u5de5\u5177\uff0c\u5e76\u4ee5\u5c55\u793a Redux Toolkit \u5982\u4f55\u7b80\u5316\u65e7\u7684\u624b\u5199 Redux \u4ee3\u7801\u6765\u7ed3\u675f\u3002"),(0,l.kt)("p",null,"\u5982\u679c\u4f60\u76ee\u524d\u6b63\u5728\u4f7f\u7528\u4e14\u53ea\u662f\u4f7f\u7528\u4e86 ",(0,l.kt)("inlineCode",{parentName:"p"},"redux")," \u5305\uff0c\u4f60\u7684\u4ee3\u7801\u4ecd\u7136\u53ef\u4ee5\u5de5\u4f5c ",(0,l.kt)("strong",{parentName:"p"},"\u4f46\u662f\uff0c\u6211\u4eec\u5f3a\u70c8\u63a8\u8350\u4f60\u5207\u6362\u5230 ",(0,l.kt)("inlineCode",{parentName:"strong"},"@reduxjs/toolkit"),"\uff0c\u5e76\u66f4\u65b0\u4f60\u7684\u4ee3\u7801\u6765\u4f7f\u7528 Redux Toolkit \u7684 API")),(0,l.kt)("h2",{id:"\u66f4\u591a\u4fe1\u606f"},"\u66f4\u591a\u4fe1\u606f"),(0,l.kt)("p",null,"\u67e5\u770b\u4ee5\u4e0b\u6587\u6863\u9875\u9762\u548c\u535a\u5ba2\u6587\u7ae0\u4e86\u89e3\u66f4\u591a\u7ec6\u8282"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"/tutorials/essentials/part-2-app-structure"},"Redux \u5fc5\u5907: Redux \u5e94\u7528\u7ed3\u6784")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"/tutorials/fundamentals/part-8-modern-redux"},"Redux \u57fa\u7840: \u4f7f\u7528 Redux Toolkit \u7684\u73b0\u4ee3 Redux")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"/style-guide/"},"Redux \u98ce\u683c\u6307\u5357: \u6700\u4f73\u5b9e\u8df5\u548c\u5efa\u8bae")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://blog.isquaredsoftware.com/2019/10/redux-toolkit-1.0/"},"Mark Erikson: Redux Toolkit 1.0 \u516c\u544a\u548c\u5f00\u53d1\u5386\u53f2"))))}c.isMDXComponent=!0}}]);