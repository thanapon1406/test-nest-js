import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ESService {
    constructor(private readonly elasticsearchService: ElasticsearchService) { }

    async search(index: string, term: string) {
        const body = await this.elasticsearchService.search({
            index,
            body: {
                query: {
                    match: { title: term },
                },
            },
        });
        return body.hits.hits;
    }
}