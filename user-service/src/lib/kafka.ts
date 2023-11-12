import { Kafka } from "kafkajs";
import * as dotenv from "dotenv";
dotenv.config();

const kafka = new Kafka({
  clientId: "user-service",
  brokers: [process.env.UPSTASH_KAFKA_URL!],
  sasl: {
    mechanism: "scram-sha-256",
    username: process.env.UPSTASH_KAFKA_USERNAME!,
    password: process.env.UPSTASH_KAFKA_PASSWORD!,
  },
  ssl: true,
});

export const producer = kafka.producer({
  allowAutoTopicCreation: true,
  transactionTimeout: 30000,
});