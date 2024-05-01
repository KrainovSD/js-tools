import { IsNotEmpty, IsObject, IsString, IsUUID } from 'class-validator';

export class ClientMessageDto<T> {
  @IsUUID('4', { message: 'Должно быть в формате UUID' })
  traceId!: string;

  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @IsString({ message: 'Должно быть строкой' })
  sendBy!: string;

  @IsObject()
  data!: T;
}
