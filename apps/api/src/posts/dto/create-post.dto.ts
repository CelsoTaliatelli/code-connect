import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Length(3, 140)
  title!: string;

  @IsString()
  @Length(10, 10000)
  content!: string;

  @IsOptional()
  @IsUrl()
  thumbnail?: string;
}