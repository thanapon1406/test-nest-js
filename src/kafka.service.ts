import { KafkaClient, Producer } from 'kafka-node';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class KafkaService {
    private client: KafkaClient;
    private producer: Producer;

    async sendMessage(topic: string, message: any) {
        this.client = new KafkaClient({ kafkaHost: 'localhost:9092' });
        this.producer = new Producer(this.client);
        const payloads = [
            {
                topic: topic,
                messages: JSON.stringify(message),
            },
        ];
        this.producer.send(payloads, (err, data) => {
            if (err) {
                Logger.log(`Error sending message to Kafka topic ${topic}`, err);
            } else {
                Logger.log(`Successfully sent message to Kafka topic ${topic}`, data);
            }
        });
    }
}