import { Type as NestType } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export function GetMessageDto<T>(ItemType: NestType<T>) {
  class ClientMessageDto {
    @IsUUID('4', { message: 'Должно быть в формате UUID' })
    traceId!: string;

    @IsNotEmpty({ message: 'Не должно быть пустым' })
    @IsString({ message: 'Должно быть строкой' })
    sendBy!: string;

    @IsObject({ message: 'Должно быть объектом' })
    @ValidateNested({ message: 'Неверный формат слов' })
    @Type(() => ItemType)
    data!: T;
  }

  return ClientMessageDto;
}
