import { Test, TestingModule } from '@nestjs/testing';
import { UserApiService } from './user-api.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '@app/common-library/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';

const mockUser = {
  id: 1,
  email: 'test@example.com',
  password: 'hashedpassword',
  role: 'USER',
  createdAt: new Date(),
  updatedAt: new Date(),

};

describe('UserApiService', () => {
  let service: UserApiService;
  let userRepo: Repository<User>;
  let jwtService: JwtService;

  const mockRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    merge: jest.fn(),
    delete: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserApiService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<UserApiService>(UserApiService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {

    it('should throw if user already exists', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue(mockUser);

      await expect(service.create({ email: mockUser.email, password: '1234' } as any))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      mockRepo.findOne.mockResolvedValue(mockUser);
      const result = await service.findByEmail(mockUser.email);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findByEmail('missing@example.com')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserList', () => {
    it('should return list of users', async () => {
      const users = [mockUser];
      mockRepo.find.mockResolvedValue(users);
      const result = await service.getUserList();
      expect(result).toEqual(users);
    });

    it('should throw if user list is empty or undefined', async () => {
      mockRepo.find.mockResolvedValue(null);
      await expect(service.getUserList()).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUserRole', () => {
    it('should update user role and return updated user', async () => {
      const updateDto = { role: 'ADMIN' };
      const updatedUser = { ...mockUser, ...updateDto };

      mockRepo.findOne.mockResolvedValue(mockUser);
      mockRepo.merge.mockReturnValue(updatedUser);
      mockRepo.save.mockResolvedValue(updatedUser);

      const result = await service.updateUserRole(1, updateDto);
      expect(result).toEqual(updatedUser);
    });

    it('should throw if user not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.updateUserRole(99, { role: 'ADMIN' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete user and return message', async () => {
      mockRepo.findOne.mockResolvedValue(mockUser);
      mockRepo.delete.mockResolvedValue({});

      const result = await service.deleteUser(1);
      expect(mockRepo.delete).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual('User deleted successfully');
    });

    it('should throw if user not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.deleteUser(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('validateUser', () => {
    it('should return user and password status if password matches', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validateUser(mockUser.email, 'password');
      expect(result).toEqual({ user: mockUser, isPasswordValid: true });
    });

    it('should throw if password is invalid', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.validateUser(mockUser.email, 'wrong')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if user not found', async () => {
      jest.spyOn(service, 'findByEmail').mockRejectedValue(new NotFoundException());
      await expect(service.validateUser('missing@example.com', 'pass')).rejects.toThrow(NotFoundException);
    });
  });

  describe('login', () => {
    it('should return signed jwt if valid credentials', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue({ user: mockUser, isPasswordValid: true });

      const result = await service.login(mockUser.email, 'password');
      expect(result).toEqual({ access_token: 'mocked-jwt-token' });
    });
  });
});
