// src/config/model-config.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ModelConfigService {
  private defaultConfig = {
    api: 'gpt',
    version: 'gpt-4o',
  };

  getDefaultConfig() {
    return this.defaultConfig;
  }
}
