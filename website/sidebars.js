module.exports = {
  docs: {
    '简介': [
      'introduction/getting-started',
      'introduction/installation',
      'introduction/core-concepts',
      'introduction/learning-resources',
      'introduction/ecosystem',
      'introduction/examples'
    ],
    '教程': [
      'tutorials/tutorials-index',
      {
        type: 'category',
        label: 'Redux 基础',
        items: [
          'tutorials/essentials/part-1-overview-concepts',
          'tutorials/essentials/part-2-app-structure',
          'tutorials/essentials/part-3-data-flow',
          'tutorials/essentials/part-4-using-data',
          'tutorials/essentials/part-5-async-logic',
          'tutorials/essentials/part-6-performance-normalization'
        ]
      },
      {
        type: 'category',
        label: 'Redux 进阶',
        items: [
          'tutorials/fundamentals/part-1-overview',
          'tutorials/fundamentals/part-2-concepts-data-flow',
          'tutorials/fundamentals/part-3-state-actions-reducers',
          'tutorials/fundamentals/part-4-store',
          'tutorials/fundamentals/part-5-ui-react',
          'tutorials/fundamentals/part-6-async-logic',
          'tutorials/fundamentals/part-7-standard-patterns',
          'tutorials/fundamentals/part-8-modern-redux'
        ]
      }
    ],
    '技巧': [
      'recipes/recipe-index',
      'recipes/configuring-your-store',
      'recipes/usage-with-typescript',
      'recipes/migrating-to-redux',
      'recipes/using-object-spread-operator',
      'recipes/reducing-boilerplate',
      'recipes/server-rendering',
      'recipes/writing-tests',
      'recipes/computing-derived-data',
      'recipes/implementing-undo-history',
      'recipes/isolating-redux-sub-apps',
      'recipes/code-splitting',
      'recipes/troubleshooting',
      {
        type: 'category',
        label: '组织 Reducers',
        items: [
          'recipes/structuring-reducers/structuring-reducers',
          'recipes/structuring-reducers/prerequisite-concepts',
          'recipes/structuring-reducers/basic-reducer-structure',
          'recipes/structuring-reducers/splitting-reducer-logic',
          'recipes/structuring-reducers/refactoring-reducer-example',
          'recipes/structuring-reducers/using-combinereducers',
          'recipes/structuring-reducers/beyond-combinereducers',
          'recipes/structuring-reducers/normalizing-state-shape',
          'recipes/structuring-reducers/updating-normalized-data',
          'recipes/structuring-reducers/reusing-reducer-logic',
          'recipes/structuring-reducers/immutable-update-patterns',
          'recipes/structuring-reducers/initializing-state'
        ]
      }
    ],
    '深入理解 Redux': [
      {
        type: 'category',
        label: '像 Redux 一样思考',
        items: [
          'understanding/thinking-in-redux/motivation',
          'understanding/thinking-in-redux/three-principles',
          'understanding/thinking-in-redux/glossary'
        ]
      },
      {
        type: 'category',
        label: '历史与设计原则',
        items: [
          'understanding/history-and-design/prior-art',
          'understanding/history-and-design/middleware'
        ]
      }
    ],
    '常见问题': [
      'faq',
      'faq/general',
      'faq/reducers',
      'faq/organizing-state',
      'faq/store-setup',
      'faq/actions',
      'faq/immutable-data',
      'faq/code-structure',
      'faq/performance',
      'faq/design-decisions',
      'faq/react-redux',
      'faq/miscellaneous'
    ],
    '编码规范': ['style-guide/style-guide'],
    'API 文档': [
      'api/api-reference',
      'api/createstore',
      'api/store',
      'api/combinereducers',
      'api/applymiddleware',
      'api/bindactioncreators',
      'api/compose'
    ],
    'Redux Toolkit': ['redux-toolkit/overview']
  }
}
