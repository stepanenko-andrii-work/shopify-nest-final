import { Controller, Get, Redirect, Req, Res } from '@nestjs/common';
import { ShopifyService } from './shopify.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  ICheckHmacResult,
  IInstallAppResult,
  IRedirectUrl,
} from './shopify.interfaces';

@Controller('api/auth')
export class ShopifyController {
  constructor(private readonly shopifyService: ShopifyService) {}
  @Get()
  @Redirect()
  async installApp(
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<IRedirectUrl> {
    console.log('123');

    const { installUrl, state }: IInstallAppResult =
      await this.shopifyService.installApp(request);

    console.log('f');

    // reply.setCookie('state', state);

    return { url: installUrl };
  }

  @Get('callback')
  @Redirect()
  async getAccessToken(
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<IRedirectUrl> {
    // console.log('reply', reply['raw']);
    // console.log(reply);

    // reply.clearCookie('state');

    const {
      accessTokenRequestUrl,
      accessTokenPayload,
      shop,
      host,
    }: ICheckHmacResult = await this.shopifyService.checkHmac(request);

    await this.shopifyService.getAccessToken(
      accessTokenRequestUrl,
      accessTokenPayload,
      request,
    );

    console.log(process.env.MODE, process.env.HOST);

    if (process.env.MODE === 'dev') {
      return {
        url: `${process.env.FRONTEND_HOST}?shop=${shop}&host=${host}`,
      };
    } else if (process.env.MODE === 'prod') {
      return { url: `${process.env.HOST}?shop=${shop}&host=${host}` };
    }

    return { url: `${process.env.FRONTEND_HOST}?shop=${shop}&host=${host}` };
  }
}
