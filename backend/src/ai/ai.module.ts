import { Module } from '@nestjs/common';
import { FastlaneController } from './fastlane.controller';
import { AiService } from './ai.service';

@Module({
  controllers: [FastlaneController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
