import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { LLMService } from '../interfaces/llm-service.interface';
import { LLMRequestDto } from '../dto/llm-request.dto';
import { LLMResponseDto } from '../dto/llm-response.dto';
import { ChatOpenAI, OpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage, BaseMessage } from '@langchain/core/messages';
import { encoding_for_model, TiktokenModel } from 'tiktoken';

@Injectable()
export class GPTAdapter implements LLMService {
  private readonly apiKey = process.env.OPENAI_API_KEY;

  async generateText(request: LLMRequestDto): Promise<LLMResponseDto> {
    const startTime = Date.now();
    const { response, promptTokens } = await this.callLangChainModel(request);
    const timeTaken = Date.now() - startTime;

    return this.mapToDto(response, request.model, timeTaken, promptTokens);
  }

  private async callLangChainModel(request: LLMRequestDto): Promise<{ response: string, promptTokens: number }> {
    try {
      let response: string;
      let promptTokens: number;

      if (request.model.toLowerCase().includes('gpt-3.5') || request.model.toLowerCase().includes('gpt-4')) {
        const chatModel = new ChatOpenAI({
          modelName: request.model,
          temperature: request.temperature ?? 0.7,
          maxTokens: request.maxTokens,
          openAIApiKey: this.apiKey,
        });

        const messages: BaseMessage[] = request.messages.map(msg => 
          msg.role === 'system' ? new SystemMessage(msg.content) : new HumanMessage(msg.content)
        );

        promptTokens = this.countTokens(request.model, messages.map(m => m.content).join('\n'));
        const chatResponse = await chatModel.invoke(messages);
        response = Array.isArray(chatResponse.content) ? chatResponse.content.join(' ') : chatResponse.content;
      } else {
        const model = new OpenAI({
          modelName: request.model,
          temperature: request.temperature ?? 0.7,
          maxTokens: request.maxTokens,
          openAIApiKey: this.apiKey,
        });

        promptTokens = this.countTokens(request.model, request.messages[request.messages.length - 1].content);
        response = await model.invoke(request.messages[request.messages.length - 1].content);
      }

      return { response, promptTokens };
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred while calling LangChain model',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private countTokens(model: string, text: string): number {
    const enc = encoding_for_model(model as TiktokenModel);
    return enc.encode(text).length;
  }

  private mapToDto(responseText: string, model: string, timeTaken: number, promptTokens: number): LLMResponseDto {
    const completionTokens = this.countTokens(model, responseText);
    const totalTokens = promptTokens + completionTokens;
    
    return {
      text: responseText,
      tokenUsage: totalTokens,
      price: this.calculatePrice(model, promptTokens, completionTokens),
      model: model,
      timeTaken: timeTaken,
    };
  }

  private calculatePrice(model: string, promptTokens: number, completionTokens: number): number {
    const prices = {
      'gpt-3.5-turbo': { prompt: 0.0015, completion: 0.002 },
      'gpt-4o': { prompt: 0.03, completion: 0.06 },
    };

    const modelPrice = prices[model] || prices['gpt-4o'];
    return (promptTokens * modelPrice.prompt + completionTokens * modelPrice.completion) / 1000;
  }
}