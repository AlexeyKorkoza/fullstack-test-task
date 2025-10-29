export interface UserSession {
  userId: number;
  email: string;
  createdAt: Date;
  lastActivity: Date;
  userAgent?: string;
  ipAddress?: string;
}
