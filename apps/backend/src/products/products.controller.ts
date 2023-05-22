import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FastifyRequest } from 'fastify';

@Controller('/api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Req() request: FastifyRequest,
    @Body() createProductDto: CreateProductDto,
  ) {
    const newProduct = await this.productsService.create(
      request,
      createProductDto,
    );
    return newProduct;
  }

  @Get()
  async findAll(@Req() request: FastifyRequest) {
    console.log('in products controller');

    const res = await this.productsService.findAll(request);
    return res;
  }

  @Delete(':id')
  async remove(@Req() request: FastifyRequest, @Param('id') id: string) {
    const res = await this.productsService.remove(request, id);
    return res;
  }
}
