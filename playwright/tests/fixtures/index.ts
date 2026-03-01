import { test as base, request as baseRequest } from '@playwright/test';
import { SignInPage } from "../../pageObjects/signInPage";
import { MainPage } from "../../pageObjects/mainPage";
import { SignUpPage } from '../../pageObjects/signUpPage';
export { expect } from '@playwright/test';
import { seedDatabase } from '../../helpers/dbUtils';

type Pages = { signInPage: SignInPage, mainPage: MainPage, signUpPage: SignUpPage, _seed: void };

export const test = base.extend<Pages>({

    _seed: [async ({ }, use) => {
        const apiContext = await baseRequest.newContext();
        await seedDatabase(apiContext);
        await apiContext.dispose();
        await use();
    }, { auto: true }],

    signInPage: async ({ page }, use) => {
        const signInPage = new SignInPage(page);
        await use(signInPage);
    },

    mainPage: async ({ page }, use) => {
        const mainPage = new MainPage(page);
        await use(mainPage);
    },

    signUpPage: async ({ page }, use) => {
        const signUpPage = new SignUpPage(page);
        await use(signUpPage);
    }
});