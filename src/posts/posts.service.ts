import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../schemas/post.schema';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async getPendingPosts(page: number, limit: number): Promise<Post[]> {
    let pendingPosts: Post[];
    try {
      pendingPosts = await this.postModel
        .find({ isApproved: null })
        .sort({ createdAt: 1 })
        .skip((page - 1) * limit)
        .limit(limit);
    } catch (error) {
      this.logger.error(`Error while fetching pending posts: ${error}`);
      throw new InternalServerErrorException(
        `Error while fetching pending posts`,
      );
    }

    if (pendingPosts.length === 0) {
      this.logger.log(`No pending posts found on page ${page}`);
      throw new NotFoundException(`No pending posts found`);
    }

    this.logger.log(
      `Found ${pendingPosts.length} pending posts on page ${page} with limit ${limit}`,
    );
    return pendingPosts;
  }

  async approvePost(id: string): Promise<Post> {
    let approvedPost: Post;
    try {
      approvedPost = await this.postModel.findByIdAndUpdate(
        id,
        {
          isApproved: true,
        },
        { new: true },
      );
    } catch (error) {
      this.logger.error(`Error while approving post: ${error}`);
      throw new BadRequestException(`Invalid post id ${id}`);
    }

    this.logger.log(`Approved post with id ${id}`);
    return approvedPost;
  }

  async disapprovePost(id: string): Promise<Post> {
    let disapprovedPost: Post;
    try {
      disapprovedPost = await this.postModel.findByIdAndUpdate(
        id,
        {
          isApproved: false,
        },
        { new: true },
      );
    } catch (error) {
      this.logger.error(`Error while disapproving post: ${error}`);
      throw new BadRequestException(`Invalid post id ${id}`);
    }

    this.logger.log(`Disapproved post with id ${id}`);
    return disapprovedPost;
  }
}
