import { LLMRequestDto } from '../dto/llm-request.dto';
import { LLMResponseDto } from '../dto/llm-response.dto';

export interface FunctionCallResponse {
    message: string;
    actions: Array<{
      name: string;
      parameters: Record<string, any>;
    }>;
  }
  
export interface LLMService {
    generateText(request: LLMRequestDto): Promise<LLMResponseDto>
}
  