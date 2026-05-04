import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ParsedInvoice {
  customerName: string;
  amount: number;
  description: string;
  confidence: number;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly ollamaUrl: string;
  private readonly model: string;

  constructor(private config: ConfigService) {
    this.ollamaUrl = config.get('OLLAMA_URL', 'http://ollama:11434');
    this.model = config.get('OLLAMA_MODEL', 'qwen2.5:7b');
  }

  async parseInvoiceInput(input: string): Promise<ParsedInvoice> {
    const prompt = `You are an invoice parsing assistant. Extract invoice data from the user's natural language input.

User input: "${input}"

Respond ONLY with a valid JSON object (no markdown, no explanation) with these fields:
- customerName: string (name of the customer/client)
- amount: number (amount in euros, numeric only)
- description: string (service or product description)
- confidence: number (0-1, how confident you are in the extraction)

Example response: {"customerName":"Dupont","amount":1200,"description":"prestation développement","confidence":0.95}`;

    try {
      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
          format: 'json',
          options: { temperature: 0.1 },
        }),
      });

      if (!response.ok) throw new Error(`Ollama error: ${response.status}`);

      const data = await response.json();
      const parsed = JSON.parse(data.response);
      return {
        customerName: parsed.customerName ?? '',
        amount: Number(parsed.amount) || 0,
        description: parsed.description ?? '',
        confidence: Number(parsed.confidence) || 0.5,
      };
    } catch (err) {
      this.logger.warn(`Ollama unavailable, using regex fallback: ${err.message}`);
      return this.regexFallback(input);
    }
  }

  private regexFallback(input: string): ParsedInvoice {
    const amountMatch = input.match(/(\d+(?:[.,]\d+)?)\s*(?:€|eur|euros?)/i);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(',', '.')) : 0;

    const clientMatch = input.match(/(?:client|pour|to)\s+([A-Za-zÀ-ÿ\s&]+?)(?:\s+pour|\s+montant|$)/i);
    const customerName = clientMatch ? clientMatch[1].trim() : '';

    const descMatch = input.match(/(?:pour|for)\s+(.+?)(?:\s+\d+|$)/i);
    const description = descMatch ? descMatch[1].trim() : input;

    return { customerName, amount, description, confidence: 0.4 };
  }
}
