import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'users' })
export class User extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  role: number;

  @Prop({ required: false })
  use: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
