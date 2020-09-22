import { Injectable } from '@nestjs/common';

@Injectable()
export class PreviewAppService {
  private lesseeMapToken = {}

  setToken(lessee: string, token: string) {
    this.lesseeMapToken[lessee] = token;
  }

  getToken(lessee): string {
    return this.lesseeMapToken[lessee];
  }
}
