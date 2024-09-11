import { Controller, Get, Patch, Param, Query } from '@nestjs/common';
import { PostsService } from './posts.service';

//ofc, we should validate the params
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('pending')
  async getPendingPosts(@Query('page') page = 1, @Query('limit') limit = 15) {
    return this.postsService.getPendingPosts(page, limit);
  }

  @Patch('approve/:id')
  async approvePost(@Param('id') id: string) {
    return this.postsService.approvePost(id);
  }

  //or PATCH posts/:id with body {isApproved: true | false}
  @Patch('disapprove/:id')
  async disapprovePost(@Param('id') id: string) {
    return this.postsService.disapprovePost(id);
  }
}
