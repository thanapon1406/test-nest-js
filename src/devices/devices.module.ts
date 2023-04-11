import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Devices } from './entities/devices.entity';
import { DevicesService } from './devices.service';
import { KafkaService } from '../kafka.service';

import { DevicesController } from './devices.controller';
import { MailerModule } from '../shared/mailer/mailer.module';
import { BcryptService } from '../shared/hashing/bcrypt.service';
import { HashingService } from '../shared/hashing/hashing.service';

@Module({
  imports: [TypeOrmModule.forFeature([Devices]), MailerModule],
  controllers: [DevicesController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    DevicesService,
    KafkaService,
  ],
})
export class DevicesModule {}
