import { UPSTASH_KAFKA_PASSWORD, UPSTASH_KAFKA_URL, UPSTASH_KAFKA_USERNAME } from '@/config';
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'product-service',
  brokers: [UPSTASH_KAFKA_URL],
  sasl: {
    mechanism: 'scram-sha-256',
    username: UPSTASH_KAFKA_USERNAME,
    password: UPSTASH_KAFKA_PASSWORD,
  },
  ssl: true,
});

export const consumer = kafka.consumer({
  groupId: 'product-service',
});

export const producer = kafka.producer({
  allowAutoTopicCreation: true,
  transactionTimeout: 30000,
});
