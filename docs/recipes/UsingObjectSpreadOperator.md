# 使用对象展开运算符（Object Spread Operator）

从不直接修改 state 是 Redux 的核心理念之一, 所以你会发现自己总是在使用 [`Object.assign()`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) 创建对象拷贝, 而拷贝中会包含新创建或更新过的属性值。在下面的 `todoApp` 示例中, `Object.assign()` 将会返回一个新的
`state` 对象, 而其中的 `visibilityFilter` 属性被更新了:

``` javascript
function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    default:
      return state
  }
}
```

尽管这样可行, 但 `Object.assign()` 冗长的写法会迅速降低 reducer 的可读性。

一个可行的替代方案是使用 ES7 提案的 [对象展开运算符](https://github.com/sebmarkbage/ecmascript-rest-spread)。该提案让你可以通过展开运算符 (`...`) , 以更加简洁的形式将一个对象的可枚举属性拷贝至另一个对象。对象展开运算符在概念上与 ES6 的 [数组展开运算符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) 相似。 我们试着用这种方式简化 `todoApp` :

``` javascript
function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return { ...state, visibilityFilter: action.filter }
    default:
      return state
  }
}
```

当你在组合复杂对象时, 使用对象展开运算符带来的好处将更加突出。例如下面的 `getAddedIds` 将一个 `id` 数组转换为一个对象数组, 而这些对象的内容是由 `getProduct` 和 `getQuantity` 的结果组合而成。

``` javascript
return getAddedIds(state.cart).map(id => Object.assign(
  {},
  getProduct(state.products, id),
  {
    quantity: getQuantity(state.cart, id)
  }
))
```

运用对象扩展运算符简化上面的 `map` 调用:

``` javascript
return getAddedIds(state.cart).map(id => ({
  ...getProduct(state.products, id),
  quantity: getQuantity(state.cart, id)
}))
```

目前对象展开运算符提案还处于 ECMAScript Stage 3 草案阶段, 若你想在产品中使用它得依靠转换编译器, 如 [Babel](http://babeljs.io/)。 你可以使用 `es2015` 预设值, 安装 [`babel-plugin-transform-object-rest-spread`](http://babeljs.io/docs/plugins/transform-object-rest-spread/) 并将其单独添加到位于 `.babelrc` 的 `plugins` 数组中。

``` javascript
{
  "presets": ["es2015"],
  "plugins": ["transform-object-rest-spread"]
}
```

注意这仍然是一个试验性的语言特性, 在将来可能发生改变。不过一些大型项目如 [React Native](https://github.com/facebook/react-native) 已经在广泛使用它。所以我们大可放心, 即使真的发生改变, 也应该会有自动化的迁移方案。
