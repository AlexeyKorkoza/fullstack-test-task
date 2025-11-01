import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UsersController } from '@/features/users/controllers/users.controller';
import { UsersService } from '@/features/users/services/users.service';
import { UsersRepository } from '@/features/users/repositories/users.repository';
import { CoreModule } from '@/core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [UsersController],
  providers: [ConfigService, UsersService, UsersRepository],
})
export class UsersModule {}
