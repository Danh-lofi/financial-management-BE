import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { Budget } from './schemas/budget.schema';

@ApiTags('budgets')
@Controller('budgets')
export class BudgetController {
  constructor(private readonly _budgetService: BudgetService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new budget' })
  @ApiResponse({ status: 201, description: 'The budget has been created.' })
  async create(@Body() createBudgetDto: CreateBudgetDto): Promise<Budget> {
    return this._budgetService.create(createBudgetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all budgets' })
  @ApiResponse({ status: 200, description: 'Return all budgets.' })
  async findAll(): Promise<Budget[]> {
    return this._budgetService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a budget by ID' })
  @ApiResponse({ status: 200, description: 'Return the budget.' })
  @ApiResponse({ status: 404, description: 'Budget not found.' })
  async findOne(@Param('id') id: string): Promise<Budget | null> {
    return this._budgetService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a budget by ID' })
  @ApiResponse({ status: 200, description: 'The budget has been updated.' })
  @ApiResponse({ status: 404, description: 'Budget not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateBudgetDto: Partial<CreateBudgetDto>,
  ): Promise<Budget | null> {
    return this._budgetService.update(id, updateBudgetDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a budget by ID' })
  @ApiResponse({ status: 200, description: 'The budget has been deleted.' })
  @ApiResponse({ status: 404, description: 'Budget not found.' })
  async remove(@Param('id') id: string): Promise<Budget | null> {
    return this._budgetService.remove(id);
  }
}
