"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[9645],{3905:function(e,n,t){t.d(n,{Zo:function(){return c},kt:function(){return d}});var r=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function u(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var m=r.createContext({}),i=function(e){var n=r.useContext(m),t=n;return e&&(t="function"==typeof e?e(n):u(u({},n),e)),t},c=function(e){var n=i(e.components);return r.createElement(m.Provider,{value:n},e.children)},l={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},p=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,m=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),p=i(t),d=a,k=p["".concat(m,".").concat(d)]||p[d]||l[d]||o;return t?r.createElement(k,u(u({ref:n},c),{},{components:t})):r.createElement(k,u({ref:n},c))}));function d(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,u=new Array(o);u[0]=p;var s={};for(var m in n)hasOwnProperty.call(n,m)&&(s[m]=n[m]);s.originalType=e,s.mdxType="string"==typeof e?e:a,u[1]=s;for(var i=2;i<o;i++)u[i]=t[i];return r.createElement.apply(null,u)}return r.createElement.apply(null,t)}p.displayName="MDXCreateElement"},7513:function(e,n,t){t.r(n),t.d(n,{assets:function(){return c},contentTitle:function(){return m},default:function(){return d},frontMatter:function(){return s},metadata:function(){return i},toc:function(){return l}});var r=t(7462),a=t(3366),o=(t(7294),t(3905)),u=["components"],s={id:"normalizing-state-shape",title:"State \u8303\u5f0f\u5316",description:"Structuring Reducers > State \u8303\u5f0f\u5316: Why and how to store data items for lookup based on ID",hide_title:!1},m="State \u8303\u5f0f\u5316",i={unversionedId:"usage/structuring-reducers/normalizing-state-shape",id:"usage/structuring-reducers/normalizing-state-shape",title:"State \u8303\u5f0f\u5316",description:"Structuring Reducers > State \u8303\u5f0f\u5316: Why and how to store data items for lookup based on ID",source:"@site/../docs/usage/structuring-reducers/NormalizingStateShape.md",sourceDirName:"usage/structuring-reducers",slug:"/usage/structuring-reducers/normalizing-state-shape",permalink:"/usage/structuring-reducers/normalizing-state-shape",draft:!1,tags:[],version:"current",frontMatter:{id:"normalizing-state-shape",title:"State \u8303\u5f0f\u5316",description:"Structuring Reducers > State \u8303\u5f0f\u5316: Why and how to store data items for lookup based on ID",hide_title:!1},sidebar:"docs",previous:{title:"\u8fdb\u9636 combineReducer",permalink:"/usage/structuring-reducers/beyond-combinereducers"},next:{title:"\u7ba1\u7406\u8303\u5f0f\u5316\u6570\u636e",permalink:"/usage/structuring-reducers/updating-normalized-data"}},c={},l=[{value:"\u8bbe\u8ba1\u8303\u5f0f\u5316\u7684 State",id:"\u8bbe\u8ba1\u8303\u5f0f\u5316\u7684-state",level:2},{value:"\u7ec4\u7ec7 State \u4e2d\u7684\u8303\u5f0f\u5316\u6570\u636e",id:"\u7ec4\u7ec7-state-\u4e2d\u7684\u8303\u5f0f\u5316\u6570\u636e",level:2},{value:"\u8868\u95f4\u5173\u7cfb",id:"\u8868\u95f4\u5173\u7cfb",level:2},{value:"\u5d4c\u5957\u6570\u636e\u8303\u5f0f\u5316",id:"\u5d4c\u5957\u6570\u636e\u8303\u5f0f\u5316",level:2}],p={toc:l};function d(e){var n=e.components,t=(0,a.Z)(e,u);return(0,o.kt)("wrapper",(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"state-\u8303\u5f0f\u5316"},"State \u8303\u5f0f\u5316"),(0,o.kt)("p",null,"\u4e8b\u5b9e\u4e0a\uff0c\u5927\u90e8\u5206\u7a0b\u5e8f\u5904\u7406\u7684\u6570\u636e\u90fd\u662f\u5d4c\u5957\u6216\u4e92\u76f8\u5173\u8054\u7684\u3002\u4f8b\u5982\uff0c\u4e00\u4e2a\u535a\u5ba2\u4e2d\u6709\u591a\u7bc7\u6587\u7ae0\uff0c\u6bcf\u7bc7\u6587\u7ae0\u6709\u591a\u6761\u8bc4\u8bba\uff0c\u6240\u6709\u7684\u6587\u7ae0\u548c\u8bc4\u8bba\u53c8\u90fd\u662f\u7531\u7528\u6237\u4ea7\u751f\u7684\u3002\u8fd9\u79cd\u7c7b\u578b\u5e94\u7528\u7684\u6570\u636e\u770b\u4e0a\u53bb\u53ef\u80fd\u662f\u8fd9\u6837\u7684\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"const blogPosts = [\n  {\n    id: 'post1',\n    author: { username: 'user1', name: 'User 1' },\n    body: '......',\n    comments: [\n      {\n        id: 'comment1',\n        author: { username: 'user2', name: 'User 2' },\n        comment: '.....'\n      },\n      {\n        id: 'comment2',\n        author: { username: 'user3', name: 'User 3' },\n        comment: '.....'\n      }\n    ]\n  },\n  {\n    id: 'post2',\n    author: { username: 'user2', name: 'User 2' },\n    body: '......',\n    comments: [\n      {\n        id: 'comment3',\n        author: { username: 'user3', name: 'User 3' },\n        comment: '.....'\n      },\n      {\n        id: 'comment4',\n        author: { username: 'user1', name: 'User 1' },\n        comment: '.....'\n      },\n      {\n        id: 'comment5',\n        author: { username: 'user3', name: 'User 3' },\n        comment: '.....'\n      }\n    ]\n  }\n  // and repeat many times\n]\n")),(0,o.kt)("p",null,"\u4e0a\u9762\u7684\u6570\u636e\u7ed3\u6784\u6bd4\u8f83\u590d\u6742\uff0c\u5e76\u4e14\u6709\u90e8\u5206\u6570\u636e\u662f\u91cd\u590d\u7684\u3002\u8fd9\u91cc\u8fd8\u5b58\u5728\u4e00\u4e9b\u8ba9\u4eba\u5173\u5fc3\u7684\u95ee\u9898\uff1a"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"\u5f53\u6570\u636e\u5728\u591a\u5904\u5197\u4f59\u540e\uff0c\u9700\u8981\u66f4\u65b0\u65f6\uff0c\u5f88\u96be\u4fdd\u8bc1\u6240\u6709\u7684\u6570\u636e\u90fd\u8fdb\u884c\u66f4\u65b0\u3002"),(0,o.kt)("li",{parentName:"ul"},"\u5d4c\u5957\u7684\u6570\u636e\u610f\u5473\u7740 reducer \u903b\u8f91\u5d4c\u5957\u66f4\u591a\u3001\u590d\u6742\u5ea6\u66f4\u9ad8\u3002\u5c24\u5176\u662f\u5728\u6253\u7b97\u66f4\u65b0\u6df1\u5c42\u5d4c\u5957\u6570\u636e\u65f6\u3002"),(0,o.kt)("li",{parentName:"ul"},"\u4e0d\u53ef\u53d8\u7684\u6570\u636e\u5728\u66f4\u65b0\u65f6\u9700\u8981\u72b6\u6001\u6811\u7684\u7956\u5148\u6570\u636e\u8fdb\u884c\u590d\u5236\u548c\u66f4\u65b0\uff0c\u5e76\u4e14\u65b0\u7684\u5bf9\u8c61\u5f15\u7528\u4f1a\u5bfc\u81f4\u4e0e\u4e4b connect \u7684\u6240\u6709 UI \u7ec4\u4ef6\u90fd\u91cd\u590d render\u3002\u5c3d\u7ba1\u8981\u663e\u793a\u7684\u6570\u636e\u6ca1\u6709\u53d1\u751f\u4efb\u4f55\u6539\u53d8\uff0c\u5bf9\u6df1\u5c42\u5d4c\u5957\u7684\u6570\u636e\u5bf9\u8c61\u8fdb\u884c\u66f4\u65b0\u4e5f\u4f1a\u5f3a\u5236\u5b8c\u5168\u65e0\u5173\u7684 UI \u7ec4\u4ef6\u91cd\u590d render")),(0,o.kt)("p",null,"\u6b63\u56e0\u4e3a\u5982\u6b64\uff0c\u5728 Redux Store \u4e2d\u7ba1\u7406\u5173\u7cfb\u6570\u636e\u6216\u5d4c\u5957\u6570\u636e\u7684\u63a8\u8350\u505a\u6cd5\u662f\u5c06\u8fd9\u4e00\u90e8\u5206\u89c6\u4e3a\u6570\u636e\u5e93\uff0c\u5e76\u4e14\u5c06\u6570\u636e\u6309\u8303\u5f0f\u5316\u5b58\u50a8\u3002"),(0,o.kt)("h2",{id:"\u8bbe\u8ba1\u8303\u5f0f\u5316\u7684-state"},"\u8bbe\u8ba1\u8303\u5f0f\u5316\u7684 State"),(0,o.kt)("p",null,"\u8303\u5f0f\u5316\u7684\u6570\u636e\u5305\u542b\u4e0b\u9762\u51e0\u4e2a\u6982\u5ff5\uff1a"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"\u4efb\u4f55\u7c7b\u578b\u7684\u6570\u636e\u5728 state \u4e2d\u90fd\u6709\u81ea\u5df1\u7684 \u201c\u8868\u201d\u3002"),(0,o.kt)("li",{parentName:"ul"},"\u4efb\u4f55 \u201c\u6570\u636e\u8868\u201d \u5e94\u5c06\u5404\u4e2a\u9879\u76ee\u5b58\u50a8\u5728\u5bf9\u8c61\u4e2d\uff0c\u5176\u4e2d\u6bcf\u4e2a\u9879\u76ee\u7684 ID \u4f5c\u4e3a key\uff0c\u9879\u76ee\u672c\u8eab\u4f5c\u4e3a value\u3002"),(0,o.kt)("li",{parentName:"ul"},"\u4efb\u4f55\u5bf9\u5355\u4e2a\u9879\u76ee\u7684\u5f15\u7528\u90fd\u5e94\u8be5\u6839\u636e\u5b58\u50a8\u9879\u76ee\u7684 ID \u6765\u5b8c\u6210\u3002"),(0,o.kt)("li",{parentName:"ul"},"ID \u6570\u7ec4\u5e94\u8be5\u7528\u4e8e\u6392\u5e8f\u3002")),(0,o.kt)("p",null,"\u4e0a\u9762\u535a\u5ba2\u793a\u4f8b\u4e2d\u7684 state \u7ed3\u6784\u8303\u5f0f\u5316\u4e4b\u540e\u53ef\u80fd\u5982\u4e0b\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},'{\n    posts : {\n        byId : {\n            "post1" : {\n                id : "post1",\n                author : "user1",\n                body : "......",\n                comments : ["comment1", "comment2"]\n            },\n            "post2" : {\n                id : "post2",\n                author : "user2",\n                body : "......",\n                comments : ["comment3", "comment4", "comment5"]\n            }\n        }\n        allIds : ["post1", "post2"]\n    },\n    comments : {\n        byId : {\n            "comment1" : {\n                id : "comment1",\n                author : "user2",\n                comment : ".....",\n            },\n            "comment2" : {\n                id : "comment2",\n                author : "user3",\n                comment : ".....",\n            },\n            "comment3" : {\n                id : "comment3",\n                author : "user3",\n                comment : ".....",\n            },\n            "comment4" : {\n                id : "comment4",\n                author : "user1",\n                comment : ".....",\n            },\n            "comment5" : {\n                id : "comment5",\n                author : "user3",\n                comment : ".....",\n            },\n        },\n        allIds : ["comment1", "comment2", "comment3", "commment4", "comment5"]\n    },\n    users : {\n        byId : {\n            "user1" : {\n                username : "user1",\n                name : "User 1",\n            }\n            "user2" : {\n                username : "user2",\n                name : "User 2",\n            }\n            "user3" : {\n                username : "user3",\n                name : "User 3",\n            }\n        },\n        allIds : ["user1", "user2", "user3"]\n    }\n}\n')),(0,o.kt)("p",null,"\u8fd9\u79cd state \u5728\u7ed3\u6784\u4e0a\u66f4\u52a0\u6241\u5e73\u3002\u4e0e\u539f\u59cb\u7684\u5d4c\u5957\u5f62\u5f0f\u76f8\u6bd4\uff0c\u6709\u4e0b\u9762\u51e0\u4e2a\u5730\u65b9\u7684\u6539\u8fdb\uff1a"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"\u6bcf\u4e2a\u6570\u636e\u9879\u53ea\u5728\u4e00\u4e2a\u5730\u65b9\u5b9a\u4e49\uff0c\u5982\u679c\u6570\u636e\u9879\u9700\u8981\u66f4\u65b0\u7684\u8bdd\u4e0d\u7528\u5728\u591a\u5904\u6539\u53d8"),(0,o.kt)("li",{parentName:"ul"},"reducer \u903b\u8f91\u4e0d\u7528\u5904\u7406\u6df1\u5c42\u6b21\u7684\u5d4c\u5957\uff0c\u56e0\u6b64\u770b\u4e0a\u53bb\u53ef\u80fd\u4f1a\u66f4\u52a0\u7b80\u5355"),(0,o.kt)("li",{parentName:"ul"},"\u68c0\u7d22\u6216\u8005\u66f4\u65b0\u7ed9\u5b9a\u6570\u636e\u9879\u7684\u903b\u8f91\u53d8\u5f97\u7b80\u5355\u4e0e\u4e00\u81f4\u3002\u7ed9\u5b9a\u4e00\u4e2a\u6570\u636e\u9879\u7684 type \u548c ID\uff0c\u4e0d\u5fc5\u6316\u6398\u5176\u4ed6\u5bf9\u8c61\u800c\u662f\u901a\u8fc7\u51e0\u4e2a\u7b80\u5355\u7684\u6b65\u9aa4\u5c31\u80fd\u67e5\u627e\u5230\u5b83\u3002"),(0,o.kt)("li",{parentName:"ul"},"\u6bcf\u4e2a\u6570\u636e\u7c7b\u578b\u90fd\u662f\u552f\u4e00\u7684\uff0c\u50cf\u6539\u8bc4\u8bba\u8fd9\u6837\u7684\u66f4\u65b0\u4ec5\u4ec5\u9700\u8981\u72b6\u6001\u6811\u4e2d \u201ccomment > byId > comment\u201d \u8fd9\u90e8\u5206\u7684\u590d\u5236\u3002\u8fd9\u4e5f\u5c31\u610f\u5473\u7740\u5728 UI \u4e2d\u53ea\u6709\u6570\u636e\u53d1\u751f\u53d8\u5316\u7684\u4e00\u90e8\u5206\u624d\u4f1a\u53d1\u751f\u66f4\u65b0\u3002\u4e0e\u4e4b\u524d\u7684\u4e0d\u540c\u7684\u662f\uff0c\u4e4b\u524d\u5d4c\u5957\u5f62\u5f0f\u7684\u7ed3\u6784\u9700\u8981\u66f4\u65b0\u6574\u4e2a comment \u5bf9\u8c61\uff0cpost \u5bf9\u8c61\u7684\u7236\u7ea7\uff0c\u4ee5\u53ca\u6574\u4e2a post \u5bf9\u8c61\u7684\u6570\u7ec4\u3002\u8fd9\u6837\u5c31\u4f1a\u8ba9\u6240\u6709\u7684 Post \u7ec4\u4ef6\u548c Comment \u7ec4\u4ef6\u90fd\u518d\u6b21\u6e32\u67d3\u3002")),(0,o.kt)("p",null,"\u9700\u8981\u6ce8\u610f\u7684\u662f\uff0c\u8303\u5f0f\u5316\u7684 state \u610f\u5473\u66f4\u591a\u7684\u7ec4\u4ef6\u88ab connect\uff0c\u6bcf\u4e2a\u7ec4\u4ef6\u8d1f\u8d23\u67e5\u627e\u81ea\u5df1\u7684\u6570\u636e\uff0c\u8fd9\u548c\u5c0f\u90e8\u5206\u7684\u7ec4\u4ef6\u88ab connect\uff0c\u7136\u540e\u67e5\u627e\u5927\u90e8\u5206\u7684\u6570\u636e\u518d\u8fdb\u884c\u5411\u4e0b\u4f20\u9012\u6570\u636e\u662f\u6070\u6070\u76f8\u53cd\u7684\u3002\u4e8b\u5b9e\u8bc1\u660e\uff0cconnect \u7236\u7ec4\u4ef6\u53ea\u9700\u8981\u5c06\u6570\u636e\u9879\u7684 Id \u4f20\u9012\u7ed9 connect \u7684\u5b50\u5bf9\u8c61\u662f\u5728 Redux \u5e94\u7528\u4e2d\u4f18\u5316 UI \u6027\u80fd\u7684\u826f\u597d\u6a21\u5f0f\uff0c\u56e0\u6b64\u4fdd\u6301\u8303\u5f0f\u5316\u7684 state \u5728\u63d0\u9ad8\u6027\u80fd\u65b9\u9762\u8d77\u7740\u5173\u952e\u4f5c\u7528\u3002"),(0,o.kt)("h2",{id:"\u7ec4\u7ec7-state-\u4e2d\u7684\u8303\u5f0f\u5316\u6570\u636e"},"\u7ec4\u7ec7 State \u4e2d\u7684\u8303\u5f0f\u5316\u6570\u636e"),(0,o.kt)("p",null,"\u4e00\u4e2a\u5178\u578b\u7684\u5e94\u7528\u4e2d\u901a\u5e38\u4f1a\u6709\u76f8\u5173\u8054\u7684\u6570\u636e\u548c\u65e0\u5173\u8054\u6570\u636e\u7684\u6df7\u5408\u4f53\u3002\u867d\u7136\u6211\u4eec\u5bf9\u8fd9\u79cd\u4e0d\u540c\u7c7b\u578b\u7684\u6570\u636e\u5e94\u8be5\u5982\u4f55\u7ec4\u7ec7\u6ca1\u6709\u4e00\u4e2a\u5355\u4e00\u7684\u89c4\u5219\uff0c\u4f46\u5e38\u89c1\u7684\u6a21\u5f0f\u662f\u5c06\u5173\u7cfb \u201c\u8868\u201d \u653e\u5728\u4e00\u4e2a\u5171\u540c\u7684\u7236 key \u4e2d\uff0c\u6bd4\u5982\uff1a\u201centities\u201d\u3002\u901a\u8fc7\u8fd9\u79cd\u6a21\u5f0f\u7ec4\u7ec7\u7684 state \u770b\u4e0a\u53bb\u957f\u5f97\u50cf\u8fd9\u6837\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"{\n    simpleDomainData1: {....},\n    simpleDomainData2: {....}\n    entities : {\n        entityType1 : {....},\n        entityType2 : {....}\n    }\n    ui : {\n        uiSection1 : {....},\n        uiSection2 : {....}\n    }\n}\n")),(0,o.kt)("p",null,"\u8fd9\u6837\u53ef\u4ee5\u901a\u8fc7\u591a\u79cd\u65b9\u5f0f\u8fdb\u884c\u6269\u5c55\u3002\u6bd4\u5982\u4e00\u4e2a\u5bf9 entities \u8981\u8fdb\u884c\u5927\u91cf\u7f16\u8f91\u7684\u5e94\u7528\u53ef\u80fd\u5e0c\u671b\u5728 state \u4e2d\u4fdd\u6301\u4e24\u7ec4 \u201c\u8868\u201d\uff0c\u4e00\u4e2a\u7528\u4e8e\u5b58\u50a8 \u201c\u5f53\u524d\u201d\uff08current\uff09 \u7684\u9879\u76ee\uff0c\u4e00\u4e2a\u7528\u4e8e\u5b58\u50a8 \u201c\u6b63\u5728\u8fdb\u884c\u4e2d\u201d(work-in-progress) \u7684\u9879\u76ee\u3002\u5f53\u6570\u636e\u9879\u5728\u88ab\u7f16\u8f91\u7684\u65f6\u5019\uff0c\u5176\u503c\u53ef\u4ee5\u88ab\u590d\u5236\u5230 \u201c\u6b63\u5728\u8fdb\u884c\u4e2d\u201d \u7684\u90a3\u4e2a\u8868\u4e2d\uff0c\u4efb\u4f55\u66f4\u65b0\u4ed6\u7684\u52a8\u4f5c\u90fd\u5c06\u5728 \u201c\u6b63\u5728\u8fdb\u884c\u4e2d\u201d \u7684\u8868\u4e2d\u5de5\u4f5c\uff0c\u7f16\u8f91\u8868\u5355\u88ab\u8be5\u7ec4\u6570\u636e\u63a7\u5236\u7740\uff0cUI \u4ecd\u7136\u88ab\u539f\u59cb\u6570\u636e\u63a7\u5236\u7740\u3002\u8868\u5355\u7684 \u201c\u91cd\u7f6e\u201d \u901a\u8fc7\u79fb\u9664 \u201c\u6b63\u5728\u8fdb\u884c\u4e2d\u201d \u8868\u7684\u6570\u636e\u9879\u7136\u540e\u4ece \u201c\u5f53\u524d\u201d \u8868\u4e2d\u590d\u5236\u539f\u59cb\u6570\u636e\u5230 \u201c\u6b63\u5728\u8fdb\u884c\u4e2d\u201d \u8868\u4e2d\u5c31\u80fd\u8f7b\u6613\u505a\u5230\uff0c\u8868\u5355\u7684 \u201c\u5e94\u7528\u201d \u901a\u8fc7\u628a \u201c\u6b63\u5728\u8fdb\u884c\u4e2d\u201d \u8868\u7684\u6570\u636e\u590d\u5236\u5230 \u201c\u5f53\u524d\u201d \u8868\u4e2d\u5c31\u80fd\u5b9e\u73b0\u3002"),(0,o.kt)("h2",{id:"\u8868\u95f4\u5173\u7cfb"},"\u8868\u95f4\u5173\u7cfb"),(0,o.kt)("p",null,"\u56e0\u4e3a\u6211\u4eec\u5c06 Redux Store \u89c6\u4e3a\u6570\u636e\u5e93\uff0c\u6240\u4ee5\u5728\u5f88\u591a\u6570\u636e\u5e93\u7684\u8bbe\u8ba1\u89c4\u5219\u5728\u8fd9\u91cc\u4e5f\u662f\u9002\u7528\u7684\u3002\u4f8b\u5982\uff0c\u5bf9\u4e8e\u591a\u5bf9\u591a\u7684\u5173\u7cfb\uff0c\u53ef\u4ee5\u8bbe\u8ba1\u4e00\u5f20\u4e2d\u95f4\u8868\u5b58\u50a8\u76f8\u5173\u8054\u9879\u76ee\u7684 ID\uff08\u7ecf\u5e38\u88ab\u79f0\u4f5c \u201c\u8fde\u63a5\u8868\u201d \u6216\u8005 \u201c\u5173\u8054\u8868\u201d\uff09\u3002\u4e3a\u4e86\u4e00\u81f4\u8d77\u89c1\uff0c\u6211\u4eec\u8fd8\u4f1a\u4f7f\u7528\u76f8\u540c\u7684 ",(0,o.kt)("inlineCode",{parentName:"p"},"byId")," \u548c ",(0,o.kt)("inlineCode",{parentName:"p"},"allIds")," \u7528\u4e8e\u5b9e\u9645\u7684\u6570\u636e\u9879\u8868\u4e2d\u3002"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},"{\n    entities: {\n        authors : { byId : {}, allIds : [] },\n        books : { byId : {}, allIds : [] },\n        authorBook : {\n            byId : {\n                1 : {\n                    id : 1,\n                    authorId : 5,\n                    bookId : 22\n                },\n                2 : {\n                    id : 2,\n                    authorId : 5,\n                    bookId : 15,\n                }\n                3 : {\n                    id : 3,\n                    authorId : 42,\n                    bookId : 12\n                }\n            },\n            allIds : [1, 2, 3]\n\n        }\n    }\n}\n")),(0,o.kt)("p",null,"\u50cf \u201c\u67e5\u627e\u8fd9\u4e2a\u4f5c\u8005\u6240\u6709\u7684\u4e66\u201d \u8fd9\u4e2a\u64cd\u4f5c\u53ef\u4ee5\u901a\u8fc7\u5728\u8fde\u63a5\u8868\u4e0a\u4e00\u4e2a\u5355\u4e00\u7684\u5faa\u73af\u6765\u5b9e\u73b0\u3002\u76f8\u5bf9\u4e8e\u5e94\u7528\u4e2d\u4e00\u822c\u60c5\u51b5\u4e0b\u6570\u636e\u91cf\u548c JavaScript \u5f15\u64ce\u7684\u8fd0\u884c\u901f\u5ea6\uff0c\u5728\u5927\u591a\u6570\u60c5\u51b5\u4e0b\uff0c\u8fd9\u6837\u64cd\u4f5c\u7684\u6027\u80fd\u662f\u8db3\u591f\u597d\u7684\u3002"),(0,o.kt)("h2",{id:"\u5d4c\u5957\u6570\u636e\u8303\u5f0f\u5316"},"\u5d4c\u5957\u6570\u636e\u8303\u5f0f\u5316"),(0,o.kt)("p",null,"\u56e0\u4e3a API \u7ecf\u5e38\u4ee5\u5d4c\u5957\u7684\u5f62\u5f0f\u53d1\u9001\u8fd4\u56de\u6570\u636e\uff0c\u6240\u4ee5\u8be5\u6570\u636e\u9700\u8981\u5728\u5f15\u5165\u72b6\u6001\u6811\u4e4b\u524d\u8f6c\u5316\u4e3a\u89c4\u8303\u5316\u5f62\u6001\u3002",(0,o.kt)("a",{parentName:"p",href:"https://github.com/paularmstrong/normalizr"},"Normalizr")," \u5e93\u53ef\u4ee5\u5e2e\u52a9\u4f60\u5b9e\u73b0\u8fd9\u4e2a\u3002\u4f60\u53ef\u4ee5\u5b9a\u4e49 schema \u7684\u7c7b\u578b\u548c\u5173\u7cfb\uff0c\u5c06 schema \u548c\u54cd\u5e94\u6570\u636e\u63d0\u4f9b\u7ed9 Normalizr\uff0c\u4ed6\u4f1a\u8f93\u51fa\u54cd\u5e94\u6570\u636e\u7684\u8303\u5f0f\u5316\u53d8\u6362\u3002\u8f93\u51fa\u53ef\u4ee5\u653e\u5728 action \u4e2d\uff0c\u7528\u4e8e store \u7684\u66f4\u65b0\u3002\u6709\u5173\u5176\u7528\u6cd5\u7684\u66f4\u591a\u8be6\u7ec6\u4fe1\u606f\uff0c\u8bf7\u53c2\u9605 Normalizr \u6587\u6863\u3002"))}d.isMDXComponent=!0}}]);