import { PartialType } from '@nestjs/swagger';
import { DeviceDto } from './device.dto';

export class DeviceUpdateDto extends PartialType(DeviceDto) {}
