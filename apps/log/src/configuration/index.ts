export default () => ({
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/log',
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  },
});
