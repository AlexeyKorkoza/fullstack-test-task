import { UserSessionGuard } from './user-session.guard';

describe('UserSessionGuard', () => {
  it('should be defined', () => {
    expect(new UserSessionGuard()).toBeDefined();
  });
});
