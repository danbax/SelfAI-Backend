import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { LLMService } from '../interfaces/llm-service.interface';
import { LLMRequestDto } from '../dto/llm-request.dto';
import { LLMResponseDto } from '../dto/llm-response.dto';
import { ChatAnthropic } from '@langchain/anthropic';
import { HumanMessage, SystemMessage, BaseMessage } from '@langchain/core/messages';

@Injectable()
export class ClaudeAdapter implements LLMService {
  private readonly apiKey = process.env.ANTHROPIC_API_KEY;

  async generateText(request: LLMRequestDto): Promise<LLMResponseDto> {
    const startTime = Date.now();
    const { response, usage } = await this.callLangChainModel(request);
    const timeTaken = Date.now() - startTime;

    return this.mapToDto(response, request.model, timeTaken, usage);
  }

  private async callLangChainModel(request: LLMRequestDto): Promise<{ response: string, usage: { prompt_tokens: number, completion_tokens: number } }> {
    try {
      const chatModel = new ChatAnthropic({
        modelName: request.model,
        temperature: request.temperature ?? 0.7,
        maxTokens: request.maxTokens,
        anthropicApiKey: this.apiKey,
      });

      const messages: BaseMessage[] = request.messages.map(msg => 
        msg.role === 'system' ? new SystemMessage(msg.content) : new HumanMessage(msg.content)
      );

      const result = await chatModel.invoke(messages);
      const response = result.content.toString();

      const usage = {
        prompt_tokens: this.estimateTokens(messages.map(m => m.content).join(' ')),
        completion_tokens: this.estimateTokens(response.toString()),
      };

      return { response, usage };
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred while calling LangChain model',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  private mapToDto(responseText: string, model: string, timeTaken: number, usage: { prompt_tokens: number, completion_tokens: number }): LLMResponseDto {
    const totalTokens = usage.prompt_tokens + usage.completion_tokens;
    
    return {
      text: responseText,
      tokenUsage: totalTokens,
      price: this.calculatePrice(model, totalTokens),
      model: model,
      timeTaken: timeTaken,
    };
  }

  private calculatePrice(model: string, tokens: number): number {
    const pricePerToken = 0.000011;
    return tokens * pricePerToken;
  }
}