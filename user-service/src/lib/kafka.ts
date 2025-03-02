import { Kafka } from "kafkajs";
import * as dotenv from "dotenv";
dotenv.config();

const kafka = new Kafka({
  clientId: "user-service",
  brokers: ['candyhouse-kafka:9092'],
});

export const producer = kafka.producer({
  allowAutoTopicCreation: true,
  transactionTimeout: 30000,
});