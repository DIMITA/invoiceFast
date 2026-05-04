import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceStatus } from './invoice.types';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  findAll(@Query('search') search?: string, @Query('status') status?: InvoiceStatus) {
    return this.invoiceService.findAll(search, status);
  }

  @Get('stats')
  stats() {
    return this.invoiceService.stats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateInvoiceDto) {
    return this.invoiceService.create(dto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: InvoiceStatus) {
    return this.invoiceService.updateStatus(id, status);
  }
}
