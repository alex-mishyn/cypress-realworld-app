import { Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class SignInPage extends BasePage {
    readonly url: string = '/signin';
    readonly submitButton: Locator = this.page.locator('//button[@data-test="signin-submit"]');
    private readonly signUpLink: Locator = this.page.locator('//a[@data-test="signup"]');
    private readonly usernameInput: Locator = this.page.locator('//div[@data-test="signin-username"]//input');
    private readonly passwordInput: Locator = this.page.locator('//div[@data-test="signin-password"]//input');
    private readonly rememberMeCheckbox: Locator = this.page.locator('//input[@name="remember"]');
    private readonly usernameValidationMessage: Locator = this.page.locator('//div[@data-test="signin-username"]//p');
    private readonly passwordValidationMessage: Locator = this.page.locator('//div[@data-test="signin-password"]//p');
    private readonly signInErrorMessageLocator: Locator = this.page.locator('//div[@data-test="signin-error"]');

    constructor(page: Page) {
        super(page);
    }

    async open() {
        await this.page.goto(this.url);
    }

    async hasValidURL(url: string) {
        return this.urlCheck(url, this.url);
    }

    async getUsernameValidationMessage() {
        const text = await this.usernameValidationMessage.innerText();
        return text;
    }

    async getPasswordValidationMessage() {
        const text = await this.passwordValidationMessage.innerText();
        return text;
    }

    async login(username: string, options?: { rememberUser?: boolean, password?: string }) {

        if (this.page.url() !== this.url) {
            await this.page.goto(this.url);
        }
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(options?.password || this.password);
        if (options?.rememberUser) {
            await this.rememberMeCheckbox.check();
        }

        const loginResponsePromise = this.waitForResponse("**/login");
        await this.submitButton.click();

        return (await loginResponsePromise).status();
    }

    async usernameValidation(): Promise<void> {
        this.triggerInputValidation(this.usernameInput);
    }

    async passwordValidation(text: string): Promise<void> {
        this.triggerInputValidation(this.passwordInput, { text });
    }

    async clickSignUpLink() {
        await this.signUpLink.click();
    }

    async signInErrorMessage() {
        const text = await this.signInErrorMessageLocator.innerText();
        return text;
    }


}