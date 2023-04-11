import { MaxLength, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class DeviceDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;
}
