// src/user/user-preference.service.ts
import { Injectable } from '@nestjs/common';
import { ModelConfigService } from '../../../config/model-config.service';

@Injectable()
export class UserPreferenceService {
  private userPreferences = new Map<string, any>();

  constructor(private readonly modelConfigService: ModelConfigService) {}

  // Fetch user preferences, fallback to default if not set
  getUserConfig(userId: string) {
    const userConfig = this.userPreferences.get(userId);

    if (userConfig) {
      return userConfig;
    }

    return this.modelConfigService.getDefaultConfig();
  }

  setUserConfig(userId: string, config: { api: string; version: string }) {
    this.userPreferences.set(userId, config);
  }
}
