// src/core/llm/adapters/claude.adapter.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { LLMService } from '../interfaces/llm-service.interface';
import { LLMRequestDto } from '../dto/llm-request.dto';
import { LLMResponseDto } from '../dto/llm-response.dto';

@Injectable()
export class ClaudeAdapter implements LLMService {
  private readonly apiUrl = process.env.CLAUDE_API_URL;
  private readonly apiKey = process.env.CLAUDE_API_KEY;

  async generateText(request: LLMRequestDto): Promise<LLMResponseDto> {
    const startTime = Date.now();
    const response = await this.callClaudeApi(request);
    const timeTaken = Date.now() - startTime;

    return this.mapToDto(response.data, request.model, timeTaken);
  }

  private async callClaudeApi(request: LLMRequestDto) {
    try {
      return await axios.post(
        this.apiUrl,
        {
          model: request.version,
          conversation: request.messages,
          max_tokens: request.maxTokens,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      throw new HttpException(
        error.response?.data?.error?.message || 'An error occurred while calling Claude API',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private mapToDto(responseData: any, model: string, timeTaken: number): LLMResponseDto {
    return {
      text: responseData.completion,
      tokenUsage: responseData.usage?.total_tokens || 0, // Assuming Claude provides token info
      price: this.calculatePrice(responseData.usage?.total_tokens || 0),
      model: model,
      timeTaken: timeTaken,
    };
  }

  private calculatePrice(tokens: number): number {
    const pricePerToken = 0.000015;
    return tokens * pricePerToken;
  }
}
