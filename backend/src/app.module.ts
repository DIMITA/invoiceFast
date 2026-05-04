import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InvoiceModule } from './invoice/invoice.module';
import { CustomerModule } from './customer/customer.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    InvoiceModule,
    CustomerModule,
    AiModule,
  ],
})
export class AppModule {}
