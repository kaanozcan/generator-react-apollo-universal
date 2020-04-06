module.exports = {
  "env": {
    "node": {
      "plugins": [
        "dynamic-import-node",
      ]
    },
    "browser": {
      "plugins": [
        "@babel/syntax-dynamic-import"
      ]
    }
  },
  "only": [
    "./lib/**/*.js",
    "./src/**/*.js"
  ],
  "presets": [
    ["@babel/preset-env", {
      "useBuiltIns": "entry",
      "corejs": "3.6.4",
      "targets": {
        "node": "current"
      }
    }],
    "@babel/preset-flow",
    "@babel/preset-react"
  ],
  "plugins": [
    "@babel/plugin-transform-async-to-generator",
    "@babel/plugin-transform-regenerator",
    "@babel/plugin-proposal-function-bind",
    "@babel/plugin-proposal-export-default-from",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-proposal-logical-assignment-operators",
    ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
    ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
    ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }],
    "@babel/plugin-proposal-do-expressions",

    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    "@babel/plugin-proposal-function-sent",
    "@babel/plugin-proposal-numeric-separator",
    "@babel/plugin-proposal-throw-expressions",

    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-syntax-import-meta",
    ["@babel/plugin-proposal-class-properties", { "loose": false }],
    "@babel/plugin-proposal-json-strings"
  ]
}
