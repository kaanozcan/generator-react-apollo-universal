# React Apollo Universal
 A yeoman project boilerplate generator made for React.js and Apollo GraphQL stack.

## Quick Start

 ```
 $ npm install -g yo
 $ npm install generator-react-apollo-universal
 $ mkdir my-project
 $ cd my-project
 $ yo react-apollo-universal
 $ npm run develop
 ```

## Features

#### Bundling
Bundled using webpack@4 and babel@7 core-js@3. Content hashing enabled for bundle files. You will never have to invalidate cache and never will invalidate for the javascript you haven't changed.

#### CSS
PostCSS initiated with a minimal set of plugins and can be extended easily at ```postcss.config.js```. [css-modules](https://github.com/css-modules/css-modules) is set up so no need to fear specificity. CSS is bundled using webpack into javascript files and put into style tags both on client and server to prevent flickering and to enable instant display of styled markup on the initial render of document.

#### Configuration
Easy configuration just put your config files in config folder and get them using ```config.get(my.config.value)```. Choose what config values you send to client and what sensitive information you decide not to inform client about using apollo client state.

#### Apollo GraphQL
Apollo server and client with websocket support all set and ready to go.

#### Unit Tests
Jest with React Testing Library set up. Examples can be found under ```src/components/App/Todos```

## How To

#### Configuration
On server side configuration done through [node-config](https://github.com/lorenwest/node-config). Put your configuration files in config folder as shown in their documentation. Use NODE_CONFIG_ENV (instead of NODE_ENV) for setting which config you want to be loaded.

If you need access config on client use ```@client``` directive on graphql queries to access server defined set of values. You can get the values from node-config or you pass any run time value. See ```src/middlewares/index.js:46``` for how to populate these values and ```src/components/Site/index.js:10``` for how to consume these values. [For further information refer to this resource](https://www.apollographql.com/docs/react/data/local-state/)

#### GraphQL
There is an example for GraphQL modules and DataSources in src/graphql folder. You need to create your DataSources in dataSources folder and do a named export in dataSources/index.js file. For GraphQL types and resolvers they need to be structured as shown in ```src/graphql/todos``` and ```src/graphql/index.js```. There will be commands provided for the generation of these files later so this process will be automated.  

To enable subscriptions pass isWSEnabled option true to the createApolloClient function as shown below in ```src/scripts/client.js``` and ```src/middlewares/siteRenderer/index.js```  

```
const apolloClient = createApolloClient({
  isWSEnabled: true
});
```

#### Unit Tests
Create your spec files anywhere in ```src/``` or ```lib/``` and run ```npm run test```. To create coverage report run ```npm run test:coverage```. To see an example unit testing a component with graphql query go to ```src/components/App/Todos/index.spec.js```

#### CSS
To use write and use CSS simply create your CSS files in any folder you desire and import and use them. Example:

```
import React from "react";
import styles from "./my-css-file.css";

const MyComponent = () => {
  return (
      <h1 className={styles.title}>My Title</h1>
  );
}
```

While using this approach makes bundling and bundle caching very easy to handle. There is a short amount of time markup stays in an unstyled form which can cause flickering. To prevent flickering and to display styled markup instantly write your components as shown below.

```
import React from "react";
import styles from "./my-css-file.css";
import useStyles from "isomorphic-style-loader/useStyles";

const MyComponent = () => {
  useStyles(styles);

  return (
      <h1 className={styles.title}>My Title</h1>
  );
}
```

Using useStyles hook will make server put the given styles in to a style tag and include it in the document when the browser requests the page the first time. Example can be seen at ```src/components/App/Todos/index.js```

To extend the provided PostCSS plugins or remove any of them simply include them at ```postcss.config.js``` as shown below.

```
module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-url'),
    require('postcss-preset-env')({
      browsers: 'last 2 versions',
      stage: 0,
    }),
    require('some-other-postcss-plugin') //A plugin wasn't initially provided
  ],
};
```

### NPM Scripts

```npm run develop```: Watches file changes, generates bundles and starts development server.  
```npm run build```: Generates bundle files. (Do not forget about setting NODE_ENV as it decides if the bundle is for production or not)  
```npm run start```: Starts server. (Do not forget about setting NODE_ENV and NODE_CONFIG_ENV)  
```npm run test```: Runs unit tests.   
```npm run test:verbose```: Runs unit tests in verbose mode.   
```npm run test:coverage```: Creates coverage reports.   
```npm run analyze-bundle```: Analyzes bundle and creates report.  

## Road Map
 - [x] Bundle hashing
 - [ ] Code splitting
 - [ ] Commands for creating GraphQL modules and DataSources
 - [x] Unit test setup
