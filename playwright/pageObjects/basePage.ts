import { Locator, Page, Response } from '@playwright/test';
import { ENV } from '../config/env';
import { expirySecondsFromNow, isWithinTolerance } from '../helpers/dateUtils.ts';
import { compareWithBaseURL, urlCheck } from '../helpers/urlUtils.ts';

export abstract class BasePage {
  readonly page: Page;
  readonly password: string = ENV.defaultPassword;
  private readonly loginCookie: string = 'connect.sid';
  private readonly authStateKey: string = 'authState';

  constructor(page: Page) {
    this.page = page;
  }

  async openUrl(url: string) {
    if (this.page.url() !== url) {
      await this.page.goto(url);
    }
  }

  compareWithBaseURL(url: string) {
    return compareWithBaseURL(url);
  }

  urlCheck(url: string, pageUrl: string) {
    return urlCheck(url, pageUrl);
  }

  async triggerInputValidation(inputLocator: Locator, options?: { text?: string, clear?: boolean }) {
    const { text, clear } = options || { text: '', clear: true };
    if (clear) {
      await inputLocator.clear();
    }
    if (text && text.trim() !== '') {
      await inputLocator.fill(text);
    }
    await inputLocator.blur();
  }

  waitForResponse(
    urlPattern: string | ((response: Response) => boolean)
  ): Promise<Response> {
    return this.page.waitForResponse(urlPattern);
  }

  waitForGraphQL(operationName: string): Promise<Response> {
    return this.page.waitForResponse(
      (res) =>
        res.url().includes('/graphql') &&
        res.request().postDataJSON()?.operationName === operationName
    );
  }

  async getCookie(name: string) {
    const cookie = await this.page.context().cookies().then(cookies => cookies.find(cookie => cookie.name === name));
    return cookie;
  }

  async getLocalStorageItem(key: string) {
    const value = await this.page.evaluate((k) => localStorage.getItem(k), key);
    return value;
  }

  async loginCookieExists() {
    const cookie = await this.getCookie(this.loginCookie);
    return !!cookie;
  }

  async authStateExists() {
    const authState = await this.getLocalStorageItem(this.authStateKey);
    return !!authState;
  }

  async checkLoginCookieExpiresDate(expectedDays: number, toleranceSeconds = 30): Promise<boolean> {
    const cookie = await this.getCookie(this.loginCookie);
    if (!cookie || cookie.expires === -1) {
      throw new Error(`Cookie "${this.loginCookie}" not found or has no expiry date`);
    }
    return isWithinTolerance(cookie.expires, expirySecondsFromNow(expectedDays), toleranceSeconds);
  }
}
