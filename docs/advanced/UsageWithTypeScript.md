# 搭配 TypeScript

**TypeScript** 是 JavaScript 类型的超集。由于其带来的好处，它最近在应用中变得流行。如果您尚未使用过 TypeScript，强烈建议您在继续阅读之前先熟悉它。 您可以查看其[文档](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)。

TypeScript 可以为 Redux 应用程序带来以下好处：

1. 为 reducer、state 和 action creator 带来类型安全
2. 轻松重构 type 代码
3. 在团队协作环境中获得愉悦的开发体验

## 实例

我们将通过一个简单的聊天应用程序来演示包含静态类型的可能方法。这个聊天应用程序将有两个 reducer。**chat reducer** 将专注于存储聊天记录，**system reducer** 将专注于存储会话信息。

完整的源代码可在 [codesandbox](https://codesandbox.io/s/w02m7jm3q7) 查看。请注意，通过亲自阅读这个示例，您将体验到使用 TypeScript 的一些好处。

## 为 State 增加类型检查

向每个 state 切片添加类型是一个很好的开始，因为它不依赖于其他类型。在这个例子中，我们首先描述 **chat reducer** 相关的 state 切片：

```ts
// src/store/chat/types.ts

export interface Message {
  user: string
  message: string
  timestamp: number
}

export interface ChatState {
  messages: Message[]
}
```

然后对 **system reducer** 相关的 state 切片做同样的处理：

```ts
// src/store/system/types.ts

export interface SystemState {
  loggedIn: boolean
  session: string
  userName: string
}
```

请注意，我们正在导出这些 interface，以便稍后在 reducer 和 action creators 中重用它们。

## 为 Action & Action Creator 增加类型检查

我们将使用字符串文字并使用 `typeof` 来声明我们的 action 常量和推断类型。 请注意，我们自己权衡是否需要在单独的文件中声明我们的类型。 将我们的类型分成单独的文件，可以让我们的其他文件更专注于它们的目的。 虽然这种方式可以提高代码库的可维护性，但是您依旧可以按照自己的喜好组织代码结构。

chat Action 常量和形状：

```ts
// src/store/chat/types.ts
export const SEND_MESSAGE = 'SEND_MESSAGE'
export const DELETE_MESSAGE = 'DELETE_MESSAGE'

interface SendMessageAction {
  type: typeof SEND_MESSAGE
  payload: Message
}

interface DeleteMessageAction {
  type: typeof DELETE_MESSAGE
  meta: {
    timestamp: number
  }
}

export type ChatActionTypes = SendMessageAction | DeleteMessageAction
```

请注意，我们在此处使用 TypeScript 的联合类型来表达所有可能的操作。

声明这些类型后，我们现在还可以对 chat 的 action creator 做类型检查。在这种情况下，我们利用 TypeScript 的 inference：

```ts
// src/store/chat/actions.ts

import { Message, SEND_MESSAGE, DELETE_MESSAGE } from './types'

// TypeScript infers that this function is returning SendMessageAction
export function sendMessage(newMessage: Message) {
  return {
    type: SEND_MESSAGE,
    payload: newMessage
  }
}

// TypeScript infers that this function is returning DeleteMessageAction
export function deleteMessage(timestamp: number) {
  return {
    type: DELETE_MESSAGE,
    meta: {
      timestamp
    }
  }
}
```

system action 常量和形状：

```ts
// src/store/system/types.ts
export const UPDATE_SESSION = 'UPDATE_SESSION'

interface UpdateSessionAction {
  type: typeof UPDATE_SESSION
  payload: SystemState
}

export type SystemActionTypes = UpdateSessionAction
```

有了这些类型，我们现在也可以对 system 的 action creator 做类型检查：

```ts
// src/store/system/actions.ts

import { SystemState, UPDATE_SESSION } from './types'

export function updateSession(newSession: SystemState) {
  return {
    type: UPDATE_SESSION,
    payload: newSession
  }
}
```

## 为 reducer 增加类型检查

reducer 只是纯函数，它输入 先前的 state 和一个 action 然后返回下一个 state。在此示例中，我们显式声明此 reducer 将接收的 action 类型以及它应返回的内容（适当的 state 切片）。 通过这些添加，TypeScript 将在我们的 action 和 state 的属性上提供丰富的智能感知。另外，当某个案例没有返回 `ChatState` 时，我们也会收到错误提示。

已增加类型检查的 chat reducer：

```ts
// src/store/chat/reducers.ts

import {
  ChatState,
  ChatActions,
  ChatActionTypes,
  SEND_MESSAGE,
  DELETE_MESSAGE
} from './types'

const initialState: ChatState = {
  messages: []
}

export function chatReducer(
  state = initialState,
  action: ChatActionTypes
): ChatState {
  switch (action.type) {
    case SEND_MESSAGE:
      return {
        messages: [...state.messages, action.payload]
      }
    case DELETE_MESSAGE:
      return {
        messages: state.messages.filter(
          message => message.timestamp !== action.meta.timestamp
        )
      }
    default:
      return state
  }
}
```

已增加类型检查的 system reducer：

```ts
// src/store/system/reducers.ts

import {
  SystemActions,
  SystemState,
  SystemActionTypes,
  UPDATE_SESSION
} from './types'

const initialState: SystemState = {
  loggedIn: false,
  session: '',
  userName: ''
}

export function systemReducer(
  state = initialState,
  action: SystemActionTypes
): SystemState {
  switch (action.type) {
    case UPDATE_SESSION: {
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      return state
  }
}
```

我们现在需要生成 root reducer 函数，通常使用 `combineReducers` 来完成。请注意，我们不必为 AppState 显式声明新接口。 我们可以使用 `ReturnType` 从 `rootReducer` 推断状态形状。

```ts
// src/store/index.ts

import { systemReducer } from './system/reducers'
import { chatReducer } from './chat/reducers'

const rootReducer = combineReducers({
  system: systemReducer,
  chat: chatReducer
})

export type AppState = ReturnType<typeof rootReducer>
```

## 搭配 React Redux

虽然 React Redux 是一个独立于 redux 本身的库，但它通常与 react 一起使用。出于这个原因，我们将使用本节前面使用的相同示例来了解 React Redux 如何使用 TypeScript。

提示: React Redux 本身没有类型检查，你必须通过运行 `npm i @types/react-redux -D` 来安装 `@types/react-redux`。

我们现在将对 `mapStateToProps` 接收的参数添加类型检查。 幸运的是，我们已经通过定义一个从 `rootReducer` 推断的类型来声明 store 应该是什么样子：

```ts
// src/App.tsx

import { AppState } from './store'

const mapStateToProps = (state: AppState) => ({
  system: state.system,
  chat: state.chat
})
```

在这个例子中，我们在 `mapStateToProps` 中声明了两个不同的属性。 要对这些属性做类型检查，我们将使用适当的 state 切片创建一个 interface：

```ts
// src/App.tsx

import { SystemState } from './store/system/types'

import { ChatState } from './store/chat/types'

interface AppProps {
  chat: ChatState
  system: SystemState
}
```

我们现在可以使用这个 interface 来指定相应组件将接收的 props，如下所示：

```ts
// src/App.tsx

class App extends React.Component<AppProps> {
```

在这个组件中，我们还将 action creator 映射到组件的 props 中。在相同的 `AppProps` interface 中，我们将使用强大的 `typeof` 功能让 TypeScript 了解我们的 action creator 所期望的内容：

```ts
// src/App.tsx

import { SystemState } from './store/system/types'
import { updateSession } from './store/system/actions'

import { ChatState } from './store/chat/types'
import { sendMessage } from './store/chat/actions'

interface AppProps {
  sendMessage: typeof sendMessage
  updateSession: typeof updateSession
  chat: ChatState
  system: SystemState
}
```

通过这些添加，可以对来自 redux 侧的 props 进行类型检查。 您可以根据需要扩展 interface，以便考虑从父组件传递的其他 props。

## 搭配 Redux Thunk

Redux Thunk 是常用的异步请求中间件。可在[此处](https://github.com/reduxjs/redux-thunk)查看其文档。 thunk 是一个返回另一个参数为 `dispatch` 和 `getState` 的函数的函数。 Redux Thunk 有一个内置类型 `ThunkAction`，我们可以这样使用：

```ts
// src/thunks.ts

import { Action } from 'redux'
import { sendMessage } from './store/chat/actions'
import { AppState } from './store'
import { ThunkAction } from 'redux-thunk'

export const thunkSendMessage = (
  message: string
): ThunkAction<void, AppState, null, Action<string>> => async dispatch => {
  const asyncResp = await exampleAPI()
  dispatch(
    sendMessage({
      message,
      user: asyncResp,
      timestamp: new Date().getTime()
    })
  )
}

function exampleAPI() {
  return Promise.resolve('Async Chat Bot')
}
```

强烈建议在您的 dispatch 中使用 action creator，因为我们可以重用对这些函数的类型检查。

## 提示和注意事项

- 本文档主要介绍了 redux 的类型检查方面。出于演示目的，codesandbox 示例还演示了 redux 与 React Redux 的集成。
- 有很多种对 redux 提供类型检查的方法，这只是其中的一中。
- 此示例仅用于显示此方法，这意味着其他高级概念已被删除以简化操作。如果你是拆分你的 redux 的代码，请看[这篇文章](https://medium.com/@matthewgerstman/redux-with-code-splitting-and-type-checking-205195aded46)。
- 要知道 TypeScript 确实有它自身的优缺点。权衡这些优缺点来判断 TypeScript 是否适用于你的应用。
