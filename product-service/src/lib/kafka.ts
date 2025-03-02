import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'product-service',
  brokers: ['candyhouse-kafka:9092'],
});

export const consumer = kafka.consumer({
  groupId: 'product-service',
});

export const producer = kafka.producer({
  allowAutoTopicCreation: true,
  transactionTimeout: 30000,
});
