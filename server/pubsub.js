const { connect } = require('mqtt');
const { MQTTPubSub } = require('graphql-mqtt-subscriptions');

const MQTT_PORT = 1885;

// Create a PubSub instance (here by wrapping a MQTT client)
const client = connect(`mqtt://localhost:${MQTT_PORT}`)

const mqttPubSub = new MQTTPubSub({ client });

module.export = mqttPubSub;
