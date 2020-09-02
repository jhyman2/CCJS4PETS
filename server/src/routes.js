const redisClient = require('redis');
const { promisify } = require('util');
const faker = require('faker');

const pubsub = require('./pubsub');
const PET_DATA = require('./data');
const REDIS_PORT = 6379;

const api = (app) => {
  const client = redisClient.createClient(REDIS_PORT, '127.0.0.1');
  const hmset = promisify(client.hmset).bind(client);
  const hgetall = promisify(client.hgetall).bind(client);

  const getPetsInRedis = async () => {
    const petsInRedis = await hgetall('pets');
    const pets = Object.keys(petsInRedis).map(id => JSON.parse(petsInRedis[id]));

    return pets;
  };

  // insert initial CCJS data
  PET_DATA.forEach(pet => {
    hmset('pets', {
      [pet.id]: JSON.stringify(pet)
    });
  });

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
    console.log('pet endpoint');
    try {
      const pets = await getPetsInRedis();
      res.send(pets);
    } catch (e) {
      res.send('error');
    }
  });

  /**
   * @swagger
   * /pet:
   *   get:
   *     operationId: findPetByName
   *     description: Find a pet by its name
   *     parameters:
   *       - $ref: "#/components/parameters/name"
   *     responses:
   *       '200':
   *          description: Use to request a pet by its name
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/Pet'   
   */
  app.get('/pet', async(req, res) => {
    console.log('/pet endpoint');
    try {
      const pets = await getPetsInRedis();
      const myPet = pets.find(pet => pet.name.toLowerCase() === req.query.name.toLowerCase());
      console.log('myPet', myPet);
      res.send(myPet);
    } catch (e) {
      res.send('error');
    }
  });

  /**
   * @swagger
   * /add_new_pet:
   *   post:
   *     operationId: addNewPet
   *     description: Add a new pet with supplied data
   *     requestBody:
   *       $ref: '#/components/requestBodies/PetBody'
   *     responses:
   *       '200':
   *          description: Add a new pet with supplied data
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/Pet'
   *     callbacks:
   *       petAdded:
   *         $ref: '#/components/callbacks/NewPet'
   */
  app.post('/add_new_pet', async (req, res) => {
    console.log('/add_new_pet body', req.body);
    try {
      const newPet = {
        id: faker.random.number(),
        bio: req.body.bio,
        breed: req.body.breed,
        img: req.body.img,
        name: req.body.name,
        petType: req.body.petType,
        weight: req.body.weight,
      };
      await hmset('pets', {
        [newPet.id]: JSON.stringify(newPet),
      });

      const allPets = await getPetsInRedis();

      const packet = {
        topic: '/pets',
        payload: Buffer.from(JSON.stringify(allPets)),
      };

      // Use pubsub to publish the event
      pubsub.publish(packet);

      console.log('sending new pet', newPet);
      res.send(newPet);
    } catch (e) {
      console.log('error', e);
      res.send('error');
    }
  });

  /**
   * @swagger
   * /add_random_pet:
   *   post:
   *     operationId: addRandomPet
   *     description: Add a new pet with random data
   *     responses:
   *       '200':
   *          description: Generate a new pet with random data
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/Pet'
   *     callbacks:
   *       petAdded:
   *         $ref: '#/components/callbacks/NewPet'
   */
  app.post('/add_random_pet', async (req, res) => {
    console.log('/add_random_pet endpoint');
    try {
      const randomPet = {
        id: faker.random.number(),
        bio: faker.lorem.sentence(),
        breed: `${faker.random.word()} ${faker.random.word()}`,
        img: faker.image.imageUrl(),
        name: faker.name.firstName(),
        petType: faker.random.word(),
        weight: faker.random.number(150),
      };
      await hmset('pets', {
        [randomPet.id]: JSON.stringify(randomPet),
      });

      const allPets = await getPetsInRedis();

      const packet = {
        topic: '/pets',
        payload: Buffer.from(JSON.stringify(allPets)),
      };

      // Use pubsub to publish the event
      pubsub.publish(packet);

      res.send(randomPet);
    } catch (e) {
      console.log('error', e);
      res.send('error');
    }
  });
};

module.exports = api;
