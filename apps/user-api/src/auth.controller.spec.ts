import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UserApiService } from './user-api.service';
import { CreateUserDto, UserRole } from '@app/common-library/dtos/users/create-user.dto';
import { LoginDto } from '@app/common-library/dtos/users/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let userApiService: UserApiService;

  const mockUserApiService = {
    create: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UserApiService,
          useValue: mockUserApiService,
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    userApiService = moduleRef.get<UserApiService>(UserApiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should call userApiService.create and return the result', async () => {
      const createUserDto: CreateUserDto = {
          email: 'test@example.com',
          password: 'Password123',
          role: UserRole.ADMIN
      };

      const expectedResponse = { id: 1, ...createUserDto };
      mockUserApiService.create.mockResolvedValue(expectedResponse);

      const result = await authController.register(createUserDto);
      expect(userApiService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('login', () => {
    it('should call userApiService.login and return the result', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const expectedToken = { accessToken: 'jwt-token' };
      mockUserApiService.login.mockResolvedValue(expectedToken);

      const result = await authController.login(loginDto);
      expect(userApiService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(result).toEqual(expectedToken);
    });
  });

  describe('logout', () => {
    it('should return a logout message', async () => {
      const result = await authController.logout();
      expect(result).toEqual({ message: 'Logout successfully! Please remove the token from client side' });
    });
  });
});
