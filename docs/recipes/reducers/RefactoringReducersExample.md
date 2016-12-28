# 使用函数分解（Functional Decomposition）和 Reducer 组合（Reducer Composition）重构 Reducer

看看不同类型的 `sub-reducer` 和如何把他们组合在一起的例子是很有用的。现在让我们看看如何将一个大型的单个 reducer 重构为多个比较小的函数的组合。

> 注意： 为了说明重构的概念和过程而不是为了编写简洁的代码，这个例子是特意以冗长的风格编写的

#### 初遇 Reducer

让我们看看初始 reducer 长什么样：

``` javascript
const initialState = {
    visibilityFilter : 'SHOW_ALL',
    todos : []
};


function appReducer(state = initialState, action) {
    switch(action.type) {
        case 'SET_VISIBILITY_FILTER' : {
            return Object.assign({}, state, {
                visibilityFilter : action.filter
            });
        }
        case 'ADD_TODO' : {
            return Object.assign({}, state, {
                todos : state.todos.concat({
                    id: action.id,
                    text: action.text,
                    completed: false
                })
            });
        }
        case 'TOGGLE_TODO' : {
            return Object.assign({}, state, {
                todos : state.todos.map(todo => {
                    if (todo.id !== action.id) {
                      return todo;
                    }

                    return Object.assign({}, todo, {
                        completed : !todo.completed
                    })
                  })
            });
        }
        case 'EDIT_TODO' : {
            return Object.assign({}, state, {
                todos : state.todos.map(todo => {
                    if (todo.id !== action.id) {
                      return todo;
                    }

                    return Object.assign({}, todo, {
                        text : action.text
                    })
                  })
            });
        }
        default : return state;
    }
}

```

这个函数非常短，但已经开始变得比较复杂。我们在处理两个不同的区域（filtering 和 todo 列表），嵌套使得更新逻辑难以阅读，并且会让我们不清楚到底是什么跟什么。

#### 提取工具函数（Extracting Utility Functions）

第一步是写一个返回更新了相应区域的新对象。这儿还有一个重复的逻辑是在更新数组中的特定项目，我们也可以将他提成一个函数。

``` javascript
function updateObject(oldObject, newValues) {
    // 用空对象作为第一个参数传递给 Object.assign，以确保是复制数据，而不是去改变原来的数据
    return Object.assign({}, oldObject, newValues);
}

function updateItemInArray(array, itemId, updateItemCallback) {
    const updatedItems = array.map(item => {
        if(item.id !== itemId) {
            // 因为我们只想更新一个项目，所以保留所有的其他项目
            return item;
        }

        // 使用提供的回调来创建新的项目
        const updatedItem = updateItemCallback(item);
        return updatedItem;
    });

    return updatedItems;
}

function appReducer(state = initialState, action) {
    switch(action.type) {
        case 'SET_VISIBILITY_FILTER' : {
            return updateObject(state, {visibilityFilter : action.filter});
        }
        case 'ADD_TODO' : {
            const newTodos = state.todos.concat({
                id: action.id,
                text: action.text,
                completed: false
            });

            return updateObject(state, {todos : newTodos});
        }
        case 'TOGGLE_TODO' : {
            const newTodos = updateItemInArray(state.todos, action.id, todo => {
                return updateObject(todo, {completed : !todo.completed});
            });

            return updateObject(state, {todos : newTodos});
        }
        case 'EDIT_TODO' : {
            const newTodos = updateItemInArray(state.todos, action.id, todo => {
                return updateObject(todo, {text : action.text});
            });

            return updateObject(state, {todos : newTodos});
        }
        default : return state;
    }
}
```

这样就减少了重复，使得代码的可读性更高。

#### 提取 case reducer

接下来，把特殊逻辑封装成对应的函数：

``` javascript
// 省略了内容
function updateObject(oldObject, newValues) {}
function updateItemInArray(array, itemId, updateItemCallback) {}


function setVisibilityFilter(state, action) {
    return updateObject(state, {visibilityFilter : action.filter });
}

function addTodo(state, action) {
    const newTodos = state.todos.concat({
        id: action.id,
        text: action.text,
        completed: false
    });

    return updateObject(state, {todos : newTodos});
}

function toggleTodo(state, action) {
    const newTodos = updateItemInArray(state.todos, action.id, todo => {
        return updateObject(todo, {completed : !todo.completed});
    });

    return updateObject(state, {todos : newTodos});
}

function editTodo(state, action) {
    const newTodos = updateItemInArray(state.todos, action.id, todo => {
        return updateObject(todo, {text : action.text});
    });

    return updateObject(state, {todos : newTodos});
}

function appReducer(state = initialState, action) {
    switch(action.type) {
        case 'SET_VISIBILITY_FILTER' : return setVisibilityFilter(state, action);
        case 'ADD_TODO' : return addTodo(state, action);
        case 'TOGGLE_TODO' : return toggleTodo(state, action);
        case 'EDIT_TODO' : return editTodo(state, action);
        default : return state;
    }
}
```

现在很清楚每个 `case` 发生了什么。我们也可以看到一些模式的雏形。

#### 按域拆分数据（Separating Data Handling by Domain）

目前的 Reducer 仍然需要关心程序中所有不同的 case。下面尝试把 filter 逻辑和 todo 逻辑分离：

