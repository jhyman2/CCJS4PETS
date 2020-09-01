const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const express = require('express');
const bodyParser = require('body-parser');
const { execute, printSchema, subscribe } = require('graphql');
const { ApolloServer } = require('apollo-server-express');
const RedisServer = require('redis-server');
const redisClient = require('redis');
const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const openapi_to_graphql = require('openapi-to-graphql');

const pubsub = require('./src/pubsub');
const api = require('./src/routes');

// App constants
const APP_NAME = 'Charm City JS 4 Pets';
const EXPRESS_PORT = 8080;
const REDIS_PORT = 6379;
const MQTT_PORT = 1885;
const APOLLO_PORT = 5000;
const SUBSCRIPTION_PORT = 8081;

// Configuration to generate swagger docs, and thus a graphql schema
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: `${APP_NAME} API`,
      description: 'The API for the CCJS pet owners',
      contact: {
        name: 'Jamison Hyman',
      },
      version: '1.0.0',
    },
    openapi: '3.0.0',
    servers: [
      {
        url: `http://localhost:${EXPRESS_PORT}`,
      },
    ],
  },
  apis: [
    'swaggerDefinitions.js',
    'app.js',
    'src/*.js',
  ],
};

class CCJS4PETS {
  async start() {
    // scan codebase for swagger definitions
    const swaggerDocs = swaggerJsDoc(swaggerOptions);

    const app = express();
    app.use(bodyParser.json());

    // serve the swagger documentation at http://localhost:8080/api-docs
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    // generate schema from IBM's package
    const { schema } = await openapi_to_graphql.createGraphQLSchema(swaggerDocs, {
      createSubscriptionsFromCallbacks: true,
    });

    // feed the generated schema into Apollo GraphQL
    const apolloServer = new ApolloServer({ schema });

    // connect graphql and express
    apolloServer.applyMiddleware({ app });

    // Wrap the Express server in subscriptions
    const wsServer = createServer(app)

    // set up the WebSocket for handling GraphQL subscriptions
    wsServer.listen(8080, () => {
      new SubscriptionServer(
        {
          execute,
          subscribe,
          schema,
          onConnect: (params, socket, ctx) => {
            // Add pubsub to context to be used by GraphQL subscribe field
            return { pubsub }
          }
        },
        {
          server: wsServer,
          path: '/graphql'
        }
      )
    })

    // REDIS setup
    const redisServer = new RedisServer(REDIS_PORT);
    const redisError = await redisServer.open();

    if (redisError) {
      return console.error('error starting redis server');
    }

    process.on('exit', async () => {
      try {
        await server.close();
      } catch (err) {
        console.log(err);
        console.log('Error closing redis server');
      }
    });

    // routes
    api(app);

    console.log(`\n${APP_NAME} listening on port ${EXPRESS_PORT}`);
    console.log(`GraphQL listening on path ${EXPRESS_PORT}/graphql`);
    console.log(`redis-server listening on ${REDIS_PORT}`);
  }
}

new CCJS4PETS().start();
