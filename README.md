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
Content hashing enabled for bundle files. You will never have to invalidate cache and never will invalidate for the javascript you haven't changed.

#### Configuration
Easy configuration just put your config files in config folder and get them using ```config.get(my.config.value)```. Choose what config values you send to client and what sensitive information you decide not to inform client about using apollo client state.

#### Apollo GraphQL
Apollo server and client all set and ready to go.

## How To

#### Configuration
On server side configuration done through [node-config](#https://github.com/lorenwest/node-config). Put your configuration files in config folder as shown in their documentation. Use NODE_CONFIG_ENV (instead of NODE_ENV) for setting which config you want to be loaded.

If you need access config on client use ```@client``` directive on graphql queries to access server defined set of values. You can get the values from node-config or you pass any run time value. See ```src/middlewares/index.js:46``` for how to populate these values and ```src/components/Site/index.js:10``` for how to consume these values. [For further information read this resource](#https://www.apollographql.com/docs/react/data/local-state/)

#### GraphQL
There is an example for GraphQL modules and DataSources in src/graphql folder. You need to create your DataSources in dataSources folder and do a named export in dataSources/index.js file. For GraphQL types and resolvers they need to be structured as shown in ```src/graphql/todos``` and ```src/graphql/index.js```. There will be commands provided for the generation of these files later so this process will be automated.

### NPM Scripts

```npm run develop```: Watches file changes, generates bundles and starts development server.  
```npm run build```: Generates bundle files.  
```npm run start```: Starts server.  
```npm run analyze-bundle```: Analyzes bundle and creates report.

## Road Map
 - [x] Bundle hashing
 - [ ] Code splitting
 - [ ] Commands for creating GraphQL modules and DataSources
 - [ ] Unit tests
