export interface RefreshTokenEntity {
  id: number;
  token_hash: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  is_revoked: boolean;
  userId: number;
}
