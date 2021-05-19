import { HasPermissionsGuard } from './has-permissions.guard';

describe('HasPermissionsGuard', () => {
  it('should be defined', () => {
    expect(new HasPermissionsGuard()).toBeDefined();
  });
});
