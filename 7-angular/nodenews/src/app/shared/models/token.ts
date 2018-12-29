import { User } from './user';

export class Token {
  public accessToken: string;
  public accessTokenExpiresAt: Date;
  public refreshToken: string;
  public refreshTokenExpiresAt: Date;
  public scope: string;
  public client: string;
  public user: User;
}