``` javascript
// 省略了内容
function updateObject(oldObject, newValues) {}
function updateItemInArray(array, itemId, updateItemCallback) {}



function setVisibilityFilter(visibilityState, action) {
    // 从技术上将，我们甚至不关心之前的状态
    return action.filter;
}

function visibilityReducer(visibilityState = 'SHOW_ALL', action) {
    switch(action.type) {
        case 'SET_VISIBILITY_FILTER' : return setVisibilityFilter(visibilityState, action);
        default : return visibilityState;
    }
};


function addTodo(todosState, action) {
    const newTodos = todosState.concat({
        id: action.id,
        text: action.text,
        completed: false
    });

    return newTodos;
}

function toggleTodo(todosState, action) {
    const newTodos = updateItemInArray(todosState, action.id, todo => {
        return updateObject(todo, {completed : !todo.completed});
    });

    return newTodos;
}

function editTodo(todosState, action) {
    const newTodos = updateItemInArray(todosState, action.id, todo => {
        return updateObject(todo, {text : action.text});
    });

    return newTodos;
}

function todosReducer(todosState = [], action) {
    switch(action.type) {
        case 'ADD_TODO' : return addTodo(todosState, action);
        case 'TOGGLE_TODO' : return toggleTodo(todosState, action);
        case 'EDIT_TODO' : return editTodo(todosState, action);
        default : return todosState;
    }
}

function appReducer(state = initialState, action) {
    return {
        todos : todosReducer(state.todos, action),
        visibilityFilter : visibilityReducer(state.visibilityFilter, action)
    };
}
```

我们注意到，两个 reducer 分别关心 state 中的不同的部分。都只需要把自身关心的数据作为参数，不再需要返回复杂的嵌套型 state 对象了，代码变得更简单。

#### 减少样板代码

马上就大功告成了。因为很多人不喜欢使用 switch 这种语法结构，创建一个 action 到 case 查找表示非常通用的做法。可以使用 [缩减样板代码](./ReducingBoilerplate.md#generating-reducers) 中提到的 `createReducer` 函数减少样板代码。

``` javascript
// 省略了内容
function updateObject(oldObject, newValues) {}
function updateItemInArray(array, itemId, updateItemCallback) {}

function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}


// 省略了内容
function setVisibilityFilter(visibilityState, action) {}

const visibilityReducer = createReducer('SHOW_ALL', {
    'SET_VISIBILITY_FILTER' : setVisibilityFilter
});

// 省略了内容
function addTodo(todosState, action) {}
function toggleTodo(todosState, action) {}
function editTodo(todosState, action) {}

const todosReducer = createReducer([], {
    'ADD_TODO' : addTodo,
    'TOGGLE_TODO' : toggleTodo,
    'EDIT_TODO' : editTodo
});

function appReducer(state = initialState, action) {
    return {
        todos : todosReducer(state.todos, action),
        visibilityFilter : visibilityReducer(state.visibilityFilter, action)
    };
}
```

#### 通过切片组合 Reducer（Combining Reducers by Slice）

最后一步了，使用 Redux 中 `combineReducers` 这个工具函数去把管理每个 state 切片的逻辑组合起来，形成顶层的 reducer。最终变成这样：

``` javascript
// 可重用的工具函数

function updateObject(oldObject, newValues) {
    // 将空对象作为第一个参数传递给 Object.assign，以确保只是复制数据，而不是去改变数据
    return Object.assign({}, oldObject, newValues);
}

function updateItemInArray(array, itemId, updateItemCallback) {
    const updatedItems = array.map(item => {
        if(item.id !== itemId) {
            // 因为我们只想更新一个项目，所以保留所有的其他项目
            return item;
        }

         // 使用提供的回调来创建新的项目
        const updatedItem = updateItemCallback(item);
        return updatedItem;
    });

    return updatedItems;
}

function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}


// 处理特殊 case 的 Handler ("case reducer")
function setVisibilityFilter(visibilityState, action) {
    // 从技术上将，我们甚至不关心之前的状态
    return action.filter;
}

// 处理整个 state 切片的 Handler ("slice reducer")
const visibilityReducer = createReducer('SHOW_ALL', {
    'SET_VISIBILITY_FILTER' : setVisibilityFilter
});

// Case reducer
function addTodo(todosState, action) {
    const newTodos = todosState.concat({
        id: action.id,
        text: action.text,
        completed: false
    });

    return newTodos;
}

// Case reducer
function toggleTodo(todosState, action) {
    const newTodos = updateItemInArray(todosState, action.id, todo => {
        return updateObject(todo, {completed : !todo.completed});
    });

    return newTodos;
}

// Case reducer
function editTodo(todosState, action) {
    const newTodos = updateItemInArray(todosState, action.id, todo => {
        return updateObject(todo, {text : action.text});
    });

    return newTodos;
}

// Slice reducer
const todosReducer = createReducer([], {
    'ADD_TODO' : addTodo,
    'TOGGLE_TODO' : toggleTodo,
    'EDIT_TODO' : editTodo
});

// 顶层 reducer
const appReducer = combineReducers({
    visibilityFilter : visibilityReducer,
    todos : todosReducer
});
```

现在我们有了分离集中 reducer 的例子：像 `updateObject` 和 `createReducer` 一样的工具函数，像 `setVisibilityFilter` 和 `addTodo` 一样的处理器（Handler），像 `visibilityReducer` 和 `todosReducer` 一样的处理单个切片数据的 Handler。`appReducer` 可以被当作是顶层 reducer。

这个例子中最后的结果看上去比原始的版本更长，这主要是因为工具函数的提取，注释的添加和一些为了清楚起见的故意冗长（比如单独的 return 语句）。单独的看每个功能，他们承担的责任更小，意图也更加清楚。在真正的应用中，这些函数将会分到单独的文件中，比如：`reducerUtilities.js`，`visibilityReducer.js`，`todosReudcer.js` 和 `rootReducer.js`。
