import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts/posts.service';
import { PostsController } from './posts/posts.controller';
import { Post, PostSchema } from './schemas/post.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RequestLoggingMiddleware } from './middlewares/request-logging.middleware';

@Module({
  imports: [
    // it's not necessary to use it globally, because there are no other env variables in the feature modules
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGO_ATLAS_URI'),
      }),
    }),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
