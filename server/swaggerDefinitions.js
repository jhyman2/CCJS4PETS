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
 *   parameters:
 *     name:
 *       name: name
 *       in: query
 *       description: The name of a pet.
 *       required: true
 *       schema:
 *         type: string
 *   callbacks:
 *     NewPet:
 *       '/addNewPet':
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