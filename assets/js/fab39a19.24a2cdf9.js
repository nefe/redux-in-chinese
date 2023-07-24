"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[3967],{3905:function(e,t,a){a.d(t,{Zo:function(){return s},kt:function(){return d}});var r=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},i=Object.keys(e);for(r=0;r<i.length;r++)a=i[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)a=i[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var c=r.createContext({}),u=function(e){var t=r.useContext(c),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},s=function(e){var t=u(e.components);return r.createElement(c.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,i=e.originalType,c=e.parentName,s=o(e,["components","mdxType","originalType","parentName"]),m=u(a),d=n,k=m["".concat(c,".").concat(d)]||m[d]||p[d]||i;return a?r.createElement(k,l(l({ref:t},s),{},{components:a})):r.createElement(k,l({ref:t},s))}));function d(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=a.length,l=new Array(i);l[0]=m;var o={};for(var c in t)hasOwnProperty.call(t,c)&&(o[c]=t[c]);o.originalType=e,o.mdxType="string"==typeof e?e:n,l[1]=o;for(var u=2;u<i;u++)l[u]=a[u];return r.createElement.apply(null,l)}return r.createElement.apply(null,a)}m.displayName="MDXCreateElement"},5778:function(e,t,a){a.d(t,{s:function(){return n}});var r=a(7294),n=function(e){var t=e.children,a=e.title,n=void 0===a?"Detailed Explanation":a;return r.createElement("details",{className:"detailed-explanation"},r.createElement("summary",null,r.createElement("h4",null,n)),t)}},9347:function(e,t,a){a.r(t),a.d(t,{assets:function(){return p},contentTitle:function(){return u},default:function(){return k},frontMatter:function(){return c},metadata:function(){return s},toc:function(){return m}});var r=a(7462),n=a(3366),i=(a(7294),a(3905)),l=a(5778),o=["components"],c={id:"code-structure",title:"Code Structure",hide_title:!1},u="Redux FAQ: \u4ee3\u7801\u7ed3\u6784",s={unversionedId:"faq/code-structure",id:"faq/code-structure",title:"Code Structure",description:"\u76ee\u5f55",source:"@site/../docs/faq/CodeStructure.md",sourceDirName:"faq",slug:"/faq/code-structure",permalink:"/faq/code-structure",draft:!1,tags:[],version:"current",frontMatter:{id:"code-structure",title:"Code Structure",hide_title:!1},sidebar:"docs",previous:{title:"Immutable Data",permalink:"/faq/immutable-data"},next:{title:"Performance",permalink:"/faq/performance"}},p={},m=[{value:"\u76ee\u5f55",id:"\u76ee\u5f55",level:2},{value:"\u6211\u7684\u6587\u4ef6\u7ed3\u6784\u5e94\u8be5\u662f\u4ec0\u4e48\u6837\u7684\uff1f\u5e94\u8be5\u5982\u4f55\u5728\u9879\u76ee\u4e2d\u5bf9 action creator \u548c reducer \u8fdb\u884c\u5206\u7ec4\uff1fselector\u5e94\u8be5\u653e\u5728\u54ea\u91cc\uff1f",id:"\u6211\u7684\u6587\u4ef6\u7ed3\u6784\u5e94\u8be5\u662f\u4ec0\u4e48\u6837\u7684\u5e94\u8be5\u5982\u4f55\u5728\u9879\u76ee\u4e2d\u5bf9-action-creator-\u548c-reducer-\u8fdb\u884c\u5206\u7ec4selector\u5e94\u8be5\u653e\u5728\u54ea\u91cc",level:2},{value:"\u66f4\u591a\u4fe1\u606f",id:"\u66f4\u591a\u4fe1\u606f",level:4},{value:"\u6211\u5e94\u8be5\u5982\u4f55\u5728 reducer \u548c action creator \u4e4b\u95f4\u5212\u5206\u903b\u8f91\uff1f\u201c\u4e1a\u52a1\u903b\u8f91\u201d\u5e94\u8be5\u653e\u5728\u54ea\u91cc\uff1f",id:"\u6211\u5e94\u8be5\u5982\u4f55\u5728-reducer-\u548c-action-creator-\u4e4b\u95f4\u5212\u5206\u903b\u8f91\u4e1a\u52a1\u903b\u8f91\u5e94\u8be5\u653e\u5728\u54ea\u91cc",level:2},{value:"\u66f4\u591a\u7684\u4fe1\u606f",id:"\u66f4\u591a\u7684\u4fe1\u606f",level:4},{value:"\u4e3a\u4ec0\u4e48\u5e94\u8be5\u4f7f\u7528 action creator\uff1f",id:"\u4e3a\u4ec0\u4e48\u5e94\u8be5\u4f7f\u7528-action-creator",level:2},{value:"\u66f4\u591a\u4fe1\u606f",id:"\u66f4\u591a\u4fe1\u606f-1",level:4},{value:"Websockets \u548c\u5176\u4ed6\u6301\u4e45\u8fde\u63a5\u5e94\u8be5\u653e\u5728\u54ea\u91cc\uff1f",id:"websockets-\u548c\u5176\u4ed6\u6301\u4e45\u8fde\u63a5\u5e94\u8be5\u653e\u5728\u54ea\u91cc",level:2},{value:"\u5982\u4f55\u5728\u975e\u7ec4\u4ef6\u6587\u4ef6\u4e2d\u4f7f\u7528 Redux store\uff1f",id:"\u5982\u4f55\u5728\u975e\u7ec4\u4ef6\u6587\u4ef6\u4e2d\u4f7f\u7528-redux-store",level:2}],d={toc:m};function k(e){var t=e.components,a=(0,n.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},d,a,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"redux-faq-\u4ee3\u7801\u7ed3\u6784"},"Redux FAQ: \u4ee3\u7801\u7ed3\u6784"),(0,i.kt)("h2",{id:"\u76ee\u5f55"},"\u76ee\u5f55"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#what-should-my-file-structure-look-like-how-should-i-group-my-action-creators-and-reducers-in-my-project-where-should-my-selectors-go"},"\u6211\u7684\u6587\u4ef6\u7ed3\u6784\u5e94\u8be5\u662f\u4ec0\u4e48\u6837\u7684\uff1f\u5e94\u8be5\u5982\u4f55\u5728\u9879\u76ee\u4e2d\u5bf9 action creator \u548c reducer \u8fdb\u884c\u5206\u7ec4\uff1fselector \u5e94\u8be5\u653e\u5728\u54ea\u91cc\uff1f")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#how-should-i-split-my-logic-between-reducers-and-action-creators-where-should-my-business-logic-go"},"\u6211\u5e94\u8be5\u5982\u4f55\u5728 reducer \u548c action creator \u4e4b\u95f4\u5212\u5206\u903b\u8f91\uff1f\u201c\u4e1a\u52a1\u903b\u8f91\u201d\u5e94\u8be5\u653e\u5728\u54ea\u91cc\uff1f")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#why-should-i-use-action-creators"},"\u4e3a\u4ec0\u4e48\u6211\u5e94\u8be5\u4f7f\u7528 action creator \uff1f")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#where-should-websockets-and-other-persistent-connections-live"},"websockets \u548c\u5176\u4ed6\u6301\u4e45\u8fde\u63a5\u5e94\u8be5\u5728\u54ea\u91cc\uff1f")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#how-can-i-use-the-redux-store-in-non-component-files"},"\u5982\u4f55\u5728\u975e\u7ec4\u4ef6\u6587\u4ef6\u4e2d\u4f7f\u7528 Redux store\uff1f"))),(0,i.kt)("h2",{id:"\u6211\u7684\u6587\u4ef6\u7ed3\u6784\u5e94\u8be5\u662f\u4ec0\u4e48\u6837\u7684\u5e94\u8be5\u5982\u4f55\u5728\u9879\u76ee\u4e2d\u5bf9-action-creator-\u548c-reducer-\u8fdb\u884c\u5206\u7ec4selector\u5e94\u8be5\u653e\u5728\u54ea\u91cc"},"\u6211\u7684\u6587\u4ef6\u7ed3\u6784\u5e94\u8be5\u662f\u4ec0\u4e48\u6837\u7684\uff1f\u5e94\u8be5\u5982\u4f55\u5728\u9879\u76ee\u4e2d\u5bf9 action creator \u548c reducer \u8fdb\u884c\u5206\u7ec4\uff1fselector\u5e94\u8be5\u653e\u5728\u54ea\u91cc\uff1f"),(0,i.kt)("p",null,"\u7531\u4e8e Redux \u53ea\u662f\u4e00\u4e2a\u6570\u636e\u5b58\u50a8\u5e93\uff0c\u5bf9\u4e8e\u9879\u76ee\u7684\u7ed3\u6784\u6ca1\u6709\u76f4\u63a5\u7684\u610f\u89c1\u3002\u4f46\u662f\uff0c\u6709\u4e00\u4e9b\u5927\u591a\u6570 Redux \u5f00\u53d1\u4eba\u5458\u503e\u5411\u4e8e\u4f7f\u7528\u7684\u5e38\u89c1\u6a21\u5f0f\uff1a"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Rails \u6837\u5f0f\uff1a\u201cactions\u201d\u3001\u201cconstants\u201d\u3001\u201creducers\u201d\u3001\u201ccontainers\u201d\u548c\u201ccomponents\u201d\u7684\u5355\u72ec\u6587\u4ef6\u5939\n-\u201c\u529f\u80fd\u6587\u4ef6\u5939\u201d/\u201c\u57df\u201d\u6837\u5f0f\uff1a\u6bcf\u4e2a\u529f\u80fd\u6216\u57df\u7684\u5355\u72ec\u6587\u4ef6\u5939\uff0c\u6bcf\u4e2a\u6587\u4ef6\u7c7b\u578b\u53ef\u80fd\u5e26\u6709\u5b50\u6587\u4ef6\u5939"),(0,i.kt)("li",{parentName:"ul"},"\u201cDucks/Slices\u201d\uff1a\u7c7b\u4f3c\u4e8e\u9886\u57df\u98ce\u683c\uff0c\u4f46\u660e\u786e\u5730\u5c06 reducer \u548c action \u7ed1\u5b9a\u5728\u4e00\u8d77\uff0c\u901a\u5e38\u901a\u8fc7\u5728\u540c\u4e00\u4e2a\u6587\u4ef6\u4e2d\u5b9a\u4e49\u5b83\u4eec")),(0,i.kt)("p",null,"\u901a\u5e38\u5efa\u8bae selector \u4e0e reducer \u4e00\u8d77\u5b9a\u4e49\u5e76\u5bfc\u51fa\uff0c\u7136\u540e\u5728\u5176\u4ed6\u5730\u65b9\u91cd\u7528\uff08\u4f8b\u5982\u5728 ",(0,i.kt)("inlineCode",{parentName:"p"},"mapStateToProps")," \u51fd\u6570\u3001\u5f02\u6b65\u64cd\u4f5c\u521b\u5efa\u5668\u6216 sagas \u4e2d\uff09\u4ee5\u5c06\u6240\u6709\u77e5\u9053\u72b6\u6001\u6811\u5b9e\u9645\u5f62\u72b6\u7684\u4ee3\u7801\u653e\u5728 reducer \u6587\u4ef6\u4e2d\u3002"),(0,i.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},(0,i.kt)("strong",{parentName:"p"},'\u6211\u4eec\u7279\u522b\u5efa\u8bae\u5c06\u4f60\u7684\u903b\u8f91\u7ec4\u7ec7\u5230\u201c\u529f\u80fd\u6587\u4ef6\u5939\u201d\u4e2d\uff0c\u5c06\u7ed9\u5b9a\u529f\u80fd\u7684\u6240\u6709 Redux \u903b\u8f91\u90fd\u653e\u5728\u4e00\u4e2a\u201cDucks/Slices\u201d\u6587\u4ef6\u4e2d"'),"."),(0,i.kt)("p",{parentName:"div"},"\u6709\u5173\u793a\u4f8b\uff0c\u8bf7\u53c2\u89c1\u672c\u8282\uff1a"),(0,i.kt)(l.s,{title:"Detailed Explanation: Example Folder Structure",mdxType:"DetailedExplanation"},"\u793a\u4f8b\u6587\u4ef6\u5939\u7ed3\u6784\u53ef\u80fd\u7c7b\u4f3c\u4e8e\uff1a",(0,i.kt)("ul",{parentName:"div"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"/src"),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"index.tsx"),": React \u7ec4\u4ef6\u6811\u7684\u5165\u53e3\u70b9\u6587\u4ef6"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"/app"),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"store.ts"),": store \u8bbe\u7f6e"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"rootReducer.ts"),": \u6839 reducer (\u53ef\u9009\u62e9\u7684)"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"App.tsx"),": \u6839 React \u7ec4\u4ef6"))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"/common"),": hooks\uff0c\u901a\u7528\u7ec4\u4ef6\uff0cutils\uff0c\u7b49"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"/features"),": \u5305\u542b\u6240\u6709\u201c\u529f\u80fd\u6587\u4ef6\u5939\u201d",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"/todos"),": \u5355\u4e2a\u529f\u80fd\u6587\u4ef6\u5939",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"todosSlice.ts"),": Redux reducer \u903b\u8f91\u548c\u76f8\u5173\u64cd\u4f5c"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"Todos.tsx"),": \u4e00\u4e2a React \u7ec4\u4ef6")))))))),(0,i.kt)("p",{parentName:"div"},(0,i.kt)("inlineCode",{parentName:"p"},"/app")," \u5305\u542b\u4f9d\u8d56\u4e8e\u6240\u6709\u5176\u4ed6\u6587\u4ef6\u5939\u7684\u5e94\u7528\u7a0b\u5e8f\u8303\u56f4\u7684\u8bbe\u7f6e\u548c\u5e03\u5c40\u3002"),(0,i.kt)("p",{parentName:"div"},(0,i.kt)("inlineCode",{parentName:"p"},"/common")," \u5305\u542b\u771f\u6b63\u901a\u7528\u548c\u53ef\u91cd\u7528\u7684\u5b9e\u7528\u7a0b\u5e8f\u548c\u7ec4\u4ef6\u3002"),(0,i.kt)("p",{parentName:"div"},(0,i.kt)("inlineCode",{parentName:"p"},"/features")," \u5177\u6709\u5305\u542b\u4e0e\u7279\u5b9a\u529f\u80fd\u76f8\u5173\u7684\u6240\u6709\u529f\u80fd\u7684\u6587\u4ef6\u5939\u3002\u5728\u6b64\u793a\u4f8b\u4e2d\uff0c",(0,i.kt)("inlineCode",{parentName:"p"},"todosSlice.ts")," \u662f\u4e00\u4e2a \u201cduck\u201d \u98ce\u683c\u7684\u6587\u4ef6\uff0c\u5176\u4e2d\u5305\u542b\u5bf9 RTK \u7684",(0,i.kt)("inlineCode",{parentName:"p"},"createSlice()")," \u51fd\u6570\u7684\u8c03\u7528\uff0c\u5e76\u5bfc\u51fa\u5207\u7247 reducer \u548c action creator\u3002")))),(0,i.kt)("p",null,"\u867d\u7136\u6700\u7ec8\u5982\u4f55\u5728\u78c1\u76d8\u4e0a\u5e03\u7f6e\u4ee3\u7801\u5e76\u4e0d\u91cd\u8981\uff0c\u4f46\u91cd\u8981\u7684\u662f\u8981\u8bb0\u4f4f\u4e0d\u5e94\u5b64\u7acb\u5730\u8003\u8651 action \u548c reducer\u3002\u4e00\u4e2a\u6587\u4ef6\u5939\u4e2d\u5b9a\u4e49\u7684 reducer \u5b8c\u5168\u6709\u53ef\u80fd\uff08\u5e76\u4e14\u9f13\u52b1\uff09\u54cd\u5e94\u53e6\u4e00\u4e2a\u6587\u4ef6\u5939\u4e2d\u5b9a\u4e49\u7684 action\u3002"),(0,i.kt)("h4",{id:"\u66f4\u591a\u4fe1\u606f"},"\u66f4\u591a\u4fe1\u606f"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"\u6587\u6863")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/style-guide/##structure-files-as-feature-folders-with-single-file-logic"},"Style Guide: \u4f7f\u7528\u5355\u6587\u4ef6\u903b\u8f91\u5c06\u6587\u4ef6\u7ed3\u6784\u4f5c\u4e3a\u529f\u80fd\u6587\u4ef6\u5939")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/tutorials/essentials/part-2-app-structure"},"Redux Essentials tutorial: App Structure")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/faq/actions#actions-reducer-mappings"},"FAQ: Actions - \u201creducer \u548c action \u4e4b\u95f4\u7684 1:1 \u6620\u5c04\uff1f\u201d"))),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"\u6587\u7ae0")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.smashingmagazine.com/2016/09/how-to-scale-react-applications/"},"\u5982\u4f55\u6269\u5c55 React \u5e94\u7528\u7a0b\u5e8f")," (accompanying talk: ",(0,i.kt)("a",{parentName:"li",href:"https://vimeo.com/168648012"},"Scaling React Applications"),")"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://medium.com/lexical-labs-engineering/redux-best-practices-64d59775802e"},"Redux \u6700\u4f73\u5b9e\u8df5")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"http://jaysoo.ca/2016/02/28/organizing-redux-application/"},"\u7ed3\u6784\u5316 (Redux) \u5e94\u7528\u7a0b\u5e8f\u7684\u89c4\u5219")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://marmelab.com/blog/2015/12/17/react-directory-structure.html"},"\u4e3a React/Redux \u5e94\u7528\u7a0b\u5e8f\u63d0\u4f9b\u66f4\u597d\u7684\u6587\u4ef6\u7ed3\u6784")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"http://engineering.kapost.com/2016/01/organizing-large-react-applications/"},"\u7ec4\u7ec7\u5927\u578b React \u5e94\u7528\u7a0b\u5e8f")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://medium.com/@msandin/strategies-for-organizing-code-2c9d690b6f33"},"\u7ec4\u7ec7\u4ee3\u7801\u7684\u56db\u79cd\u7b56\u7565")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://randycoulman.com/blog/2016/09/13/encapsulating-the-redux-state-tree/"},"\u5c01\u88c5 Redux \u72b6\u6001\u6811")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://randycoulman.com/blog/2016/09/20/redux-reducer-selector-asymmetry/"},"\u975e\u5bf9\u79f0 Redux Reducer/Selector")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://randycoulman.com/blog/2016/09/27/modular-reducers-and-selectors/"},"\u6a21\u5757\u5316 Reducers and Selectors")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://medium.com/@mmazzarolo/my-journey-toward-a-maintainable-project-structure-for-react-redux-b05dfd999b5"},"\u6211\u7684 React/Redux \u53ef\u7ef4\u62a4\u9879\u76ee\u7ed3\u6784\u4e4b\u65c5")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/markerikson/react-redux-links/blob/master/react-redux-architecture.md#project-file-structure"},"React/Redux Links: \u67b6\u6784 - \u9879\u76ee\u6587\u4ef6\u7ed3\u6784"))),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"\u8ba8\u8bba")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/reduxjs/redux/issues/839"},"#839: \u5f3a\u8c03\u5728 reducer \u65c1\u8fb9\u5b9a\u4e49 selector")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/reduxjs/redux/issues/943"},"#943: Reducer querying")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/mxstbr/react-boilerplate/issues/27"},"React Boilerplate #27: Application Structure")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://stackoverflow.com/questions/32634320/how-to-structure-redux-components-containers/32921576"},"Stack Overflow: \u5982\u4f55\u6784\u5efa Redux \u7ec4\u4ef6/\u5bb9\u5668")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://twitter.com/dan_abramov/status/783428282666614784"},"Twitter: Redux \u6ca1\u6709\u7ec8\u6781\u7684\u6587\u4ef6\u7ed3\u6784"))),(0,i.kt)("h2",{id:"\u6211\u5e94\u8be5\u5982\u4f55\u5728-reducer-\u548c-action-creator-\u4e4b\u95f4\u5212\u5206\u903b\u8f91\u4e1a\u52a1\u903b\u8f91\u5e94\u8be5\u653e\u5728\u54ea\u91cc"},"\u6211\u5e94\u8be5\u5982\u4f55\u5728 reducer \u548c action creator \u4e4b\u95f4\u5212\u5206\u903b\u8f91\uff1f\u201c\u4e1a\u52a1\u903b\u8f91\u201d\u5e94\u8be5\u653e\u5728\u54ea\u91cc\uff1f"),(0,i.kt)("p",null,"\u5bf9\u4e8e reducer \u6216 action creator \u4e2d\u5e94\u8be5\u5305\u542b\u54ea\u4e9b\u903b\u8f91\uff0c\u6ca1\u6709\u4e00\u4e2a\u660e\u786e\u7684\u7b54\u6848\u3002\u4e00\u4e9b\u5f00\u53d1\u4eba\u5458\u66f4\u559c\u6b22\u62e5\u6709 \u201cfat\u201d \u7684 action creator\uff0c\u800c \u201cthin\u201d \u7684 reducer \u53ea\u662f\u7b80\u5355\u5730\u5c06 action \u4e2d\u7684\u6570\u636e\u5408\u5e76\u5230\u76f8\u5e94\u7684 state \u4e2d\u3002\u5176\u4ed6\u4eba\u8bd5\u56fe\u5f3a\u8c03\u4fdd\u6301action \u5c3d\u53ef\u80fd\u5c0f\uff0c\u5e76\u5c3d\u91cf\u51cf\u5c11\u5728 action creator \u4f7f\u7528 ",(0,i.kt)("inlineCode",{parentName:"p"},"getState()"),"\u3002\uff08\u5bf9\u4e8e\u8fd9\u4e2a\u95ee\u9898\uff0c\u5176\u4ed6\u5f02\u6b65\u65b9\u6cd5\uff0c\u5982 sagas \u548c observables \u5c5e\u4e8e \u201caction creator\u201d \u7c7b\u522b\u3002\uff09"),(0,i.kt)("p",null,"\u5c06\u66f4\u591a\u903b\u8f91\u653e\u5165 reducer \u6709\u51e0\u4e2a\u6f5c\u5728\u7684\u597d\u5904\u3002action \u7c7b\u578b\u53ef\u80fd\u4f1a\u66f4\u8bed\u4e49\u5316\u548c\u66f4\u6709\u610f\u4e49\uff08\u4f8b\u5982 ",(0,i.kt)("inlineCode",{parentName:"p"},'"USER_UPDATED"')," \u800c\u4e0d\u662f ",(0,i.kt)("inlineCode",{parentName:"p"},'"SET_STATE"'),"\uff09\u3002\u6b64\u5916\uff0c\u5728 reducer \u4e2d\u6709\u66f4\u591a\u7684\u903b\u8f91\u610f\u5473\u7740\u66f4\u591a\u7684\u529f\u80fd\u4f1a\u53d7\u5230\u65f6\u95f4\u65c5\u884c\u8c03\u8bd5\u7684\u5f71\u54cd\u3002"),(0,i.kt)("p",null,"\u8fd9\u6761\u8bc4\u8bba\u5f88\u597d\u5730\u603b\u7ed3\u4e86\u4e8c\u5206\u6cd5\uff1a"),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"\u73b0\u5728\uff0c\u95ee\u9898\u662f\u5728 action creator \u4e2d\u653e\u5165\u4ec0\u4e48\uff0c\u5728 reducer \u4e2d\u653e\u5165\u4ec0\u4e48\uff0c\u5728 \u201cfat\u201d action \u5bf9\u8c61\u548c \u201cthin\u201d action \u5bf9\u8c61\u4e4b\u95f4\u8fdb\u884c\u9009\u62e9\u3002\u5982\u679c\u4f60\u628a\u6240\u6709\u7684\u903b\u8f91\u90fd\u653e\u5728 action creator \u4e2d\uff0c\u4f60\u6700\u7ec8\u4f1a\u5f97\u5230\u57fa\u672c\u4e0a\u58f0\u660e state \u66f4\u65b0\u7684 \u201cfat\u201d action creator \u5bf9\u8c61\u3002Reducers \u53d8\u5f97\u7eaf\u7cb9\u3001\u50bb\u74dc\u5f0f\u3001\u6dfb\u52a0\u8fd9\u4e2a\u3001\u5220\u9664\u90a3\u4e2a\u3001\u66f4\u65b0\u8fd9\u4e9b\u529f\u80fd\u3002\u4ed6\u4eec\u5c06\u5f88\u5bb9\u6613\u7ec4\u6210\u3002\u4f46\u662f\u4f60\u7684\u4e1a\u52a1\u903b\u8f91\u5e76\u4e0d\u591a\u3002\n\u5982\u679c\u4f60\u5728 reducer \u4e2d\u52a0\u5165\u66f4\u591a\u903b\u8f91\uff0c\u4f60\u6700\u7ec8\u4f1a\u5f97\u5230\u6f02\u4eae\u3001\u7cbe\u7b80\u7684 action \u5bf9\u8c61\uff0c\u5927\u90e8\u5206\u6570\u636e\u903b\u8f91\u90fd\u5728\u4e00\u4e2a\u5730\u65b9\uff0c\u4f46\u662f\u4f60\u7684 reducer \u66f4\u96be\u7ec4\u5408\uff0c\u56e0\u4e3a\u4f60\u53ef\u80fd\u9700\u8981\u6765\u81ea\u5176\u4ed6\u5206\u652f\u7684\u4fe1\u606f\u3002\u60a8\u6700\u7ec8\u4f1a\u5f97\u5230\u5927\u578b reducer \u6216\u4ece\u8be5\u5dde\u66f4\u9ad8\u5c42\u83b7\u53d6\u989d\u5916\u53c2\u6570\u7684 reducer\u3002")),(0,i.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},(0,i.kt)("strong",{parentName:"p"},"\u5efa\u8bae\u5c06\u5c3d\u53ef\u80fd\u591a\u7684\u903b\u8f91\u653e\u5165 reducer"),". \u6709\u65f6\u60a8\u53ef\u80fd\u9700\u8981\u4e00\u4e9b\u903b\u8f91\u6765\u5e2e\u52a9\u51c6\u5907 action \u4e2d\u7684\u5185\u5bb9\uff0c\u4f46 reducer \u5e94\u8be5\u5b8c\u6210\u5927\u90e8\u5206\u5de5\u4f5c\u3002"))),(0,i.kt)("h4",{id:"\u66f4\u591a\u7684\u4fe1\u606f"},"\u66f4\u591a\u7684\u4fe1\u606f"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"\u6587\u6863")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/style-guide/#put-as-much-logic-as-possible-in-reducers"},"Style Guide: \u5728 Reducer \u4e2d\u5c3d\u53ef\u80fd\u591a\u5730\u6dfb\u52a0\u903b\u8f91")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/style-guide/#model-actions-as-events-not-setters"},"Style Guide: \u5c06 Actions \u4f5c\u4e3a \u201cEvents\u201d\uff0c\u800c\u4e0d\u662f \u201cSetters\u201d"))),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"\u6587\u7ae0")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://medium.com/@jeffbski/where-do-i-put-my-business-logic-in-a-react-redux-application-9253ef91ce1"},"\u6211\u5e94\u8be5\u5c06\u4e1a\u52a1\u903b\u8f91\u653e\u5728 React/Redux \u5e94\u7528\u7a0b\u5e8f\u7684\u4ec0\u4e48\u4f4d\u7f6e\uff1f")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.smashingmagazine.com/2016/09/how-to-scale-react-applications/"},"\u5982\u4f55\u6269\u5c55 React \u5e94\u7528\u7a0b\u5e8f")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://blog.isquaredsoftware.com/2017/05/idiomatic-redux-tao-of-redux-part-2/#thick-and-thin-reducers"},"Redux \u4e4b\u9053\uff0c\u7b2c 2 \u90e8\u5206 - \u5b9e\u8df5\u4e0e\u54f2\u5b66\u3002\u539a\u91cd\u548c\u8f7b\u91cf\u7684 reducer\u3002"))),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"\u8ba8\u8bba")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/reduxjs/redux/issues/384#issuecomment-127393209"},"\u5728 action creator \u4e2d\u653e\u7f6e\u8fc7\u591a\u7684\u903b\u8f91\u4f1a\u5982\u4f55\u5f71\u54cd\u8c03\u8bd5")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/reduxjs/redux/issues/384#issuecomment-127393209"},"#384:reducer \u4e2d\u7684\u5185\u5bb9\u8d8a\u591a\uff0c\u60a8\u53ef\u4ee5\u901a\u8fc7\u65f6\u95f4\u65c5\u884c\u91cd\u64ad\u7684\u5185\u5bb9\u8d8a\u591a")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/reduxjs/redux/issues/1165"},"#1165: \u5728\u54ea\u91cc\u653e\u7f6e\u4e1a\u52a1\u903b\u8f91/\u9a8c\u8bc1\uff1f")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/reduxjs/redux/issues/1171"},"#1171: \u5173\u4e8e action-creator\u3001reducer \u548c selector \u7684\u6700\u4f73\u5b9e\u8df5\u5efa\u8bae")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://stackoverflow.com/questions/35667249/accessing-redux-state-in-an-action-creator/35674575"},"Stack Overflow: \u5728 action-creator \u4e2d\u8bbf\u95ee Redux state\uff1f")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/reduxjs/redux/issues/2796#issue-289298280"},"#2796: \u660e\u786e\u201c\u4e1a\u52a1\u903b\u8f91\u201d")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://twitter.com/FwardPhoenix/status/952971237004926977"},"Twitter: \u8fdc\u79bb\u4e0d\u660e\u786e\u7684\u672f\u8bed..."))),(0,i.kt)("h2",{id:"\u4e3a\u4ec0\u4e48\u5e94\u8be5\u4f7f\u7528-action-creator"},"\u4e3a\u4ec0\u4e48\u5e94\u8be5\u4f7f\u7528 action creator\uff1f"),(0,i.kt)("p",null,"Redux \u4e0d\u9700\u8981 action creator\u3002\u60a8\u53ef\u4ee5\u4ee5\u4efb\u4f55\u6700\u9002\u5408\u60a8\u7684\u65b9\u5f0f\u81ea\u7531\u521b\u5efa action\uff0c\u5305\u62ec\u7b80\u5355\u5730\u5c06\u5bf9\u8c61\u6587\u5b57\u4f20\u9012\u7ed9 ",(0,i.kt)("inlineCode",{parentName:"p"},"dispatch"),"\u3002action creator\u4ece ",(0,i.kt)("a",{parentName:"p",href:"https://facebook.github.io/react/blog/2014/07/30/flux-actions-and-the-dispatcher.html#actions-and-actioncreators"},"Flux \u67b6\u6784")," \u4e2d\u51fa\u73b0\u5e76\u88ab Redux \u793e\u533a\u91c7\u7528\uff0c\u56e0\u4e3a\u5b83\u4eec\u63d0\u4f9b\u4e86\u51e0\u4e2a\u597d\u5904\u3002"),(0,i.kt)("p",null,"Action creator \u66f4\u6613\u4e8e\u7ef4\u62a4\u3002\u53ef\u4ee5\u5728\u4e00\u4e2a\u5730\u65b9\u5bf9 action \u8fdb\u884c\u66f4\u65b0\uff0c\u5e76\u5728\u4efb\u4f55\u5730\u65b9\u5e94\u7528\u3002\u4fdd\u8bc1 action \u7684\u6240\u6709\u5b9e\u4f8b\u5177\u6709\u76f8\u540c\u7684\u72b6\u6001\u548c\u76f8\u540c\u7684\u9ed8\u8ba4\u503c\u3002"),(0,i.kt)("p",null,"Action creator \u662f\u53ef\u6d4b\u8bd5\u7684\u3002\u5fc5\u987b\u624b\u52a8\u9a8c\u8bc1\u5185\u8054 action \u7684\u6b63\u786e\u6027\u3002\u4e0e\u4efb\u4f55\u51fd\u6570\u4e00\u6837\uff0caction creator \u7684\u6d4b\u8bd5\u53ef\u4ee5\u7f16\u5199\u4e00\u6b21\u5e76\u81ea\u52a8\u8fd0\u884c\u3002"),(0,i.kt)("p",null,"Action creator \u66f4\u5bb9\u6613\u8bb0\u5f55\u3002Action creator \u7684\u53c2\u6570\u679a\u4e3e action \u7684\u4f9d\u8d56\u5173\u7cfb\u3002action \u5b9a\u4e49\u7684\u96c6\u4e2d\u5316\u4e3a\u6587\u6863\u6ce8\u91ca\u63d0\u4f9b\u4e86\u4e00\u4e2a\u65b9\u4fbf\u7684\u5730\u65b9\u3002\u5185\u8054\u7f16\u5199 action \u65f6\uff0c\u8fd9\u4e9b\u4fe1\u606f\u66f4\u96be\u6355\u83b7\u548c\u4ea4\u6d41\u3002"),(0,i.kt)("p",null,"Action creator \u662f\u4e00\u4e2a\u66f4\u5f3a\u5927\u7684\u62bd\u8c61\u3002\u521b\u5efa action \u901a\u5e38\u6d89\u53ca\u8f6c\u6362\u6570\u636e\u6216\u53d1\u51fa AJAX \u8bf7\u6c42\u3002Action creator \u4e3a\u8fd9\u79cd\u4e0d\u540c\u7684\u903b\u8f91\u63d0\u4f9b\u4e86\u7edf\u4e00\u7684\u63a5\u53e3\u3002\u8fd9\u79cd\u62bd\u8c61\u91ca\u653e\u4e86\u4e00\u4e2a\u7ec4\u4ef6\u6765 dispatch \u4e00\u4e2a\u52a8\u4f5c\uff0c\u800c\u4e0d\u4f1a\u56e0\u4e3a\u8be5 action \u7684\u521b\u5efa\u7ec6\u8282\u800c\u53d8\u5f97\u590d\u6742\u3002"),(0,i.kt)("h4",{id:"\u66f4\u591a\u4fe1\u606f-1"},"\u66f4\u591a\u4fe1\u606f"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"\u6587\u7ae0")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://blog.isquaredsoftware.com/2016/10/idiomatic-redux-why-use-action-creators/"},"\u60ef\u7528\u7684 Redux\uff1a\u4e3a\u4ec0\u4e48\u4f7f\u7528 action creator \uff1f"))),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Discussions")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.reddit.com/r/reactjs/comments/54k8js/redbox_redux_action_creation_made_simple/d8493z1/?context=4"},"Reddit: Redbox - \u4f7f Redux action \u521b\u5efa\u53d8\u5f97\u7b80\u5355"))),(0,i.kt)("h2",{id:"websockets-\u548c\u5176\u4ed6\u6301\u4e45\u8fde\u63a5\u5e94\u8be5\u653e\u5728\u54ea\u91cc"},"Websockets \u548c\u5176\u4ed6\u6301\u4e45\u8fde\u63a5\u5e94\u8be5\u653e\u5728\u54ea\u91cc\uff1f"),(0,i.kt)("p",null,"Middleware \u662f Redux \u5e94\u7528\u7a0b\u5e8f\u4e2d\u6301\u7eed\u8fde\u63a5\uff08\u5982 websockets\uff09\u7684\u6b63\u786e\u4f4d\u7f6e\uff0c\u539f\u56e0\u5982\u4e0b\uff1a"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Middleware \u5b58\u5728\u4e8e\u5e94\u7528\u7a0b\u5e8f\u7684\u751f\u547d\u5468\u671f\u4e2d"),(0,i.kt)("li",{parentName:"ul"},"\u4e0e store \u672c\u8eab\u4e00\u6837\uff0c\u4f60\u53ef\u80fd\u53ea\u9700\u8981\u6574\u4e2a\u5e94\u7528\u7a0b\u5e8f\u4e2d\u53ef\u4ee5\u4f7f\u7528\u7684\u7ed9\u5b9a\u8fde\u63a5\u7684\u5355\u4e2a\u5b9e\u4f8b"),(0,i.kt)("li",{parentName:"ul"},"Middleware \u53ef\u4ee5\u770b\u5230\u6240\u6709 dispatch \u7684 action \u548c\u81ea\u5df1 dispatch \u7684 action \u3002\u8fd9\u610f\u5473\u7740 middleware \u53ef\u4ee5\u91c7\u53d6 dispatch \u7684 action \u5e76\u5c06\u5176\u8f6c\u6362\u4e3a\u901a\u8fc7 websocket \u53d1\u9001\u7684\u6d88\u606f\uff0c\u5e76\u5728\u901a\u8fc7 websocket \u63a5\u6536\u5230\u6d88\u606f\u65f6 dispatch \u65b0\u7684 action\u3002"),(0,i.kt)("li",{parentName:"ul"},"websocket \u8fde\u63a5\u5b9e\u4f8b\u4e0d\u53ef\u5e8f\u5217\u5316\uff0c\u56e0\u6b64",(0,i.kt)("a",{parentName:"li",href:"/faq/organizing-state#organizing-state-non-serializable"},"\u5b83\u4e0d\u5c5e\u4e8e store state \u672c\u8eab"))),(0,i.kt)("p",null,"\u8bf7\u53c2\u9605 ",(0,i.kt)("a",{parentName:"p",href:"https://gist.github.com/markerikson/3df1cf5abbac57820a20059287b4be58"},"\u6b64\u793a\u4f8b\u663e\u793a socket middleware \u5982\u4f55 dispatch \u548c\u54cd\u5e94 Redux action"),"."),(0,i.kt)("p",null,"\u6709\u8bb8\u591a\u7528\u4e8e websocket \u548c\u5176\u4ed6\u7c7b\u4f3c\u8fde\u63a5\u7684\u73b0\u6709 middleware - \u8bf7\u53c2\u9605\u4e0b\u9762\u7684\u94fe\u63a5\u3002"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"\u5e93")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/markerikson/redux-ecosystem-links/blob/master/middleware-sockets-adapters.md"},"Middleware: Socket and Adapters"))),(0,i.kt)("h2",{id:"\u5982\u4f55\u5728\u975e\u7ec4\u4ef6\u6587\u4ef6\u4e2d\u4f7f\u7528-redux-store"},"\u5982\u4f55\u5728\u975e\u7ec4\u4ef6\u6587\u4ef6\u4e2d\u4f7f\u7528 Redux store\uff1f"),(0,i.kt)("p",null,"\u6bcf\u4e2a\u5e94\u7528\u7a0b\u5e8f\u5e94\u8be5\u53ea\u6709\u4e00\u4e2a Redux store\u3002\u8fd9\u4f7f\u5f97\u5b83\u5728\u5e94\u7528\u7a0b\u5e8f\u67b6\u6784\u65b9\u9762\u5b9e\u9645\u4e0a\u662f\u4e00\u4e2a\u5355\u4f8b\u3002\u4e0e React \u4e00\u8d77\u4f7f\u7528\u65f6\uff0c\u901a\u8fc7\u5728\u6839 ",(0,i.kt)("inlineCode",{parentName:"p"},"<App>")," \u7ec4\u4ef6\u5468\u56f4\u6e32\u67d3 ",(0,i.kt)("inlineCode",{parentName:"p"},"<Provider store={store}>"),"\uff0c\u5c06 store \u5728\u8fd0\u884c\u65f6\u6ce8\u5165\u5230\u7ec4\u4ef6\u4e2d\uff0c\u56e0\u6b64\u53ea\u6709\u5e94\u7528\u7a0b\u5e8f\u8bbe\u7f6e\u903b\u8f91\u9700\u8981\u76f4\u63a5\u5bfc\u5165 store\u3002"),(0,i.kt)("p",null,"\u4f46\u662f\uff0c\u6709\u65f6\u4ee3\u7801\u5e93\u7684\u5176\u4ed6\u90e8\u5206\u4e5f\u9700\u8981\u4e0e store \u4ea4\u4e92\u3002"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"\u60a8\u5e94\u8be5\u907f\u514d\u5c06 store \u76f4\u63a5\u5bfc\u5165\u5176\u4ed6\u4ee3\u7801\u5e93\u6587\u4ef6"),". \u867d\u7136\u5b83\u5728\u67d0\u4e9b\u60c5\u51b5\u4e0b\u53ef\u80fd\u4f1a\u8d77\u4f5c\u7528\uff0c\u4f46\u8fd9\u901a\u5e38\u4f1a\u5bfc\u81f4\u5faa\u73af\u5bfc\u5165\u4f9d\u8d56\u9519\u8bef\u3002"),(0,i.kt)("p",null,"\u4e00\u4e9b\u53ef\u80fd\u7684\u89e3\u51b3\u65b9\u6848\uff1a"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\u5c06\u4f9d\u8d56\u4e8e store \u7684\u903b\u8f91\u7f16\u5199\u4e3a thunk\uff0c\u7136\u540e\u4ece\u7ec4\u4ef6\u4e2d dispatch \u8be5 thunk\u3002"),(0,i.kt)("li",{parentName:"ul"},"\u5c06\u7ec4\u4ef6\u4e2d\u5bf9 \u201cdispatch\u201d \u7684\u5f15\u7528\u4f5c\u4e3a\u76f8\u5173\u51fd\u6570\u7684\u53c2\u6570\u4f20\u9012\u3002"),(0,i.kt)("li",{parentName:"ul"},"\u5c06\u903b\u8f91\u7f16\u5199\u4e3a middleware\uff0c\u5e76\u5728\u8bbe\u7f6e\u65f6\u5c06\u5b83\u4eec\u6dfb\u52a0\u5230 store \u4e2d\u3002"),(0,i.kt)("li",{parentName:"ul"},"\u5728\u521b\u5efa\u5e94\u7528\u7a0b\u5e8f\u65f6\u5c06 store \u5b9e\u4f8b\u6ce8\u5165\u76f8\u5173\u6587\u4ef6\u3002")),(0,i.kt)("p",null,"\u4e00\u4e2a\u5e38\u89c1\u7684\u7528\u4f8b\u662f\u5728 Axios \u62e6\u622a\u5668\u5185\u90e8\u8bfb\u53d6 API \u6388\u6743\u4fe1\u606f\uff0c\u4f8b\u5982\u6765\u81ea Redux state \u7684\u4ee4\u724c\u3002\u62e6\u622a\u5668\u6587\u4ef6\u9700\u8981\u5f15\u7528 ",(0,i.kt)("inlineCode",{parentName:"p"},"store.getState()"),"\uff0c\u8fd8\u9700\u8981\u5bfc\u5165API\u5c42\u6587\u4ef6\uff0c\u5bfc\u81f4\u5faa\u73af\u5bfc\u5165\u3002"),(0,i.kt)("p",null,"\u60a8\u53ef\u4ee5\u4ece\u62e6\u622a\u5668\u6587\u4ef6\u4e2d\u66b4\u9732\u4e00\u4e2a ",(0,i.kt)("inlineCode",{parentName:"p"},"injectStore")," \u51fd\u6570\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="common/api.js"',title:'"common/api.js"'},"let store\n\nexport const injectStore(_store) {\n  store = _store\n}\n\naxiosInstance.interceptors.request.use(\n  config => {\n    config.headers.authorization = store.getState().auth.token\n    return config;\n  }\n)\n")),(0,i.kt)("p",null,"\u7136\u540e\uff0c\u5728\u4f60\u7684\u5165\u53e3\u70b9\u6587\u4ef6\u4e2d\uff0c\u5c06 store \u6ce8\u5165 API \u8bbe\u7f6e\u6587\u4ef6\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="index.js"',title:'"index.js"'},'import store from "./app/store".\nimport {injectStore} from "./common/api";\ninjectStore(store);\n')),(0,i.kt)("p",null,"\u8fd9\u6837\uff0c\u5e94\u7528\u7a0b\u5e8f\u8bbe\u7f6e\u662f\u552f\u4e00\u5fc5\u987b\u5bfc\u5165 store \u7684\u4ee3\u7801\uff0c\u6587\u4ef6\u4f9d\u8d56\u56fe\u907f\u514d\u4e86\u5faa\u73af\u4f9d\u8d56\u3002"))}k.isMDXComponent=!0}}]);