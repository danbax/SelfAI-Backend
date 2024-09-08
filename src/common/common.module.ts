import { Module } from '@nestjs/common';
import { LoggerService } from './logger/logger.service';
import { DecoratorsService } from './decorators/decorators.service';
import { FiltersService } from './filters/filters.service';
import { MiddlewaresService } from './middlewares/middlewares.service';
import { PipesService } from './pipes/pipes.service';
import { InterceptorsService } from './interceptors/interceptors.service';

@Module({
  providers: [LoggerService, DecoratorsService, FiltersService, MiddlewaresService, PipesService, InterceptorsService]
})
export class CommonModule {}
