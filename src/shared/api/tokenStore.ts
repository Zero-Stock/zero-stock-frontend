export type TokenState = {
  accessToken: string | null;
  expiresAt?: number | null;
};

class TokenStore {
  private state: TokenState = { accessToken: null, expiresAt: null };

  get() {
    return this.state;
  }

  set(next: Partial<TokenState>) {
    this.state = { ...this.state, ...next };
  }

  clear() {
    this.state = { accessToken: null, expiresAt: null };
  }
}

export const tokenStore = new TokenStore();
