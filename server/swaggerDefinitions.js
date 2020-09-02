/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Pet:
 *       type: object
 *       description: A pet belonging to the animal kingdom
 *       properties:
 *         id:
 *           type: integer
 *           description: The record ID of a pet
 *         bio:
 *           type: string
 *           description: A short biography of the pet. Usually includes likes and dislikes
 *         breed:
 *           type: string
 *           description: The breed of the pet
 *         img:
 *           type: string
 *           description: A URL pointing to an image of the pet
 *         name:
 *           type: string
 *           description: The name of a pet
 *         petType:
 *           type: string
 *           description: The type of pet. Examples include cat, dog, bird, but could also be a rock
 *         weight:
 *           type: number
 *           description: The number of pounds that the pet weighs. The number displayed when they step on a scale
 *   requestBodies:
 *     PetBody:
 *       description: Device instance to update / create
 *       required: true
 *       content:
 *         application/json:
 *            schema:
 *              $ref: '#/components/schemas/Pet'
 *   parameters:
 *     name:
 *       name: name
 *       in: query
 *       description: The name of a pet.
 *       required: true
 *       schema:
 *         type: string
 *     bio:
 *       name: bio
 *       in: query
 *       description: A short biography of the pet. Usually includes likes and dislikes
 *       required: true
 *       schema:
 *         type: string
 *     breed:
 *       name: breed
 *       in: query
 *       description: The breed of the pet
 *       required: true
 *       schema:
 *         type: string
 *     img:
 *       name: img
 *       in: query
 *       description: A URL pointing to an image of the pet
 *       required: true
 *       schema:
 *         type: string
 *     petType:
 *       name: petType
 *       in: query
 *       description: The type of pet. Examples include cat, dog, bird, but could also be a rock
 *       required: true
 *       schema:
 *         type: string
 *     weight:
 *       name: weight
 *       in: query
 *       description: The number of pounds that the pet weighs. The number displayed when they step on a scale
 *       required: true
 *       schema:
 *         type: number
 *   callbacks:
 *     NewPet:
 *       '/pets':
 *         post:
 *           operationId: addNewPetListener
 *           description: Listen all devices events owned by userName
 *           responses:
 *             '200':
 *                description: Use to request all pets
 *                content:
 *                  application/json:
 *                    schema:
 *                      type: array
 *                      description: The pet collection
 *                      items:
 *                        $ref: '#/components/schemas/Pet'
 */