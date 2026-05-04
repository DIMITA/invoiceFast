import { Controller, Post, Get, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { FastlaneDto } from './dto/fastlane.dto';

@Controller('ai')
export class FastlaneController {
  constructor(private readonly aiService: AiService) {}

  @Post('fastlane')
  async parse(@Body() dto: FastlaneDto) {
    return this.aiService.parseInvoiceInput(dto.input);
  }

  @Get('health')
  health() {
    return { status: 'ok', model: process.env.OLLAMA_MODEL ?? 'qwen2.5:7b' };
  }
}
