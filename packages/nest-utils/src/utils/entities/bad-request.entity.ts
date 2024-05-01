import { ApiProperty } from '@nestjs/swagger';

export class BadRequestEntity {
  @ApiProperty({
    example: [
      'Должно быть массивом слов',
      'Должно иметь максимальное 3 элемента',
    ],
    description: 'Подробный ответ о статусе операции',
  })
  form_field!: string[];
}
