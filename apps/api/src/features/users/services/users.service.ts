import { Injectable } from '@nestjs/common';

import { UsersRepository } from '@/features/users/repositories/users.repository';
import { UserSessionService } from '@/core/services/user-session.service';
import type { UserSession } from '@/features/auth/interfaces';
import type { UserListItem } from '@/features/users/interfaces';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userSessionService: UserSessionService,
  ) {}

  findAllUsers(): Promise<UserListItem[]> {
    return this.usersRepository.findAllUsers();
  }

  findInfoAboutMe(sessionId: string): Promise<UserSession> {
    return this.userSessionService.getSession(sessionId);
  }
}
