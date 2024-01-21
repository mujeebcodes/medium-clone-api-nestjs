import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUserDto';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from 'src/config';
import { UserResponseInterface } from './types/userResponse.interface';
import { compare } from 'bcrypt';
import { UpdateUserDto } from './dto/UpdateUserDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUserByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    const existingUserByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUserByEmail || existingUserByUsername) {
      throw new HttpException(
        'Email or username already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  async loginUser(loginUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
      select: ['id', 'email', 'username', 'bio', 'image', 'password'],
    });

    if (!userByEmail) {
      throw new HttpException(
        'Invalid credentials',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isCorrectPassword = await compare(
      loginUserDto.password,
      userByEmail.password,
    );

    if (!isCorrectPassword) {
      throw new HttpException(
        'Invalid credentials',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    delete userByEmail.password;
    return userByEmail;
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.findById(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  generateJWT(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
    );
  }

  buildResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJWT(user),
      },
    };
  }

  async findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id } });
  }
}
