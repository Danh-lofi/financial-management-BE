import { AuthenticationGuard } from '@/auth/guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { UpsertCategoryDto } from './dto/create-category.dto';
import { Category } from './schemas/category.schema';

@ApiTags('categories')
@Controller('categories')
@ApiBearerAuth()
@UseGuards(AuthenticationGuard)
export class CategoryController {
  constructor(private readonly _categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'The category has been created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(
    @Body() upsertCategoryDto: UpsertCategoryDto,
  ): Promise<Category> {
    return this._categoryService.upsert(upsertCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Return all categories.' })
  async findAll(): Promise<Category[]> {
    return this._categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiResponse({ status: 200, description: 'Return the category.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async findOne(@Param('id') id: string): Promise<Category | null> {
    return this._categoryService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiResponse({ status: 200, description: 'The category has been deleted.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async remove(@Param('id') id: string): Promise<Category | null> {
    return this._categoryService.remove(id);
  }
}
