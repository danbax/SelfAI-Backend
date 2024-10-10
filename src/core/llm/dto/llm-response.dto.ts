// src/core/llm/dto/llm-response.dto.ts
export class LLMResponseDto {
  text: string;                // The generated text
  tokenUsage: number;          // Number of tokens used for the response
  price: number;               // Price for generating the text
  model: string;               // Model used to generate the text
  timeTaken: number;           // Time taken to generate the response (in milliseconds)
}

export class LLMResponseClientDto {
  text: string;   
  payload?: LLMResponseClientDtoPayload
}
  
export class LLMResponseClientDtoPayload {
  actions: LLMResponseClientDtoPayloadAction[];
}

export class LLMResponseClientDtoPayloadAction {
  name: string;              
  parameters: any[];
}