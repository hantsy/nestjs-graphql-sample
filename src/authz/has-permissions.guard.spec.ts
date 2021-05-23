import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';
import { mock, mockClear } from 'jest-mock-extended';
import { HAS_PERMISSIONS_KEY } from './authz.constants';
import { HasPermissionsGuard } from './has-permissions.guard';
import { PermissionType } from './permission-type.enum';

// more mocking examples of `createMock`('@golevelup/ts-jest') and `ts-mockito`.
// see: https://github.com/hantsy/nestjs-sample/blob/master/src/auth/guard/roles.guard.spec.ts
describe('HasPermissionsGuard(mocking interface with jest-mock-extended)', () => {
  let guard: HasPermissionsGuard;
  const reflecter = mock<Reflector>();

  beforeEach(() => {
    guard = new HasPermissionsGuard(reflecter);
  });

  afterEach(() => {
    mockClear(reflecter);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should skip(return true) if the `HasPermissions` decorator is not set', async () => {
    const context = mock<ExecutionContext>();
    context.getHandler.mockReturnValue({} as any);
    reflecter.get
      .mockReturnValue([])
      .calledWith(HAS_PERMISSIONS_KEY, context.getHandler());

    const result = await guard.canActivate(context);

    expect(result).toBeTruthy();
    expect(reflecter.get).toBeCalledTimes(1);
  });

  it('should return true if the `HasPermissions` decorator is set', async () => {
    const context = mock<ExecutionContext>();
    context.getHandler.mockReturnValue({} as any);

    const mockedCreate = jest
      .fn()
      .mockImplementation((ctx: ExecutionContext) => {
        return {
          getContext: jest.fn().mockReturnValue({
            req: {
              user: { permissions: [PermissionType.WRITE_POSTS] } as any,
            } as any,
          }),
        } as any;
      });
    GqlExecutionContext.create = mockedCreate;

    reflecter.get
      .mockReturnValue([PermissionType.WRITE_POSTS])
      .calledWith(HAS_PERMISSIONS_KEY, context.getHandler());

    const result = await guard.canActivate(context);

    expect(result).toBeTruthy();
    expect(reflecter.get).toBeCalledTimes(1);
  });

  it('should return false if the `HasPermissions` decorator is set but permission is not allowed', async () => {
    const context = mock<ExecutionContext>();
    context.getHandler.mockReturnValue({} as any);

    const mockedCreate = jest
      .fn()
      .mockImplementation((ctx: ExecutionContext) => {
        return {
          getContext: jest.fn().mockReturnValue({
            req: {
              user: { permissions: [PermissionType.WRITE_POSTS] } as any,
            } as any,
          }),
        } as any;
      });
    GqlExecutionContext.create = mockedCreate;

    //but requires DELETE_POSTS permission
    reflecter.get
      .mockReturnValue([PermissionType.DELETE_POSTS])
      .calledWith(HAS_PERMISSIONS_KEY, context.getHandler());

    const result = await guard.canActivate(context);

    expect(result).toBeFalsy();
    expect(reflecter.get).toBeCalledTimes(1);
  });
});
