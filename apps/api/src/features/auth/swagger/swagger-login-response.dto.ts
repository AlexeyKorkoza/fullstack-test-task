import { ApiProperty } from '@nestjs/swagger';

class SwaggerUser {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;
}

export class SwaggerLoginResponseDto {
  @ApiProperty()
  user: SwaggerUser;
}
