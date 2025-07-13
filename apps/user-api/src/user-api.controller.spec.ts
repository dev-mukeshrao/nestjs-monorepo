import { Test, TestingModule } from '@nestjs/testing';
import { UserApiController } from './user-api.controller';
import { UserApiService } from './user-api.service';
import { UpdateUserDto } from '@app/common-library/dtos/users/update-user.dto';
import { Role } from '@app/common-library/enums/roles.enum';

describe('UserApiController', () => {
  let controller: UserApiController;
  let userApiService: UserApiService;

  const mockUserApiService = {
    getUserList: jest.fn(),
    updateUserRole: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserApiController],
      providers: [
        {
          provide: UserApiService,
          useValue: mockUserApiService,
        },
      ],
    }).compile();

    controller = module.get<UserApiController>(UserApiController);
    userApiService = module.get<UserApiService>(UserApiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return the user from request', () => {
      const mockRequest = { user: { id: 1, email: 'test@example.com', role: Role.VIEWER } };
      const result = controller.getProfile(mockRequest);
      expect(result).toEqual(mockRequest.user);
    });
  });

  describe('getUsersList', () => {
    it('should return list of users from userApiService', async () => {
      const users = [{ id: 1, email: 'admin@example.com' }];
      mockUserApiService.getUserList.mockResolvedValue(users);

      const result = await controller.getUsersList();
      expect(mockUserApiService.getUserList).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('updateUserRole', () => {
    it('should update user role and return result', async () => {
      const userId = 1;
      const updateDto: UpdateUserDto = { role: Role.EDITOR };
      const updatedUser = { id: userId, email: 'user@example.com', role: Role.EDITOR };

      mockUserApiService.updateUserRole.mockResolvedValue(updatedUser);

      const result = await controller.updateUserRole(userId, updateDto);
      expect(mockUserApiService.updateUserRole).toHaveBeenCalledWith(userId, updateDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete user and return result', async () => {
      const userId = 1;
      const deletedResult = { message: 'User deleted successfully' };

      mockUserApiService.deleteUser.mockResolvedValue(deletedResult);

      const result = await controller.deleteUser(userId);
      expect(mockUserApiService.deleteUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(deletedResult);
    });
  });
});
