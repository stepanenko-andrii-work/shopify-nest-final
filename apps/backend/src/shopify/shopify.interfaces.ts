export interface IInstallAppResult {
  installUrl: string;
  state: string;
}

export interface IAccessTokenPayload {
  client_id: string;
  client_secret: string;
  code: string;
}

export interface ICheckHmacResult {
  accessTokenRequestUrl: string;
  accessTokenPayload: IAccessTokenPayload;
  shop: string;
  host: string;
}

export interface IRedirectUrl {
  url: string;
}
