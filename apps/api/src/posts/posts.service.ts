import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { JwtPayload } from '../auth/auth.types.js';
import { PrismaService } from '../database/prisma.service.js';
import type { CreateCommentDto } from './dto/create-comment.dto.js';
import type { CreatePostDto } from './dto/create-post.dto.js';
import type { ListPostsDto } from './dto/list-posts.dto.js';
import type { PostDetails, PostSummary } from './posts.types.js';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListPostsDto, user?: JwtPayload | null) {
    const search = query.search?.trim();
    let matchingIds: string[] | undefined;

    if (search) {
      const rows = await this.prisma.$queryRaw<Array<{ id: string }>>(
        Prisma.sql`
          SELECT p."id"
          FROM "posts" p
          WHERE p."searchVector" @@ websearch_to_tsquery('simple', ${search})
          ORDER BY p."createdAt" DESC
        `,
      );
      matchingIds = rows.map((row) => row.id);
    }

    const posts = await this.prisma.post.findMany({
      where: matchingIds ? { id: { in: matchingIds } } : undefined,
      orderBy: { createdAt: 'desc' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: this.postInclude(user?.sub),
    });

    return {
      items: posts.map((post) => this.toSummary(post)),
      page: query.page,
      limit: query.limit,
      hasMore: posts.length === query.limit,
    };
  }

  async findById(id: string, user?: JwtPayload | null): Promise<PostDetails> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        ...this.postInclude(user?.sub),
        comments: {
          orderBy: { createdAt: 'asc' },
          include: { user: { select: { id: true, name: true } } },
        },
      },
    });

    if (!post) throw new NotFoundException('Post not found');

    return {
      ...this.toSummary(post),
      comments: post.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        author: comment.user,
      })),
    };
  }

  async create(dto: CreatePostDto, user: JwtPayload): Promise<PostSummary> {
    const post = await this.prisma.post.create({
      data: {
        title: dto.title.trim(),
        content: dto.content.trim(),
        thumbnail: dto.thumbnail,
        authorId: user.sub,
      },
      include: this.postInclude(user.sub),
    });
    return this.toSummary(post);
  }

  async like(postId: string, user: JwtPayload) {
    await this.ensurePost(postId);
    try {
      await this.prisma.postLike.create({
        data: { postId, userId: user.sub },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Post already liked');
      }
      throw error;
    }
    return this.likeState(postId, user.sub);
  }

  async unlike(postId: string, user: JwtPayload) {
    await this.ensurePost(postId);
    await this.prisma.postLike.deleteMany({ where: { postId, userId: user.sub } });
    return this.likeState(postId, user.sub);
  }

  async comment(postId: string, dto: CreateCommentDto, user: JwtPayload) {
    await this.ensurePost(postId);
    const comment = await this.prisma.comment.create({
      data: { postId, userId: user.sub, content: dto.content.trim() },
      include: { user: { select: { id: true, name: true } } },
    });
    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      author: comment.user,
    };
  }

  private postInclude(userId?: string) {
    return {
      author: { select: { id: true, name: true } },
      _count: { select: { likes: true, comments: true } },
      likes: userId ? { where: { userId }, select: { id: true } } : false,
    } as const;
  }

  private toSummary(post: any): PostSummary {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      thumbnail: post.thumbnail,
      createdAt: post.createdAt.toISOString(),
      author: post.author,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      likedByMe: (post.likes?.length ?? 0) > 0,
    };
  }

  private async ensurePost(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id }, select: { id: true } });
    if (!post) throw new NotFoundException('Post not found');
  }

  private async likeState(postId: string, userId: string) {
    const [likesCount, liked] = await Promise.all([
      this.prisma.postLike.count({ where: { postId } }),
      this.prisma.postLike.findUnique({ where: { postId_userId: { postId, userId } } }),
    ]);
    return { likesCount, likedByMe: Boolean(liked) };
  }
}