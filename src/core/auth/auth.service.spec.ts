import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(), // Mocking the findByEmail method
      create: jest.fn(), // Mocking the create method
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('signed-token'), // Mocking the sign method
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService }, // Injecting the mocked service
        { provide: JwtService, useValue: jwtService }, // Injecting the mocked JwtService
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should throw a ConflictException if email already exists', async () => {
    // Mock findByEmail to return a user, simulating an existing email
    (usersService.findByEmail as jest.Mock).mockResolvedValue({ email: 'test@test.com' });

    await expect(
      authService.register({ email: 'test@test.com', password: 'password123' }),
    ).rejects.toThrow(ConflictException);
  });

  it('should create a new user and return a signed token', async () => {
    // Mock findByEmail to return null, simulating no existing user
    (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
    
    // Mock create to simulate user creation
    (usersService.create as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'newuser@test.com',
    });

    const result = await authService.register({
      email: 'newuser@test.com',
      password: 'password123',
    });

    expect(result).toEqual({ access_token: 'signed-token' });
    expect(usersService.create).toHaveBeenCalledWith(expect.objectContaining({ email: 'newuser@test.com' }));
    expect(jwtService.sign).toHaveBeenCalledWith(expect.objectContaining({ email: 'newuser@test.com', sub: 1 }));
  });
});
