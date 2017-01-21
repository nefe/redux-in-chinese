# 不可变更新模式

在 [redux 基本概念的不可变数据管理](PrerequisiteConcepts.html) 中给出一些示例，演示了不可变的基本更新操作，例如，更新一个对象中一个字段，或者，在数组的末尾增加一个数据。然而，reducer 经常需要综合使用这些基本操作去处理更加复杂的任务。下面是一些你可能必须去实现的常见任务的例子。

## 更新嵌套的对象

更新嵌套数据的关键是必须适当地复制和更新嵌套的每个级别。这往往是那些学习 redux 一个难以理解的概念，当试图更新嵌套对象的时候，有一些具体的问题会经常出现。这些意外的导致了直接变化，应该被避免。

##### 常见错误 #1：指向同一对象的新变量

定义一个新变量不会创建一个新的实际对象，它只创建另一个引用到同一个对象。这个错误的示例如下：

```javascript
function updateNestedState(state, action) {
    let nestedState = state.nestedState;
    // 错误: 这将导致直接修改已经存在的对象引用-不要这么做!
    nestedState.nestedField = action.data;

    return {
        ...state,
        nestedState
    };
}
```

这个函数正确返回了顶层状态对象的浅复制，但是变量 `nestedState` 依然指向已经存在的对象，这个状态被直接修改了。

##### 常见错误 #2：仅仅在一个层级上做浅复制  

这个错误的另外一个常见版本的如下所示：

```javascript
function updateNestedState(state, action) {
    // 问题: 这仅仅做了浅复制！
    let newState = {...state};

    // 错误: nestedState 仍然是同一个对象!
    newState.nestedState.nestedField = action.data;

    return newState;
}
```

做一个顶层的浅复制是不够的 - `nestedState` 对象也应该被复制。

##### 正确方法：复制嵌套数据的所有层级

不幸的是，正确地使用不变的更新去深度嵌套状态的过程很容易变得冗长难读。 更新 `ate.first.second[someId].fourth` 的示例大概如下所示：

```javascript
function updateVeryNestedField(state, action) {
    return {
        ....state,
        first : {
            ...state.first,
            second : {
                ...state.first.second,
                [action.someId] : {
                    ...state.first.second[action.someId],
                    fourth : action.someValue
                }
            }
        }
    }
}
```

显然，每一层嵌套使得阅读更加困难，并给了更多犯错的机会。这是其中一个原因，鼓励你保持状态扁平，尽可能构建 reducer。

## 在数组中插入和删除数据

通常，一个 Javascript 数组中内容使用变化的函数来修改，例如，`push` , `unshift`, `shift` 。因为我们不想在 reducer 中直接修改状态，这些通常应该被避免。正因如此，你可能会看到 “插入” 和 “删除” 的行为如下所示：

```javascript
function insertItem(array, action) {
    return [
        ...array.slice(0, action.index),
        action.item,
        ...array.slice(action.index)
    ]
}

function removeItem(array, action) {
    return [
        ...array.slice(0, action.index),
        ...array.slice(action.index + 1)
    ];
}
```

但是，请记住，关键是原始内存中的引用没有被修改。**只要首先我们做了复制，我们就可以安全的变化这个复制。** 请注意，这个对于数组和对象都是正确的，但嵌套的数据仍然必须使用相同的规则更新。

这意味着我们也可以编写插入和删除函数如下所示：

```javascript
function insertItem(array, action) {
    let newArray = array.slice();
    newArray.splice(action.index, 0, action.item);
    return newArray;
}

function removeItem(array, action) {
    let newArray = array.slice();
    newArray.splice(action.index, 1);
    return newArray;
}
```

删除函数也可以是这样：

```javascript
function removeItem(array, action) {
    return array.filter( (item, index) => index !== action.index);
}
```

## 在一个数组中更新一个项目

更新数组的一项可以使用 `Array.map`, 返回我们想要更新那项的一个新值，和其他项原先的值：

```javascript
function updateObjectInArray(array, action) {
    return array.map( (item, index) => {
        if(index !== action.index) {
            // 这不是我们关心的项-保持原来的值
            return item;
        }

        // 否则, 这是我们关心的-返回一个更新的值
        return {
            ...item,
            ...action.item
        };    
    });
}
```

## 不可变更新工具库

因为编写不可变的更新代码可能变得乏味，所以有许多工具程序库试图抽象出这个过程。这些库在 API 和用法上有所不同，但都试图提供一种更短和更简洁的方式来编写这些更新。有些，像 [dot-prop-immutable](https://github.com/debitoor/dot-prop-immutable) ，使用字符串路径作为命令：

```javascript
state = dotProp.set(state, `todos.${index}.complete`, true)
```

其他的，例如  [immutability-helper](https://github.com/kolodny/immutability-helper) （现在过时的 React 不可变助手插件的一个复制），使用嵌套数据和助手函数：

```javascript
var collection = [1, 2, {a: [12, 17, 15]}];
var newCollection = update(collection, {2: {a: {$splice: [[1, 1, 13, 14]]}}});
```

这些可以有效的替代了手写不可变更新逻辑。

许多不可变更新工具的列表可以在  [Immutable Data#Immutable Update Utilities](https://github.com/markerikson/redux-ecosystem-links/blob/master/immutable-data.md#immutable-update-utilities) 的  [Redux Addons Catalog](https://github.com/markerikson/redux-ecosystem-links) 部分找到。