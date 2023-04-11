import {
  Controller,
  Put,
  Get,
  Body,
  Post,
  Param,
  HttpStatus,
  NotFoundException,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DeviceDto } from './dto/device.dto';
import { DeviceUpdateDto } from './dto/device-update.dto';
import { IDevices } from './interfaces/devices.interface';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../iam/login/decorators/auth-guard.decorator';
import { AuthType } from '../iam/login/enums/auth-type.enum';
import { KafkaService } from '../../src/kafka.service';
@ApiTags('devices')
@AuthGuard(AuthType.Bearer)
@Controller('devices')
export class DevicesController {
  constructor(
    private readonly devicesService: DevicesService,
    private readonly kafkaService: KafkaService
  ) { }

  @Get()
  public async findAllDevice(): Promise<IDevices[]> {
    return this.devicesService.findAll();
  }

  @Get('/:deviceId')
  public async findOneDevice(@Param('deviceId') deviceId: string): Promise<IDevices> {
    return this.devicesService.findById(deviceId);
  }

  @Post()
  public async createDevice(
    @Body() deviceDto: DeviceDto,
  ) {
    try {
      await this.devicesService.create(deviceDto);
      const kafkaPayload = {
        eventType: 'DEVICE_CREATED',
        payload: deviceDto,
      };
      try {
        await this.kafkaService.sendMessage('test-topic', kafkaPayload);
      } catch (err) {
        throw new BadRequestException(err, 'Error: Kafka not working!');
      }

      return {
        message: 'Device Created successfully!',
        status: HttpStatus.OK,
      };

    } catch (err) {
      throw new BadRequestException(err, 'Error: Device not created!');
    }
  }


  @Put('/:deviceId')
  public async updateDevice(
    @Param('deviceId') deviceId: string,
    @Body() deviceUpdateDto: DeviceUpdateDto,
  ) {
    try {
      await this.devicesService.updateDevice(deviceId, deviceUpdateDto);

      return {
        message: 'Device Updated successfully!',
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: Device not updated!');
    }
  }

  @Delete('/:deviceId')
  public async deleteDevice(@Param('deviceId') deviceId: string): Promise<void> {
    await this.devicesService.deleteDevice(deviceId);
  }
}
