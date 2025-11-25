import { ApiProperty } from '@nestjs/swagger';

export class SwaggerBasicResponseDto {
  @ApiProperty()
  message: string;
}
