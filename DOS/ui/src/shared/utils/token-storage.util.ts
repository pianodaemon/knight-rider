// import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

let cookies = new Cookies(); 

export class TokenStorage {

  private static readonly COOKIE_STORAGE_TOKEN = 'token';

  public static isAuthenticated(): boolean {
    let validToken: boolean = false;
    try {
      validToken = Boolean(jwt_decode(this.getToken() || ''));
    } catch(e) {
      console.log('Invalid Token.', e);
    }
    return validToken;
  }

  public static getNewToken(): never {
    throw new Error('Not Implemented');
  }

  public static storeToken(token: string): void {
    const jwt: any = jwt_decode(token);
    cookies.set(
      TokenStorage.COOKIE_STORAGE_TOKEN,
      token,
      { path: '/', expires: new Date(jwt.exp * 1000) }
    );
  }

  public static clear(): void {
    cookies.remove(TokenStorage.COOKIE_STORAGE_TOKEN, { path: '/' });
  }

  public static getToken(): string | null {
    return cookies.get(TokenStorage.COOKIE_STORAGE_TOKEN) || null;
  }

  public static getTokenClaims(): { [key: string]: string | number } | null {
    return jwt_decode(this.getToken() || '');
  }

}