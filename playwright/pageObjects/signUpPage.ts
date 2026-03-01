import { Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class SignUpPage extends BasePage {
    readonly url: string = '/signup';
    readonly firstNameInput: Locator = this.page.locator('//div[@data-test="signup-first-name"]//input');
    readonly lastNameInput: Locator = this.page.locator('//div[@data-test="signup-last-name"]//input');
    readonly usernameInput: Locator = this.page.locator('//div[@data-test="signup-username"]//input');
    readonly passwordInput: Locator = this.page.locator('//div[@data-test="signup-password"]//input');
    readonly confirmPasswordInput: Locator = this.page.locator('//div[@data-test="signup-confirmPassword"]//input');

    private readonly confirmPasswordValidationMessage: Locator = this.page.locator('//div[@data-test="signup-confirmPassword"]//p');
    private readonly firstNameValidationMessage: Locator = this.page.locator('//div[@data-test="signup-first-name"]//p');
    private readonly lastNameValidationMessage: Locator = this.page.locator('//div[@data-test="signup-last-name"]//p');
    private readonly usernameValidationMessage: Locator = this.page.locator('//div[@data-test="signup-username"]//p');
    private readonly passwordValidationMessage: Locator = this.page.locator('//div[@data-test="signup-password"]//p');

    readonly submitButton: Locator = this.page.locator('//button[@data-test="signup-submit"]');

    constructor(page: Page) {
        super(page);
    }

    async open() {
        await this.openUrl(this.url);
    }

    async getConfirmPasswordValidationMessage() {
        const text = await this.confirmPasswordValidationMessage.innerText();
        return text;
    }

    async getFirstNameValidationMessage() {
        const text = await this.firstNameValidationMessage.innerText();
        return text;
    }

    async getLastNameValidationMessage() {
        const text = await this.lastNameValidationMessage.innerText();
        return text;
    }

    async getUsernameValidationMessage() {
        const text = await this.usernameValidationMessage.innerText();
        return text;
    }

    async getPasswordValidationMessage() {
        const text = await this.passwordValidationMessage.innerText();
        return text;
    }

    async signup(firstName: string, lastName: string, email: string, password: string = this.password) {
        if (this.page.url() !== this.url) {
            this.page.goto(this.url);
        }
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.usernameInput.fill(email);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(password);
        const signUpResponsePromise = this.waitForResponse("**/users");
        await this.clickSubmit();
        return (await signUpResponsePromise).status();
    }

    async clickSubmit() {
        await this.submitButton.click();
    }

    async validationMessageFirstName() {
        await this.triggerInputValidation(this.firstNameInput);
    }

    async validationMessageLastName() {
        await this.triggerInputValidation(this.lastNameInput);
    }

    async validationMessageUsername() {
        await this.triggerInputValidation(this.usernameInput);
    }

    async validationMessagePassword() {
        await this.triggerInputValidation(this.passwordInput);
    }

    async validationMessageConfirmPassword(password: string) {
        await this.triggerInputValidation(this.confirmPasswordInput, { text: password });
    }
}