import { Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class MainPage extends BasePage {

    // Onboarding
    readonly onboardingDialogLocator: Locator = this.page.locator('//div[@data-test="user-onboarding-dialog"]');
    readonly onboardingNextButtonLocator: Locator = this.page.locator('//button[@data-test="user-onboarding-next"]');
    readonly onboardingTitleLocator: Locator = this.page.locator('//h2[@data-test="user-onboarding-dialog-title"]');
    readonly onboardingContentLocator: Locator = this.page.locator('//div[@data-test="user-onboarding-dialog-content"]');
    readonly bankNameInputLocator: Locator = this.page.locator('//div[@data-test="bankaccount-bankName-input"]//input');
    readonly accountNumberInputLocator: Locator = this.page.locator('//div[@data-test="bankaccount-accountNumber-input"]//input');
    readonly routingNumberInputLocator: Locator = this.page.locator('//div[@data-test="bankaccount-routingNumber-input"]//input');
    readonly onboardingSubmitButtonLocator: Locator = this.page.locator('//button[@data-test="bankaccount-submit"]');

    // content
    readonly transactionListLocator: Locator = this.page.locator('//div[@data-test="transaction-list"]');
    readonly listSkeletonLocator: Locator = this.page.locator('//div[@data-test="list-skeleton"]');

    // Sidenav
    readonly sidenavToggleLocator: Locator = this.page.locator('//button[@data-test="sidenav-toggle"]');
    readonly sidenavSignOutLocator: Locator = this.page.locator('//div[@data-test="sidenav-signout"]');

    // navbar
    readonly navTopNotificationsCountLocator: Locator = this.page.locator('//span[@data-test="nav-top-notifications-count"]');

    constructor(page: Page) {
        super(page);
    }

    async getOnboardingDialogTitle() {
        const text = await this.onboardingTitleLocator.innerText();
        return text;
    }

    async getOnboardingDialogContent() {
        const text = await this.onboardingContentLocator.innerText();
        return text;
    }

    async onboardingNextClick() {
        await this.onboardingNextButtonLocator.click();
    }

    async onboardingFillBankAccountForm(bankName: string, accountNumber: string, routingNumber: string) {
        await this.bankNameInputLocator.fill(bankName);
        await this.accountNumberInputLocator.fill(accountNumber);
        await this.routingNumberInputLocator.fill(routingNumber);
    }

    async onboardingCreateBankAccount(bankName: string, accountNumber: string, routingNumber: string) {

        await this.onboardingFillBankAccountForm(bankName, accountNumber, routingNumber);
        await this.onboardingClickSubmit();
    }

    async onboardingClickSubmit() {
        const mutation = this.waitForGraphQL("CreateBankAccount");
        await this.onboardingSubmitButtonLocator.click();
        return (await mutation).status();
    }

    async logout(isMobile: boolean = false) {
        const logoutResponse = this.waitForResponse("**/logout");
        if (isMobile) {
            await this.sidenavToggleLocator.click();
        }
        await this.sidenavSignOutLocator.click();
        return (await logoutResponse).status();
    }
}