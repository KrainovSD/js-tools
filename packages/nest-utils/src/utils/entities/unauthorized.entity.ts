import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedEntity {
  @ApiProperty({
    example: 401,
    description: 'Статус ошибки',
  })
  statusCode!: number;

  @ApiProperty({
    example: 'Unauthorized',
    description: 'Ошибка',
  })
  message!: string;
}
