import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['localhost:9092'],
});

export const consumer = kafka.consumer({
  groupId: 'order-service',
});
