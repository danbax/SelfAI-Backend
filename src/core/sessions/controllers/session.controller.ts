// session.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { SessionService } from '../services/session.service';
import { GetSessionsDto } from '../dto/get-sessions.dto';

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  async getSessions(@Body() body: GetSessionsDto) {
    return this.sessionService.getSessions(body);
  }
}
