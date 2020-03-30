import path from "path";
import express from "express";
import config from "config";
import bodyParser from "body-parser";
import favicon from "serve-favicon";
import session from "express-session";
import schema from "./graphql/schema";
import * as dataSources from "./graphql/dataSources";
import siteRenderer from "./middlewares/siteRenderer";
import { ApolloServer } from "apollo-server-express";

const SERVER_PORT = config.get("server.port"),
      SESSION_SECRET = config.get("session.secret"),
      IS_TRACING_ENABLED = config.get("graphql.isTracingEnabled"),
      IS_PLAYGROUND_ENABLED = config.get("graphql.isPlaygroundEnabled"),
      STATICS_PATH = config.get("server.statics.path");

const apolloServer = new ApolloServer({
  schema,
  dataSources: () => {
    const result = {},
          keys = Object.keys(dataSources);

    for (const key of keys) {
      const name = key.charAt(0).toLowerCase() + key.slice(1),
            DataSource = dataSources[key];

      result[name] = new DataSource();
    }

    return result;
  },
  playground: IS_PLAYGROUND_ENABLED,
  tracing: IS_TRACING_ENABLED
});

const server = express();
const CWD = process.cwd();

server.use(session({
  secret: SESSION_SECRET,
  saveUninitialized: false,
  resave: false
}));

apolloServer.applyMiddleware({
  app: server,
  path: "/api/graphql"
});

server.use(STATICS_PATH, express.static(path.join(CWD, "/dist/public"), {
  index: false,
  fallthrough: false
}));


const faviconPath = path.join(CWD, "/dist/public/favicon/favicon.ico");

server.use(favicon(faviconPath));

server.use(bodyParser.urlencoded({ extended: false }));

server.use(bodyParser.json());

server.use("/", siteRenderer);

server.listen(SERVER_PORT, () => {
  console.log(`server on port: ${SERVER_PORT}`);
  console.log(`graphql path: ${apolloServer.graphqlPath}`);
});
