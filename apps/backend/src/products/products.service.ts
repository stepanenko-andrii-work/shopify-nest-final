import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import '@shopify/shopify-api/adapters/node';
import { shopify } from 'src/shopify/shopify.config';
import { Session } from '@shopify/shopify-api';
import { FastifyRequest } from 'fastify';

@Injectable()
export class ProductsService {
  async create(request: FastifyRequest, createProductDto: CreateProductDto) {
    const session: Session = request['raw']['sessionData'];

    if (!session)
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);

    const productData = JSON.parse(createProductDto as string);

    const newProduct = new shopify.rest.Product({
      session: session,
    });
    newProduct.title = productData.title;
    newProduct.vendor = productData.vendor;
    newProduct.product_type = productData.product_type;
    try {
      await newProduct.save({
        update: true,
      });
      return newProduct;
    } catch (error) {
      throw new HttpException(
        'Error creating new Product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(request: FastifyRequest) {
    const session: Session = request['raw']['sessionData'];

    console.log('session', session);

    if (!session)
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);

    try {
      console.log('in products');

      const allProducts = await shopify.rest.Product.all({
        session: session,
      });
      return allProducts;
    } catch (error) {
      throw new HttpException(
        'Error getting Products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(request: FastifyRequest, id: string) {
    const session: Session = request['raw']['sessionData'];

    if (!session)
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);

    try {
      const response = await shopify.rest.Product.delete({
        session: session,
        id,
      });
      return response;
    } catch (error) {
      throw new HttpException(
        'Error deleting Product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
