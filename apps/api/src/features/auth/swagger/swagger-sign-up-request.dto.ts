import { ApiProperty } from '@nestjs/swagger';

export class SwaggerSignUpRequestDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
