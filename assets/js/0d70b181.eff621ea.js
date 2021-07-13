(self.webpackChunk=self.webpackChunk||[]).push([[5484],{3905:function(e,t,n){"use strict";n.d(t,{Zo:function(){return c},kt:function(){return h}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var u=a.createContext({}),s=function(e){var t=a.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=s(e.components);return a.createElement(u.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,u=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),m=s(n),h=r,d=m["".concat(u,".").concat(h)]||m[h]||p[h]||i;return n?a.createElement(d,o(o({ref:t},c),{},{components:n})):a.createElement(d,o({ref:t},c))}));function h(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=m;var l={};for(var u in t)hasOwnProperty.call(t,u)&&(l[u]=t[u]);l.originalType=e,l.mdxType="string"==typeof e?e:r,o[1]=l;for(var s=2;s<i;s++)o[s]=n[s];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},8549:function(e,t,n){"use strict";n.r(t),n.d(t,{frontMatter:function(){return o},metadata:function(){return l},toc:function(){return u},default:function(){return c}});var a=n(2122),r=n(9756),i=(n(7294),n(3905)),o={id:"miscellaneous",title:"Miscellaneous",hide_title:!1},l={unversionedId:"faq/miscellaneous",id:"faq/miscellaneous",isDocsHomePage:!1,title:"Redux FAQ: Miscellaneous",description:"Table of Contents",source:"@site/../docs/faq/Miscellaneous.md",sourceDirName:"faq",slug:"/faq/miscellaneous",permalink:"/redux-in-chinese/faq/miscellaneous",version:"current",frontMatter:{id:"miscellaneous",title:"Miscellaneous",hide_title:!1},sidebar:"docs",previous:{title:"Redux FAQ: React Redux",permalink:"/redux-in-chinese/faq/react-redux"},next:{title:"Style Guide",permalink:"/redux-in-chinese/style-guide/style-guide"}},u=[{value:"Table of Contents",id:"table-of-contents",children:[]},{value:"Miscellaneous",id:"miscellaneous",children:[{value:"Are there any larger, \u201creal\u201d Redux projects?",id:"are-there-any-larger-real-redux-projects",children:[]},{value:"How can I implement authentication in Redux?",id:"how-can-i-implement-authentication-in-redux",children:[]}]}],s={toc:u};function c(e){var t=e.components,n=(0,r.Z)(e,["components"]);return(0,i.kt)("wrapper",(0,a.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"table-of-contents"},"Table of Contents"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#are-there-any-larger-real-redux-projects"},"Are there any larger, \u201creal\u201d Redux projects?")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#how-can-i-implement-authentication-in-redux"},"How can I implement authentication in Redux?"))),(0,i.kt)("h2",{id:"miscellaneous"},"Miscellaneous"),(0,i.kt)("h3",{id:"are-there-any-larger-real-redux-projects"},"Are there any larger, \u201creal\u201d Redux projects?"),(0,i.kt)("p",null,"Yes, lots of them! To name just a few:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://mobile.twitter.com/"},"Twitter's mobile site")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/Automattic/wp-calypso"},"Wordpress's new admin page")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/devtools-html/debugger.html"},"Firefox's new debugger")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/zeit/hyperterm"},"The HyperTerm terminal application"))),(0,i.kt)("p",null,"And many, many more! The Redux Addons Catalog has ",(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("a",{parentName:"strong",href:"https://github.com/markerikson/redux-ecosystem-links/blob/master/apps-and-examples.md"},"a list of Redux-based applications and examples"))," that points to a variety of actual applications, large and small."),(0,i.kt)("h4",{id:"further-information"},"Further information"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Documentation")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/redux-in-chinese/introduction/examples"},"Introduction: Examples"))),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Discussions")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.reddit.com/r/reactjs/comments/496db2/large_open_source_reactredux_projects/"},"Reddit: Large open source react/redux projects?")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://news.ycombinator.com/item?id=10710240"},"HN: Is there any huge web application built using Redux?"))),(0,i.kt)("h3",{id:"how-can-i-implement-authentication-in-redux"},"How can I implement authentication in Redux?"),(0,i.kt)("p",null,"Authentication is essential to any real application. When going about authentication you must keep in mind that nothing changes with how you should organize your application and you should implement authentication in the same way you would any other feature. It is relatively straightforward:"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("p",{parentName:"li"},"Create action constants for ",(0,i.kt)("inlineCode",{parentName:"p"},"LOGIN_SUCCESS"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"LOGIN_FAILURE"),", etc.")),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("p",{parentName:"li"},"Create action creators that take in credentials, a flag that signifies whether authentication succeeded, a token, or an error message as the payload.")),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("p",{parentName:"li"},"Create an async action creator with Redux Thunk middleware or any middleware you see fit to fire a network request to an API that returns a token if the credentials are valid. Then save the token in the local storage or show a response to the user if it failed. You can perform these side effects from the action creators you wrote in the previous step.")),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("p",{parentName:"li"},"Create a reducer that returns the next state for each possible authentication case (",(0,i.kt)("inlineCode",{parentName:"p"},"LOGIN_SUCCESS"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"LOGIN_FAILURE"),", etc)."))),(0,i.kt)("h4",{id:"further-information-1"},"Further information"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Articles")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://auth0.com/blog/2016/01/04/secure-your-react-and-redux-app-with-jwt-authentication/"},"Authentication with JWT by Auth0")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://medium.com/@MattiaManzati/tips-to-handle-authentication-in-redux-2-introducing-redux-saga-130d6872fbe7"},"Tips to Handle Authentication in Redux"))),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Examples")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/joshgeller/react-redux-jwt-auth-example"},"react-redux-jwt-auth-example"))),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Libraries")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/markerikson/redux-ecosystem-links/blob/master/use-cases.md#authentication"},"Redux Addons Catalog: Use Cases - Authentication"))))}c.isMDXComponent=!0}}]);