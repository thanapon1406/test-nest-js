import { Controller, Get, Query } from '@nestjs/common';
import { ElasticsearchService } from '../elasticsearch.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('elasticsearch')
@Controller('elasticsearch')
export class ElasticsearchController {
  constructor(private readonly ElasticsearchService: ElasticsearchService) { }

  @Get()
  async searchAll(@Query('index') index: string) {
    const results = await this.ElasticsearchService.searchAll(index);
    return { results };
  }

  @Get("/search")
  async search(@Query('index') index: string, @Query('term') term: string) {
    const body = {
      name: term,
    }
    const results = await this.ElasticsearchService.search(index, body);
    return { results };
  }
}