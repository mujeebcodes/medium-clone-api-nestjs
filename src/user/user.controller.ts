import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/CreateUserDto';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDto } from './dto/LoginUserDto';
import { UserEntity } from './user.entity';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { BackendValidationPipe } from 'src/shared/pipes/backendValidation.pipe';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('users')
  @UsePipes(new BackendValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildResponse(user);
  }

  @Post('users/login')
  @UsePipes(new BackendValidationPipe())
  async loginUser(@Body('user') loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.buildResponse(user);
  }
  // without using the custom User decorator, the below will work the same
  // @Get('user')
  // async currentUser(
  //   @Req() request: ExpressRequest,
  // ): Promise<UserResponseInterface> {
  //   return this.userService.buildResponse(request.user);
  // }

  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
    return this.userService.buildResponse(user);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  async updateCurrentUser(
    @User('id') currentUserId: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.updateUser(
      currentUserId,
      updateUserDto,
    );
    return this.userService.buildResponse(user);
  }
}
