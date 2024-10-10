// src/core/sessions/controllers/sessions.controller.ts

import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { SessionService } from '../services/session.service';
import { GetSessionsDto } from '../dto/get-sessions.dto';
import { TokenValidationGuard } from '../../../common/guards/token-validation.guard';
import { UserRequest } from '../../../common/interfaces/user-request.interface';

@Controller('sessions')
@UseGuards(TokenValidationGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  async getSessions(
    @Req() req: UserRequest,
    @Body() body: GetSessionsDto, 
) {
    const userId = req.user.id;
    return this.sessionService.getSessions(body, userId);
  }
}