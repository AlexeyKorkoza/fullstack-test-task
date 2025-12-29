import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { type AppConfig } from '@/core/interfaces';

@Injectable()
export class PasswordService {
  constructor(private readonly configService: ConfigService<AppConfig>) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get<number>('password.saltRounds', { infer: true });

    return bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
