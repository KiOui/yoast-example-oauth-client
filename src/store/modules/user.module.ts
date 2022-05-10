import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import Credentials from "@/models/credentials.model";
import CryptoService from "@/common/crypto.service";

const TOKEN_KEY = "credentials";
const OAUTH_STATE_KEY = "oauth_state";
const OAUTH_CHALLENGE_KEY = "oauth_challenge";

const savedCredentials = localStorage.getItem(TOKEN_KEY);
const savedStateKey = localStorage.getItem(OAUTH_STATE_KEY);
const savedChallenge = localStorage.getItem(OAUTH_CHALLENGE_KEY);

@Module({ namespaced: true })
class UserModule extends VuexModule {
  private credentials: Credentials | null = savedCredentials
    ? JSON.parse(savedCredentials)
    : null;
  public stateKey: string | null = savedStateKey
    ? JSON.parse(savedStateKey)
    : null;
  public challenge: string | null = savedChallenge
    ? JSON.parse(savedChallenge)
    : null;

  get accessToken(): string | null {
    if (this.credentials === null || this.credentials.expires_in < Date.now()) {
      return null;
    } else {
      return this.credentials.access_token;
    }
  }

  get refreshToken(): string | null {
    if (this.credentials === null) {
      return null;
    } else {
      return this.credentials.refresh_token;
    }
  }

  get expiresIn(): number | null {
    if (this.credentials === null) {
      return null;
    } else {
      return this.credentials.expires_in;
    }
  }

  get isLoggedIn(): boolean {
    return (
      this.credentials !== null && this.credentials.expires_in >= Date.now()
    );
  }

  get sha256Challenge(): Promise<string | null> | null {
    if (this.challenge === null) {
      return null;
    } else {
      return CryptoService.getSHA256(this.challenge);
    }
  }

  @Action
  newRandomState() {
    this.context.commit("setState", Math.random().toString().slice(2, 8));
  }

  @Mutation
  setState(state: string) {
    this.stateKey = state;
  }

  @Mutation
  removeState() {
    this.stateKey = null;
  }

  @Action
  newRandomChallenge() {
    this.context.commit("setChallenge", CryptoService.getRandomString(43));
  }

  @Mutation
  setChallenge(challenge: string) {
    this.challenge = challenge;
  }

  @Mutation
  removeChallenge() {
    this.stateKey = null;
  }

  @Mutation
  removeCredentials() {
    this.credentials = null;
  }

  @Action
  store(): void {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(this.credentials));
    localStorage.setItem(OAUTH_STATE_KEY, JSON.stringify(this.stateKey));
    localStorage.setItem(OAUTH_CHALLENGE_KEY, JSON.stringify(this.challenge));
  }

  @Action
  logout() {
    this.context.commit("removeCredentials");
    return this.context.dispatch("store");
  }

  @Action
  login(payload: {
    stateKey: string | null;
    accessToken: string;
    refreshToken: string;
    expires: number;
    tokenType: string;
  }): boolean {
    const { stateKey, accessToken, refreshToken, expires, tokenType } = payload;
    if (stateKey === null || this.stateKey === stateKey) {
      this.context.commit("setCredentials", {
        accessToken,
        refreshToken,
        expires,
        tokenType,
      });
      return true;
    } else {
      return false;
    }
  }

  @Mutation
  public setCredentials(payload: {
    accessToken: string;
    refreshToken: string;
    expires: number;
    tokenType: string;
  }) {
    const { accessToken, refreshToken, expires, tokenType } = payload;
    this.credentials = {
      ...this.credentials,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expires,
      token_type: tokenType,
    };
  }
}

export default UserModule;
