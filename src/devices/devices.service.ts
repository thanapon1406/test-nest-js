import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Devices } from './entities/devices.entity';
import { IDevices } from './interfaces/devices.interface';
import { DeviceDto } from './dto/device.dto';
import { DeviceUpdateDto } from './dto/device-update.dto';
import { HashingService } from '../shared/hashing/hashing.service';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Devices)
    private readonly deviceRepository: Repository<Devices>,
    private readonly hashingService: HashingService,
  ) {}

  public async findAll(): Promise<Devices[]> {
    return await this.deviceRepository.find();
  }

  public async findById(deviceId: string): Promise<Devices> {
    const device = await this.deviceRepository.findOneBy({
      id: +deviceId,
    });

    if (!device) {
      throw new NotFoundException(`Device #${deviceId} not found`);
    }

    return device;
  }

  public async create(deviceDto: DeviceDto): Promise<IDevices> {
    try {
      return await this.deviceRepository.save(deviceDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  

  public async updateDevice(
    id: string,
    deviceUpdateDto: DeviceUpdateDto,
  ): Promise<UpdateResult> {
    try {
      const device = await this.deviceRepository.update(
        {
          id: +id,
        },
        { ...deviceUpdateDto },
      );

      return device;
    } catch (err) {
      throw new BadRequestException('Device not updated');
    }
  }

  public async deleteDevice(id: string): Promise<void> {
    const device = await this.findById(id);
    await this.deviceRepository.remove(device);
  }
}
