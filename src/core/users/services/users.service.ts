import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.mysql-entity';
import { UserRepository } from '../repositories/user.repository';
import { UpdateUserSettingsDto } from '../dto/update-user-settings.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  
  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  update(id: number, updateUserDto: CreateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    try {
      const savedUser = await this.userRepository.save(user);
      const { password, ...userWithoutPassword } = savedUser;
      return userWithoutPassword; 
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateSettings(userId: number, updateUserSettingsDto: UpdateUserSettingsDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = this.userRepository.merge(user, updateUserSettingsDto);
    return this.userRepository.save(updatedUser);
  }

  async getSettings(userId: number): Promise<Partial<User>> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { firstName, lastName, birthDate, darkMode, pinCode } = user;
    return { firstName, lastName, birthDate, darkMode, pinCode };
  }
  
}
