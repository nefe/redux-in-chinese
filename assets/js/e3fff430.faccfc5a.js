"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4943],{3905:function(e,r,t){t.d(r,{Zo:function(){return s},kt:function(){return f}});var n=t(7294);function i(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function u(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function c(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?u(Object(t),!0).forEach((function(r){i(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):u(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function a(e,r){if(null==e)return{};var t,n,i=function(e,r){if(null==e)return{};var t,n,i={},u=Object.keys(e);for(n=0;n<u.length;n++)t=u[n],r.indexOf(t)>=0||(i[t]=e[t]);return i}(e,r);if(Object.getOwnPropertySymbols){var u=Object.getOwnPropertySymbols(e);for(n=0;n<u.length;n++)t=u[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var o=n.createContext({}),l=function(e){var r=n.useContext(o),t=r;return e&&(t="function"==typeof e?e(r):c(c({},r),e)),t},s=function(e){var r=l(e.components);return n.createElement(o.Provider,{value:r},e.children)},d={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},p=n.forwardRef((function(e,r){var t=e.components,i=e.mdxType,u=e.originalType,o=e.parentName,s=a(e,["components","mdxType","originalType","parentName"]),p=l(t),f=i,m=p["".concat(o,".").concat(f)]||p[f]||d[f]||u;return t?n.createElement(m,c(c({ref:r},s),{},{components:t})):n.createElement(m,c({ref:r},s))}));function f(e,r){var t=arguments,i=r&&r.mdxType;if("string"==typeof e||i){var u=t.length,c=new Array(u);c[0]=p;var a={};for(var o in r)hasOwnProperty.call(r,o)&&(a[o]=r[o]);a.originalType=e,a.mdxType="string"==typeof e?e:i,c[1]=a;for(var l=2;l<u;l++)c[l]=t[l];return n.createElement.apply(null,c)}return n.createElement.apply(null,t)}p.displayName="MDXCreateElement"},5838:function(e,r,t){t.r(r),t.d(r,{assets:function(){return s},contentTitle:function(){return o},default:function(){return f},frontMatter:function(){return a},metadata:function(){return l},toc:function(){return d}});var n=t(7462),i=t(3366),u=(t(7294),t(3905)),c=["components"],a={id:"splitting-reducer-logic",title:"\u62c6\u5206 Reducer \u903b\u8f91",description:"Structuring Reducers > \u62c6\u5206 Reducer \u903b\u8f91: Terms for different reducer use cases",hide_title:!1},o="\u62c6\u5206 Reducer \u903b\u8f91",l={unversionedId:"usage/structuring-reducers/splitting-reducer-logic",id:"usage/structuring-reducers/splitting-reducer-logic",title:"\u62c6\u5206 Reducer \u903b\u8f91",description:"Structuring Reducers > \u62c6\u5206 Reducer \u903b\u8f91: Terms for different reducer use cases",source:"@site/../docs/usage/structuring-reducers/SplittingReducerLogic.md",sourceDirName:"usage/structuring-reducers",slug:"/usage/structuring-reducers/splitting-reducer-logic",permalink:"/usage/structuring-reducers/splitting-reducer-logic",draft:!1,tags:[],version:"current",frontMatter:{id:"splitting-reducer-logic",title:"\u62c6\u5206 Reducer \u903b\u8f91",description:"Structuring Reducers > \u62c6\u5206 Reducer \u903b\u8f91: Terms for different reducer use cases",hide_title:!1},sidebar:"docs",previous:{title:"Reducer \u7684\u57fa\u672c\u7ed3\u6784",permalink:"/usage/structuring-reducers/basic-reducer-structure"},next:{title:"\u91cd\u6784 Reducer \u7684\u4f8b\u5b50",permalink:"/usage/structuring-reducers/refactoring-reducer-example"}},s={},d=[],p={toc:d};function f(e){var r=e.components,t=(0,i.Z)(e,c);return(0,u.kt)("wrapper",(0,n.Z)({},p,t,{components:r,mdxType:"MDXLayout"}),(0,u.kt)("h1",{id:"\u62c6\u5206-reducer-\u903b\u8f91"},"\u62c6\u5206 Reducer \u903b\u8f91"),(0,u.kt)("p",null,"\u5bf9\u4e8e\u4efb\u4f55\u4e00\u4e2a\u6709\u610f\u4e49\u7684\u5e94\u7528\u6765\u8bf4\uff0c\u5c06\u6240\u6709\u7684\u66f4\u65b0\u903b\u8f91\u90fd\u653e\u5165\u5230\u5355\u4e2a reducer \u51fd\u6570\u4e2d\u90fd\u5c06\u4f1a\u8ba9\u7a0b\u5e8f\u53d8\u5f97\u4e0d\u53ef\u7ef4\u62a4\u3002\u867d\u7136\u8bf4\u5bf9\u4e8e\u4e00\u4e2a\u51fd\u6570\u5e94\u8be5\u6709\u591a\u957f\u6ca1\u6709\u51c6\u786e\u7684\u89c4\u5b9a\uff0c\u4f46\u4e00\u822c\u6765\u8bb2\uff0c\u51fd\u6570\u5e94\u8be5\u6bd4\u8f83\u77ed\uff0c\u5e76\u4e14\u53ea\u505a\u4e00\u4ef6\u7279\u5b9a\u7684\u4e8b\u3002\u56e0\u6b64\uff0c\u628a\u5f88\u957f\u7684\uff0c\u540c\u65f6\u8d1f\u8d23\u5f88\u591a\u4e8b\u7684\u4ee3\u7801\u62c6\u5206\u6210\u5bb9\u6613\u7406\u89e3\u7684\u5c0f\u7247\u6bb5\u662f\u4e00\u4e2a\u5f88\u597d\u7684\u7f16\u7a0b\u65b9\u5f0f\u3002"),(0,u.kt)("p",null,"\u56e0\u4e3a Redux reducer \u4e5f\u4ec5\u4ec5\u662f\u4e00\u4e2a\u51fd\u6570\uff0c\u4e0a\u9762\u7684\u6982\u5ff5\u4e5f\u9002\u7528\u3002\u4f60\u53ef\u4ee5\u5c06 reducer \u4e2d\u7684\u4e00\u4e9b\u903b\u8f91\u62c6\u5206\u51fa\u53bb\uff0c\u7136\u540e\u5728\u7236\u51fd\u6570\u4e2d\u8c03\u7528\u8fd9\u4e2a\u65b0\u7684\u51fd\u6570\u3002"),(0,u.kt)("p",null,"\u8fd9\u4e9b\u65b0\u7684\u51fd\u6570\u901a\u5e38\u5206\u4e3a\u4e09\u7c7b\uff1a"),(0,u.kt)("ol",null,(0,u.kt)("li",{parentName:"ol"},"\u4e00\u4e9b\u5c0f\u7684\u5de5\u5177\u51fd\u6570\uff0c\u5305\u542b\u4e00\u4e9b\u53ef\u91cd\u7528\u7684\u903b\u8f91\u7247\u6bb5"),(0,u.kt)("li",{parentName:"ol"},"\u7528\u4e8e\u5904\u7406\u7279\u5b9a\u60c5\u51b5\u4e0b\u7684\u6570\u636e\u66f4\u65b0\u7684\u51fd\u6570\uff0c\u53c2\u6570\u9664\u4e86 ",(0,u.kt)("inlineCode",{parentName:"li"},"(state, action)")," \u4e4b\u5916\uff0c\u901a\u5e38\u8fd8\u5305\u62ec\u5176\u5b83\u53c2\u6570"),(0,u.kt)("li",{parentName:"ol"},"\u5904\u7406\u7ed9\u5b9a state \u5207\u7247\u7684\u6240\u6709\u66f4\u65b0\u7684\u51fd\u6570\uff0c\u53c2\u6570\u683c\u5f0f\u901a\u5e38\u4e3a ",(0,u.kt)("inlineCode",{parentName:"li"},"(state, action)"))),(0,u.kt)("p",null,"\u4e3a\u4e86\u6e05\u695a\u8d77\u89c1\uff0c\u8fd9\u4e9b\u672f\u8bed\u5c06\u7528\u4e8e\u533a\u5206\u4e0d\u540c\u7c7b\u578b\u7684\u529f\u80fd\u548c\u4e0d\u540c\u7684\u7528\u4f8b\uff1a"),(0,u.kt)("ul",null,(0,u.kt)("li",{parentName:"ul"},(0,u.kt)("strong",{parentName:"li"},"reducer:")," \u4efb\u4f55\u7b26\u5408 ",(0,u.kt)("inlineCode",{parentName:"li"},"(state, action) -> newState")," \u683c\u5f0f\u7684\u51fd\u6570\uff08\u5373\uff0c\u53ef\u4ee5\u7528\u505a ",(0,u.kt)("inlineCode",{parentName:"li"},"Array.reducer")," \u53c2\u6570\u7684\u4efb\u4f55\u51fd\u6570\uff09\u3002"),(0,u.kt)("li",{parentName:"ul"},(0,u.kt)("strong",{parentName:"li"},"root reducer:")," \u901a\u5e38\u4f5c\u4e3a ",(0,u.kt)("inlineCode",{parentName:"li"},"createStore")," \u7b2c\u4e00\u4e2a\u53c2\u6570\u7684\u51fd\u6570\u3002\u4ed6\u662f\u552f\u4e00\u7684\u4e00\u4e2a\u5728\u6240\u6709\u7684 reducer \u51fd\u6570\u4e2d\u5fc5\u987b\u7b26\u5408 ",(0,u.kt)("inlineCode",{parentName:"li"},"(state, action) -> newState")," \u683c\u5f0f\u7684\u51fd\u6570\u3002"),(0,u.kt)("li",{parentName:"ul"},(0,u.kt)("strong",{parentName:"li"},"slice reducer:")," \u4e00\u4e2a\u8d1f\u8d23\u5904\u7406\u72b6\u6001\u6811\u4e2d\u4e00\u5757\u5207\u7247\u6570\u636e\u7684\u51fd\u6570\uff0c\u901a\u5e38\u4f1a\u4f5c\u4e3a ",(0,u.kt)("inlineCode",{parentName:"li"},"combineReducers")," \u51fd\u6570\u7684\u53c2\u6570\u3002"),(0,u.kt)("li",{parentName:"ul"},(0,u.kt)("strong",{parentName:"li"},"case function:")," \u4e00\u4e2a\u8d1f\u8d23\u5904\u7406\u7279\u6b8a action \u7684\u66f4\u65b0\u903b\u8f91\u7684\u51fd\u6570\u3002\u53ef\u80fd\u5c31\u662f\u4e00\u4e2a reducer \u51fd\u6570\uff0c\u4e5f\u53ef\u80fd\u9700\u8981\u5176\u4ed6\u53c2\u6570\u624d\u80fd\u6b63\u5e38\u5de5\u4f5c\u3002"),(0,u.kt)("li",{parentName:"ul"},(0,u.kt)("strong",{parentName:"li"},"higher-order reducer:")," \u4e00\u4e2a\u4ee5 reducer \u51fd\u6570\u4f5c\u4e3a\u53c2\u6570\uff0c\u4e14/\u6216\u8fd4\u56de\u4e00\u4e2a\u65b0\u7684 reducer \u51fd\u6570\u7684\u51fd\u6570\uff08\u6bd4\u5982\uff1a ",(0,u.kt)("inlineCode",{parentName:"li"},"combineReducers"),", ",(0,u.kt)("inlineCode",{parentName:"li"},"redux-undo"),"\uff09\u3002")),(0,u.kt)("p",null,'\u5728\u5404\u79cd\u8ba8\u8bba\u4e2d \u201csub-reducer\u201d \u8fd9\u4e2a\u672f\u8bed\u901a\u5e38\u8868\u793a\u90a3\u4e9b\u4e0d\u662f root reducer \u7684\u4efb\u4f55\u51fd\u6570\uff0c\u4f46\u8fd9\u4e2a\u8868\u8ff0\u5e76\u4e0d\u662f\u5f88\u7cbe\u786e\u3002\u4e00\u4e9b\u4eba\u8ba4\u4e3a\u5e94\u8be5\u8868\u793a "\u4e1a\u52a1\u903b\u8f91\uff08business logic\uff09" \uff08\u4e0e\u5e94\u7528\u7a0b\u5e8f\u7279\u5b9a\u884c\u4e3a\u76f8\u5173\u7684\u529f\u80fd\uff09\u6216\u8005 \u201c\u5de5\u5177\u51fd\u6570\uff08utility functions\uff09\u201d\uff08\u975e\u5e94\u7528\u7a0b\u5e8f\u7279\u5b9a\u7684\u901a\u7528\u529f\u80fd\uff09\u3002'),(0,u.kt)("p",null,"\u5c06\u590d\u6742\u7684\u73af\u5883\u5206\u89e3\u4e3a\u66f4\u5c0f\uff0c\u66f4\u6613\u4e8e\u7406\u89e3\u7684\u8fc7\u7a0b\u5c31\u662f\u672f\u8bed\u4e2d\u7684 ",(0,u.kt)("a",{parentName:"p",href:"http://stackoverflow.com/questions/947874/what-is-functional-decomposition"},"\u51fd\u6570\u5206\u89e3(functional decomposition)"),"\u3002\u8fd9\u4e2a\u672f\u8bed\u53ef\u4ee5\u7528\u5728\u4efb\u4f55\u4ee3\u7801\u4e2d\u3002\u5728 Redux \u4e2d\uff0c\u4f7f\u7528\u7b2c\u4e09\u4e2a\u65b9\u6cd5\u6765\u6784\u9020 reducer \u903b\u8f91\u662f\u975e\u5e38\u666e\u904d\u7684\uff0c\u5373\u66f4\u65b0\u903b\u8f91\u88ab\u59d4\u6258\u5728\u57fa\u4e8e state \u5207\u7247\u7684\u7684\u5176\u4ed6\u51fd\u6570\u4e2d\u3002Redux \u5c06\u8fd9\u4e2a\u6982\u5ff5\u79f0\u4e3a ",(0,u.kt)("strong",{parentName:"p"},"reducer composition"),"\uff0c\u5230\u76ee\u524d\u4e3a\u6b62\uff0c\u8fd9\u4e2a\u65b9\u6cd5\u662f\u6784\u5efa reducer \u903b\u8f91\u6700\u5e38\u7528\u7684\u65b9\u6cd5\u3002\u4e8b\u5b9e\u4e0a\uff0c Redux \u5305\u542b\u4e00\u4e2a ",(0,u.kt)("a",{parentName:"p",href:"/api/combinereducers"},(0,u.kt)("inlineCode",{parentName:"a"},"combineReducers()"))," \u7684\u5de5\u5177\u51fd\u6570\uff0c\u5b83\u4e13\u95e8\u62bd\u8c61\u5316\u57fa\u4e8e state \u5207\u7247\u7684\u5176\u4ed6 reducer \u51fd\u6570\u7684\u5de5\u4f5c\u8fc7\u7a0b\u3002\u4f46\u662f\u4f60\u5fc5\u987b\u660e\u786e\u7684\u662f\uff0c\u8fd9\u5e76\u4e0d\u662f\u552f\u4e00\u6a21\u5f0f\u3002\u5b9e\u9645\u4e0a\uff0c\u5b8c\u5168\u53ef\u4ee5\u7528\u6240\u6709\u7684\u4e09\u79cd\u65b9\u6cd5\u62c6\u5206\u903b\u8f91\uff0c\u901a\u5e38\u60c5\u51b5\u4e0b\uff0c\u8fd9\u4e5f\u662f\u4e00\u4e2a\u597d\u4e3b\u610f\u3002",(0,u.kt)("a",{parentName:"p",href:"/usage/structuring-reducers/refactoring-reducer-example"},"Refactoring Reducers")," \u7ae0\u8282\u4f1a\u6f14\u793a\u4e00\u4e9b\u5b9e\u4f8b\u3002"))}f.isMDXComponent=!0}}]);