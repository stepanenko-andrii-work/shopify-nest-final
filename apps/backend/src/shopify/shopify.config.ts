import { LATEST_API_VERSION, shopifyApi } from '@shopify/shopify-api';
import { restResources } from '@shopify/shopify-api/rest/admin/2023-01';
import { config } from 'dotenv';
config();

export const shopify = shopifyApi({
  apiKey: process.env.API_KEY,
  apiSecretKey: process.env.API_SECRET_KEY,
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  scopes: process.env.SCOPES.split(','),
  hostName: process.env.HOST,
  restResources,
});
