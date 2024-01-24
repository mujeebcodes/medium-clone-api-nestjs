import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { ProfileType } from './types/profile.type';
import { ProfileResponseInterface } from './types/profileResponse.interface';
import { FollowEntity } from './follow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async getProfile(
    currentUserId: number,
    username: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }
    const follow = await this.followRepository.findOne({
      where: { followerId: currentUserId, followingId: user.id },
    });

    return { ...user, following: Boolean(follow) };
  }

  async followProfile(
    currentUserId: number,
    usernameToFollow: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: { username: usernameToFollow },
    });

    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }

    if (currentUserId === user.id) {
      throw new HttpException(
        "Follower and following can't be the same",
        HttpStatus.BAD_REQUEST,
      );
    }

    const follow = await this.followRepository.findOne({
      where: { followerId: currentUserId, followingId: user.id },
    });

    if (!follow) {
      const followRelationship = new FollowEntity();
      followRelationship.followerId = currentUserId;
      followRelationship.followingId = user.id;
      await this.followRepository.save(followRelationship);
    }
    return { ...user, following: true };
  }

  async unfollowProfile(
    currentUserId: number,
    usernameToUnfollow: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: { username: usernameToUnfollow },
    });

    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }

    if (currentUserId === user.id) {
      throw new HttpException(
        "Follower and following can't be the same",
        HttpStatus.BAD_REQUEST,
      );
    }

    const follow = await this.followRepository.findOne({
      where: { followerId: currentUserId, followingId: user.id },
    });

    if (follow) {
      await this.followRepository.delete(follow);
    }

    return { ...user, following: false };
  }

  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    delete profile.email;
    return { profile };
  }
}
