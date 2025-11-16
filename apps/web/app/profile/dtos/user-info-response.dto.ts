export interface UserInfoResponseDto {
  user: {
    userId: number;
    email: string;
    createdAt: Date;
    lastActivity: Date;
    userAgent?: string;
    ipAddress?: string;
  };
}
