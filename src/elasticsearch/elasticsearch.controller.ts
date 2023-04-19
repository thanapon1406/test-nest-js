import { Controller, Get, Query } from '@nestjs/common';
import { ESService } from '../elasticsearch.service';

@Controller('elasticsearch')
export class MyController {
  constructor(private readonly ESService: ESService) {}

  @Get()
  async search(@Query('index') index: string, @Query('term') term: string) {
    const results = await this.ESService.search(index, term);
    return { results };
  }
}