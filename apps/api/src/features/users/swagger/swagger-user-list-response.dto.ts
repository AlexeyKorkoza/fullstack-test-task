import { ApiProperty } from '@nestjs/swagger';

class SwaggerUserListItemDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;
}

export class SwaggerUserListResponseDto {
  @ApiProperty()
  users: SwaggerUserListItemDto[];
}
