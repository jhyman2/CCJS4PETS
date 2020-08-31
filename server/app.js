const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const express = require('express');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
// const { ApolloServer } = require('apollo-server');
// @ts-ignore
const RedisServer = require('redis-server');
const redisClient = require('redis');
const { execute, printSchema, subscribe } = require('graphql');
const { createServer } = require('http');
const fs = require('fs');
const yaml = require('js-yaml');
const { promisify } = require('util');
const openapi_to_graphql = require('openapi-to-graphql');
// import { graphqlExpress } from 'apollo-server-express';

// const { SubscriptionServer } = require('subscriptions-transport-ws');
// const mqttPubSub = require('./pubsub');
// import { createGraphQLSchema } from 'openapi-to-graphql';
// import { ApolloServer } from 'apollo-server';

// import { swaggerDocument } from './swagger/swagger';

const APP_NAME = 'Charm City JS 4 Pets';
const EXPRESS_PORT = 8080;
const REDIS_PORT = 6379;
const MQTT_PORT = 1885;
const APOLLO_PORT = 5000;

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
  apis: ['swaggerDefinitions.js', 'app.js'],
};


const PET_DATA = [
  {
    id: 1,
    bio: 'Bryn enjoys cool music, a cool breeze, and cool drinks. He dislikes hot drinks, hot breath, and hot weather.',
    breed: 'German Shepard / Rough Collie',
    img: 'http://files.slack.com/files-tmb/T044YC3BH-F01ABC4CDMW-c811a031b6/img_8582_720.jpg',
    name: 'Bryn',
    petType: 'dog',
    weight: 55,
  },
  {
    id: 2,
    bio: 'Loves people - hates other cats. When not following her family around, enjoys sitting in bags, boxes, frying pans - whatever.',
    breed: 'Dilute Tabby',
    img: 'http://slack-imgs.com/?c=1&o1=ro&url=https%3A%2F%2Flh3.googleusercontent.com%2FOruQO3z2SuBgs87hhj_gHnCTRn3e53u1t4puCqmIcTrtuvDz8cP3R51RnapQFHetLCAirTEd-IrAwph_eYU9r9wVRdTK2IfPn8DxQKWdGb_2T63zOdi0POK14I0AD4hqZPIIMdAbtA',
    name: 'Lyra',
    petType: 'cat',
    weight: 13,
  },
  {
    id: 3,
    bio: 'Sophie likes sleeping, screaming at the top of her lungs, and sleeping more. She dislikes her new cat-sister, and long car rides.',
    breed: 'Domestic Short Hair',
    img: 'http://files.slack.com/files-pri/T044YC3BH-F019GMRUGMU/attach56010_20190908_192057.jpg',
    name: 'Sophie',
    petType: 'cat',
    weight: 8,
  },
  {
    id: 4,
    bio: 'Rosie is super chill, loves her walks, & dislikes squirrels. She tries to catch em but they’re to fast for her but nonetheless she remains persistent.',
    breed: 'Black Lab',
    img: 'http://files.slack.com/files-pri/T044YC3BH-F0199DCJ8KZ/be19006b-27ca-406c-b661-4664775d1fee.jpg',
    name: 'Rosie',
    petType: 'dog',
    weight: 85,
  },
  {
    id: 5,
    bio: ' Ada loves her dog friends, cheese, green beans, walks to the park, and playing with balls. She doesn’t like shrimp, strangers, being home alone, or ear drops.',
    breed: 'Pit lab mix',
    img: 'http://files.slack.com/files-pri/T044YC3BH-F019RKTL57D/image_from_ios.jpg',
    name: 'Ada',
    petType: 'dog',
    weight: 62,
  },
];

class CCJS4PETS {

  async start() {
    const app = express();
    app.use(bodyParser.json());
    const redisServer = new RedisServer(REDIS_PORT);
    const err = await redisServer.open();

    if (err) {
      return console.error('error starting redis server');
    }

    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    // read swagger file
    const yamlFile = yaml.safeLoad(fs.readFileSync('./swagger/swagger.yaml', 'utf8'));

    console.log('***** YAML FILE *******');
    console.log(yamlFile);
    // @ts-ignore
    const { schema } = await openapi_to_graphql.createGraphQLSchema(swaggerDocs, {
      // createSubscriptionsFromCallbacks: true,
    });
    const myGraphQLSchema = printSchema(schema);
    console.log(myGraphQLSchema);

    const apolloServer = new ApolloServer({ schema });

    apolloServer.applyMiddleware({ app });

    app.listen(EXPRESS_PORT);
    console.log(`\n${APP_NAME} listening on port ${EXPRESS_PORT}`);
    console.log(`GraphQL accessible listening on path ${EXPRESS_PORT}/graphql`);
    // MESH-WRAPPER GRAPHQL
    // apolloServer.listen({ path: 'localhost:1000' }).then(({ url }) => console.log(`🚀  Server ready at ${url}`));


    // const apolloServer = new ApolloServer(schema);
    // apolloServer.applyMiddleware({ app });

    // const wsServer = createServer(app);

    // ...and set up the WebSocket for handling GraphQL subscriptions
    // wsServer.listen(EXPRESS_PORT, () => {
    //   new SubscriptionServer(
    //     {
    //       execute,
    //       subscribe,
    //       schema: schema.schema,
    //       // @ts-ignore
    //       onConnect: (params, socket, ctx) => {
    //         // Add pubsub to context to be used by GraphQL subscribe field
    //         console.log('CONNECTED');
    //         return { pubsub: mqttPubSub }
    //       }
    //     },
    //     {
    //       server: wsServer,
    //       path: '/graphql'
    //     }
    //   );
    // });

    // const client = redisClient.createClient(REDIS_PORT, '127.0.0.1');
    // const lrange = promisify(client.lrange).bind(client);
    // const hset = promisify(client.hset).bind(client);
    // const hgetall = promisify(client.hgetall).bind(client);

    // // // insert all pet types
    // PET_DATA.forEach(pet => client.rpush('pets', pet));
    // console.log(`redis-server listening on ${REDIS_PORT}`);
    
    // app.get('/', (req, res) => {
    //   res.send('The sedulous hyena ate the antelope!');
    // });

    // app.post('/addNewPet', async (req, res) => {
    //   const {
    //     petFirstName,
    //     petEmail,
    //     petLastName,
    //     petOwnerName,
    //     petUsername,
    //   } = req.body;
    //   // @ts-ignore
    //   const results = await hset('pets', petUsername, req.body);
    //   console.log('results', results);
    //   res.send(200);
    // });

    // app.get('/pets', async (req, res) => {
    //   const pets = await hgetall('pets');
    //   console.log('pets', pets);
    //   res.send(JSON.stringify(pets));
    // });

    /**
     * @swagger
     * /pets:
     *   get:
     *     description: Return all available pets
     *     responses:
     *       '200':
     *          description: Use to request all pets
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                description: The pet collection
     *                items:
     *                  $ref: '#/components/schemas/Pet'   
     */
    app.get('/pets', async (req, res) => {
      console.log('hit pet endpoint');
      try {
        // const petTypes = await lrange('pets', 0, -1);
        // console.log('petTypes', petTypes);
        // res.send(petTypes.map(pet => ({
        //   name: pet,
        // })));
        res.send(PET_DATA);
      } catch (e) {
        res.send('error');
      }
    });

    app.get('/pet/:petName', async(req, res) => {
      const pet = PET_DATA.find(pet => pet.name === req.params.petName);
      res.send(pet);
    });
  }
}

new CCJS4PETS().start();
