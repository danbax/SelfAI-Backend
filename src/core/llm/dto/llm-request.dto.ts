// src/core/llm/dto/llm-request.dto.ts
export class LLMMessageDto {
    role: 'system' | 'user' | 'assistant'; // Possible roles
    content: string;                        // The actual message content
  }
  
  export class LLMRequestDto {
    model: 'gpt' | 'claude' | 'gemini';     // Model type
    version: string;                        // Model version
    messages: LLMMessageDto[];              // Array of messages with roles
    maxTokens: number;                      // Max tokens for the response
    temperature?: number;                   // Optional temperature parameter
  }
  