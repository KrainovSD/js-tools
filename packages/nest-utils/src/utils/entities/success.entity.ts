import { ApiProperty } from '@nestjs/swagger';

export class SuccessEntity {
  @ApiProperty({
    example: 'Успешно',
    description: 'Подробный ответ о статусе операции',
  })
  message!: string;
}
