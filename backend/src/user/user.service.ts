import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name, 'web-study') private userModel: Model<User>
  ) {}

  async findOneUser(id: string) {
    try {
      const user = await this.userModel.findOne({ id });
      if (!user) {
        throw new NotFoundException({
          errorCode: 'NOT_FOUND_USER',
          message: '존재하지 않는 아이디입니다.',
        });
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException({
        errorCode: 'INTERNAL_SERVER_ERROR',
        message: '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      });
    }
  }
}
