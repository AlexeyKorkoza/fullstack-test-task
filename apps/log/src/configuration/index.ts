export default () => ({
  port: parseInt(process.env.PORT || '3002', 10),
  host: process.env.PORT || 'http://localhost',
  mongodbUri: process.env.MONGODB_URI,
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  },
});
