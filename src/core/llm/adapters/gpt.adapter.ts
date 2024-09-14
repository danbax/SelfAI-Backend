// src/core/llm/adapters/gpt.adapter.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { LLMService } from '../interfaces/llm-service.interface';
import { LLMRequestDto } from '../dto/llm-request.dto';
import { LLMResponseDto } from '../dto/llm-response.dto';

@Injectable()
export class GPTAdapter implements LLMService {
  private readonly apiUrl = process.env.GPT_API_URL;
  private readonly apiKey = process.env.GPT_API_KEY;

  async generateText(request: LLMRequestDto): Promise<LLMResponseDto> {
    const startTime = Date.now();
    const response = await this.callGPTApi(request);
    const timeTaken = Date.now() - startTime;

    return this.mapToDto(response.data, request.model, timeTaken);
  }

  private async callGPTApi(request: LLMRequestDto) {
    try {
      return await axios.post(
        this.apiUrl,
        {
          model: request.version,
          messages: request.messages,
          max_tokens: request.maxTokens,
          temperature: request.temperature ?? 0.7,
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
        error.response?.data?.error?.message || 'An error occurred while calling GPT API',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private mapToDto(responseData: any, model: string, timeTaken: number): LLMResponseDto {
    return {
      text: responseData.choices[0].message.content,
      tokenUsage: responseData.usage?.total_tokens || 0,
      price: this.calculatePrice(responseData.usage?.total_tokens || 0),
      model: model,
      timeTaken: timeTaken,
    };
  }

  private calculatePrice(tokens: number): number {
    const pricePerToken = 0.00002;
    return tokens * pricePerToken;
  }
}
