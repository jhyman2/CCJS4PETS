const { EventEmitter2 } = require('eventEmitter2');
const { PubSub } = require('graphql-subscriptions');

const eventEmitter = new EventEmitter2({
  wildcard: true,
  delimiter: '/'
});

// Create the PubSub instance (here by wrapping an EventEmitter client)
const pubsub = new PubSub()

module.exports = pubsub;
