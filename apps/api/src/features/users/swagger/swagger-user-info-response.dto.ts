import { ApiProperty } from '@nestjs/swagger';

class SwaggerUserSession {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  lastActivity: Date;

  @ApiProperty()
  userAgent?: string;

  @ApiProperty()
  ipAddress?: string;
}

export class SwaggerUserInfoResponseDto {
  @ApiProperty()
  user: SwaggerUserSession;
}
