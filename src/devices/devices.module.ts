import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Devices } from './entities/devices.entity';
import { DevicesService } from './devices.service';
import { KafkaService } from '../kafka.service';
import { ElasticsearchService } from '../elasticsearch.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { DevicesController } from './devices.controller';
import { BcryptService } from '../shared/hashing/bcrypt.service';
import { HashingService } from '../shared/hashing/hashing.service';

@Module({
  imports: [TypeOrmModule.forFeature([Devices])],
  controllers: [DevicesController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    DevicesService,
    KafkaService,
    ElasticsearchService,
  ],
})
export class DevicesModule { }
