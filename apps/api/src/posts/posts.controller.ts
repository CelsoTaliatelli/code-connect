import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import type { JwtPayload } from '../auth/auth.types.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { ListPostsDto } from './dto/list-posts.dto.js';
import { OptionalJwtGuard } from './optional-jwt.guard.js';
import { PostsService } from './posts.service.js';

type AuthenticatedRequest = Request & { user: JwtPayload };
type OptionalRequest = Request & { user?: JwtPayload | null };

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @UseGuards(OptionalJwtGuard)
  list(@Query() query: ListPostsDto, @Req() request: OptionalRequest) {
    return this.postsService.list(query, request.user);
  }

  @Get(':id')
  @UseGuards(OptionalJwtGuard)
  findById(@Param('id') id: string, @Req() request: OptionalRequest) {
    return this.postsService.findById(id, request.user);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() dto: CreatePostDto, @Req() request: AuthenticatedRequest) {
    return this.postsService.create(dto, request.user);
  }

  @Post(':id/likes')
  @UseGuards(AuthGuard('jwt'))
  like(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.postsService.like(id, request.user);
  }

  @Delete(':id/likes')
  @UseGuards(AuthGuard('jwt'))
  unlike(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.postsService.unlike(id, request.user);
  }

  @Post(':id/comments')
  @UseGuards(AuthGuard('jwt'))
  comment(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.postsService.comment(id, dto, request.user);
  }
}