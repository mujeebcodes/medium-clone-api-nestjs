import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { CreateArticleDto } from './dto/createArticleDto';
import { UserEntity } from 'src/user/user.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDto,
    );

    return this.articleService.buildArticleResponse(article);
  }

  @Get('/:slug')
  async getSingleArticle(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.getArticle(slug);
    return this.articleService.buildArticleResponse(article);
  }
}
