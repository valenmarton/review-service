import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Post {
  @Prop({ required: true })
  public: boolean;

  @Prop({ required: true })
  caption: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop()
  scheduledAt?: Date;

  @Prop({ type: [String], required: true })
  media: string[];

  //tags for the post
  @Prop({ type: [String] })
  categories: string[];

  @Prop({ default: null })
  isApproved?: boolean;

  //maybe an extra column for the reason of disapproval could be useful
  //maybe an extra reviewedAt column could be useful to check how much time did it take to review the post
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({ isApproved: 1, createdAt: -1 });
