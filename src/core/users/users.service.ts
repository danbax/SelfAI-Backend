import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.mysql-entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './repositories/user.repository';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

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
}
