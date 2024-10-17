import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { LLMService } from '../interfaces/llm-service.interface';
import { LLMRequestDto } from '../dto/llm-request.dto';
import { LLMResponseDto } from '../dto/llm-response.dto';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage, BaseMessage } from '@langchain/core/messages';
import { encoding_for_model, TiktokenModel } from 'tiktoken';
import { FunctionCallResponse } from '../interfaces/llm-service.interface';

@Injectable()
export class GPTAdapter implements LLMService {
  private readonly apiKey = process.env.OPENAI_API_KEY;

  async generateText(request: LLMRequestDto): Promise<LLMResponseDto> {
    const startTime = Date.now();
    const result: { message: string; promptTokens: number; actions: any[] } = await this.callLangChainModel(request);
    const timeTaken = Date.now() - startTime;

    return this.mapToDto(result.message, request.version, timeTaken, result.promptTokens, result.actions);
  }

  private async callLangChainModel(request: LLMRequestDto): Promise<{ message: string, promptTokens: number, actions: any[] }> {
    try {
      const modelConfig = {
        modelName: request.version,
        temperature: request.temperature ?? 0.7,
        maxTokens: request.maxTokens,
        openAIApiKey: this.apiKey
      }

      const tools = [
        {
          type: "function",
          function: {
            name: 'updateUserData',
            description: 'Update users data',
            parameters: {
              type: 'object',
              properties: {
                collection_name: { type: 'string' },
                data: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      title: { type: 'string' },
                      icon: { type: 'string' },
                      description: { type: 'string' },
                      type: { type: 'string' },
                      data: { type: 'string' }
                    },
                    required: ['title', 'icon', 'description', 'type', 'data']
                  }
                }
              },
              required: ['collection_name', 'data']
            }
          }
        },
        {
          type: "function",
          function: {
            name: 'finishSession',
            description: 'End the current session',
            parameters: null
          }
        },
        {
          type: "function",
          function: {
            name: 'setDarkMode',
            description: 'Toggle dark mode',
            parameters: {
              type: 'object',
              properties: {
                darkMode: { type: 'boolean' }
              },
              required: ['darkMode']
            }
          }
        },
        {
          type: "function",
          function: {
            name: 'goToRouter',
            description: 'Navigate to a different route',
            parameters: {
              type: 'object',
              properties: {
                name: { type: 'string' }
              },
              required: ['name']
            }
          }
        }
      ];

      const chatModelInit = new ChatOpenAI(modelConfig);
      const chatModel = chatModelInit.bindTools(tools);

      const messages: BaseMessage[] = request.messages.map(msg => 
        msg.role === 'system' ? new SystemMessage(msg.content) : new HumanMessage(msg.content)
      );

      const promptTokens = this.countTokens(request.version, messages.map(m => m.content).join('\n'));
      const chatResponse = await chatModel.invoke(messages);

      let actions = [];
      if (chatResponse.additional_kwargs && chatResponse.additional_kwargs.tool_calls) {
        actions = chatResponse.additional_kwargs.tool_calls.map(toolCall => ({
          name: toolCall.function.name,
          parameters: JSON.parse(toolCall.function.arguments)
        }));
      } 

        return {
          message: Array.isArray(chatResponse.content) ? chatResponse.content.join(' ') : chatResponse.content,
          actions,
          promptTokens: promptTokens
        };
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

  private mapToDto(responseText: string, model: string, timeTaken: number, promptTokens: number, actions: any[]): LLMResponseDto {
    const completionTokens = this.countTokens(model, responseText);
    const totalTokens = promptTokens + completionTokens;
    
    return {
      text: responseText,
      tokenUsage: totalTokens,
      price: this.calculatePrice(model, promptTokens, completionTokens),
      model: model,
      timeTaken: timeTaken,
      actions
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