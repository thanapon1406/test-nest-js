import { Injectable } from '@nestjs/common';
import { Client } from 'elasticsearch';
import { Logger } from '@nestjs/common';

@Injectable()
export class ElasticsearchService {
    static readonly client = new Client({ node: 'http://localhost:9200' });
    async searchAll(index: string): Promise<any> {
        const result = await ElasticsearchService.client.search({
            index,
            body: {
                query: {
                    match_all: {},
                },
            },
        });
        return result.hits.hits;
    }
    async search(index: string, term: any): Promise<any> {
        const result = await ElasticsearchService.client.search({
            index,
            body: {
                query: {
                    term: term,
                },
            },
        });
        return result.hits.hits;
    }
    async indexDocument(index: string, body: any): Promise<any> {
        return await ElasticsearchService.client.index({
            index,
            body,
        });
    }
}