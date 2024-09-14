import { LLMRequestDto } from '../dto/llm-request.dto';
import { LLMResponseDto } from '../dto/llm-response.dto';

export interface LLMService {
    generateText(request: LLMRequestDto): Promise<LLMResponseDto>
}
  