import { test, expect } from './fixtures';
import userTestData from './fixtures/users.json';
import newUsers from './fixtures/newUsers.json';
import wordings from './fixtures/wordings.json';

test.describe('User Sign-up and Login', () => {

  test('should redirect unauthenticated user to signin page', async ({ signInPage }) => {
    await signInPage.open();
    expect(await signInPage.hasValidURL(signInPage.page.url())).toBeTruthy();
    await expect(signInPage.page).toHaveScreenshot("Redirect to SignIn.png");
  });

  /*
it("should redirect unauthenticated user to signin page", function () {
  cy.visit("/personal");
  cy.location("pathname").should("equal", "/signin");
  cy.visualSnapshot("Redirect to SignIn");
});
*/

  test('should redirect to the home page after login', async ({ signInPage }) => {
    const user = userTestData.user1;
    await signInPage.login(user.username, { rememberUser: true });
    expect(await signInPage.hasValidURL(signInPage.page.url())).toBeTruthy();
    expect(await signInPage.loginCookieExists()).toBeTruthy();
    expect(await signInPage.authStateExists()).toBeTruthy();
  });

  /*
  it("should redirect to the home page after login", function () {
      cy.database("find", "users").then((user: User) => {
        cy.login(user.username, "s3cret", { rememberUser: true });
      });
      cy.location("pathname").should("equal", "/");
    });
  */

  test('should remember a user for 30 days after login', async ({ mainPage, signInPage, isMobile }) => {
    const user = userTestData.user1;
    await signInPage.login(user.username, { rememberUser: true });
    expect(await signInPage.loginCookieExists()).toBeTruthy();
    expect(await signInPage.checkLoginCookieExpiresDate(30)).toBeTruthy();
    const logoutStatus = await mainPage.logout(isMobile);
    expect(logoutStatus).toBe(302);
    await expect(signInPage.page).toHaveURL(signInPage.url);
    await expect(mainPage.page).toHaveScreenshot("Redirect to SignIn.png");
  });

  /*
  it("should remember a user for 30 days after login", function () {
      cy.database("find", "users").then((user: User) => {
        cy.login(user.username, "s3cret", { rememberUser: true });
      });
  
      // Verify Session Cookie
      cy.getCookie("connect.sid").should("have.property", "expiry");
  
      // Logout User
      if (isMobile()) {
        cy.getBySel("sidenav-toggle").click();
      }
      cy.getBySel("sidenav-signout").click();
      cy.location("pathname").should("eq", "/signin");
      cy.visualSnapshot("Redirect to SignIn");
    });
    */

  test('should allow a visitor to sign-up, login, and logout', async ({ signInPage, mainPage, signUpPage, isMobile }) => {
    const userInfo = newUsers.users;
    const onboardingWordings = wordings.onboarding;

    // Sign-up User
    await signInPage.open();
    await signInPage.clickSignUpLink();
    const signUpStatus = await signUpPage.signup(userInfo.firstName, userInfo.lastName, userInfo.username);
    expect(signUpStatus).toBe(201);

    //login user
    const loginStatus = await signInPage.login(userInfo.username, { rememberUser: false });
    expect(loginStatus).toBe(200);

    //onboarding
    await expect(mainPage.onboardingDialogLocator).toBeAttached();
    await expect(mainPage.listSkeletonLocator).not.toBeAttached();
    await expect(mainPage.navTopNotificationsCountLocator).toBeVisible();
    await expect(mainPage.page).toHaveScreenshot("User Onboarding Dialog.png");
    await mainPage.onboardingNextClick();

    expect(await mainPage.getOnboardingDialogTitle()).toMatch(onboardingWordings.dialogTitleStart);
    await mainPage.onboardingFillBankAccountForm(userInfo.bank, userInfo.accountnumber, userInfo.routingnumber);
    await expect(mainPage.page).toHaveScreenshot("About to complete User Onboarding.png");
    const createBankAccountStatus = await mainPage.onboardingClickSubmit();
    expect(createBankAccountStatus).toBe(200);

    expect(await mainPage.getOnboardingDialogTitle()).toMatch(onboardingWordings.dialogTitleEnd);
    expect(await mainPage.getOnboardingDialogContent()).toMatch(onboardingWordings.dialogContent);
    await expect(mainPage.page).toHaveScreenshot("Finished User Onboarding.png");
    await mainPage.onboardingNextClick();

    await expect(mainPage.transactionListLocator).toBeVisible();
    await expect(mainPage.page).toHaveScreenshot("Transaction List is visible after User Onboarding.png");

    //logout user
    const logoutStatus = await mainPage.logout(isMobile);
    expect(logoutStatus).toBe(302);
    await expect(signInPage.page).toHaveURL(signInPage.url);
    await expect(mainPage.page).toHaveScreenshot("Redirect to SignIn.png");
  });

  /*
    it("should allow a visitor to sign-up, login, and logout", function () {
      const userInfo = {
        firstName: "Bob",
        lastName: "Ross",
        username: "PainterJoy90",
        password: "s3cret",
      };
  
      // Sign-up User
      cy.visit("/");
  
      cy.getBySel("signup").click();
      cy.getBySel("signup-title").should("be.visible").and("contain", "Sign Up");
      cy.visualSnapshot("Sign Up Title");
  
      cy.getBySel("signup-first-name").type(userInfo.firstName);
      cy.getBySel("signup-last-name").type(userInfo.lastName);
      cy.getBySel("signup-username").type(userInfo.username);
      cy.getBySel("signup-password").type(userInfo.password);
      cy.getBySel("signup-confirmPassword").type(userInfo.password);
      cy.visualSnapshot("About to Sign Up");
      cy.getBySel("signup-submit").click();
      cy.wait("@signup");
  
      // Login User
      cy.login(userInfo.username, userInfo.password);
  
      // Onboarding
      cy.getBySel("user-onboarding-dialog").should("be.visible");
      cy.getBySel("list-skeleton").should("not.exist");
      cy.getBySel("nav-top-notifications-count").should("exist");
      cy.visualSnapshot("User Onboarding Dialog");
      cy.getBySel("user-onboarding-next").click();
  
      cy.getBySel("user-onboarding-dialog-title").should("contain", "Create Bank Account");
  
      cy.getBySelLike("bankName-input").type("The Best Bank");
      cy.getBySelLike("accountNumber-input").type("123456789");
      cy.getBySelLike("routingNumber-input").type("987654321");
      cy.visualSnapshot("About to complete User Onboarding");
      cy.getBySelLike("submit").click();
  
      cy.wait("@gqlCreateBankAccountMutation");
  
      cy.getBySel("user-onboarding-dialog-title").should("contain", "Finished");
      cy.getBySel("user-onboarding-dialog-content").should("contain", "You're all set!");
      cy.visualSnapshot("Finished User Onboarding");
      cy.getBySel("user-onboarding-next").click();
  
      cy.getBySel("transaction-list").should("be.visible");
      cy.visualSnapshot("Transaction List is visible after User Onboarding");
  
      // Logout User
      if (isMobile()) {
        cy.getBySel("sidenav-toggle").click();
      }
      cy.getBySel("sidenav-signout").click();
      cy.location("pathname").should("eq", "/signin");
      cy.visualSnapshot("Redirect to SignIn");
    });
    */

  test("should display login errors", async ({ signInPage }) => {
    const errorMessages = wordings.errormessages;
    await signInPage.open();
    await signInPage.usernameValidation();
    expect(await signInPage.getUsernameValidationMessage()).toBe(errorMessages.usernameEmpty);
    await expect(signInPage.page).toHaveScreenshot("Display Username is Required Error.png");

    await signInPage.passwordValidation("abc");
    expect(await signInPage.getPasswordValidationMessage()).toBe(errorMessages.shortPassword);
    await expect(signInPage.page).toHaveScreenshot("Display Password Error.png");

    await expect(signInPage.submitButton).toBeDisabled();
    await expect(signInPage.page).toHaveScreenshot("Sign In Submit Disabled.png");
  });
  /*
    it("should display login errors", function () {
      cy.visit("/");
  
      cy.getBySel("signin-username").type("User");
      cy.getBySel("signin-username").find("input").clear();
      cy.getBySel("signin-username").find("input").blur();
      cy.get("#username-helper-text").should("be.visible").and("contain", "Username is required");
      cy.visualSnapshot("Display Username is Required Error");
  
      cy.getBySel("signin-password").type("abc");
      cy.getBySel("signin-password").find("input").blur();
      cy.get("#password-helper-text")
        .should("be.visible")
        .and("contain", "Password must contain at least 4 characters");
      cy.visualSnapshot("Display Password Error");
  
      cy.getBySel("signin-submit").should("be.disabled");
      cy.visualSnapshot("Sign In Submit Disabled");
    });
    */

  test("should display signup errors", async ({ signUpPage }) => {
    const errorMessages = wordings.errormessages;
    await signUpPage.open();
    await signUpPage.validationMessageFirstName();
    expect(await signUpPage.getFirstNameValidationMessage()).toBe(errorMessages.firstNameEmpty);
    await signUpPage.validationMessageLastName();
    expect(await signUpPage.getLastNameValidationMessage()).toBe(errorMessages.lastNameEmpty);
    await signUpPage.validationMessageUsername();
    expect(await signUpPage.getUsernameValidationMessage()).toBe(errorMessages.usernameEmpty);
    await signUpPage.validationMessagePassword();
    expect(await signUpPage.getPasswordValidationMessage()).toBe(errorMessages.passwordEmpty);
    await signUpPage.validationMessageConfirmPassword("DIFFERENT PASSWORD");
    expect(await signUpPage.getConfirmPasswordValidationMessage()).toBe(errorMessages.confirmPasswordInvalid);
    await expect(signUpPage.submitButton).toBeDisabled();
    await expect(signUpPage.page).toHaveScreenshot("Display Sign Up Required Errors.png");
  });
  /*
  it("should display signup errors", function () {
    cy.intercept("GET", "/signup");

    cy.visit("/signup");

    cy.getBySel("signup-first-name").type("First");
    cy.getBySel("signup-first-name").find("input").clear();
    cy.getBySel("signup-first-name").find("input").blur();
    cy.get("#firstName-helper-text").should("be.visible").and("contain", "First Name is required");

    cy.getBySel("signup-last-name").type("Last");
    cy.getBySel("signup-last-name").find("input").clear();
    cy.getBySel("signup-last-name").find("input").blur();
    cy.get("#lastName-helper-text").should("be.visible").and("contain", "Last Name is required");

    cy.getBySel("signup-username").type("User");
    cy.getBySel("signup-username").find("input").clear();
    cy.getBySel("signup-username").find("input").blur();
    cy.get("#username-helper-text").should("be.visible").and("contain", "Username is required");

    cy.getBySel("signup-password").type("password");
    cy.getBySel("signup-password").find("input").clear();
    cy.getBySel("signup-password").find("input").blur();
    cy.get("#password-helper-text").should("be.visible").and("contain", "Enter your password");

    cy.getBySel("signup-confirmPassword").type("DIFFERENT PASSWORD");
    cy.getBySel("signup-confirmPassword").find("input").blur();
    cy.get("#confirmPassword-helper-text")
      .should("be.visible")
      .and("contain", "Password does not match");
    cy.visualSnapshot("Display Sign Up Required Errors");

    cy.getBySel("signup-submit").should("be.disabled");
    cy.visualSnapshot("Sign Up Submit Disabled");
  });
  */

  test("should error for an invalid user", async ({ signInPage }) => {
    const status = await signInPage.login("invalidUserName", { password: "invalidPa$$word" });
    const errorMessages = wordings.errormessages;
    expect(status).toBe(401);
    expect(await signInPage.signInErrorMessage()).toBe(errorMessages.invalidCredentials);
    await expect(signInPage.page).toHaveScreenshot("Sign In, Invalid Username and Password, Username or Password is Invalid.png");
  });
  /*
  it("should error for an invalid user", function () {
    cy.login("invalidUserName", "invalidPa$$word");

    cy.getBySel("signin-error")
      .should("be.visible")
      .and("have.text", "Username or password is invalid");
    cy.visualSnapshot("Sign In, Invalid Username and Password, Username or Password is Invalid");
  });
  */

  test("should error for an invalid password for existing user", async ({ signInPage }) => {
    const user = userTestData.user1;
    const status = await signInPage.login(user.username, { password: "INVALID" });
    const errorMessages = wordings.errormessages;
    expect(status).toBe(401);
    expect(await signInPage.signInErrorMessage()).toBe(errorMessages.invalidCredentials);
    await expect(signInPage.page).toHaveScreenshot("Sign In, Invalid Username, Username or Password is Invalid.png");
  });
  /*
  it("should error for an invalid password for existing user", function () {
    cy.database("find", "users").then((user: User) => {
      cy.login(user.username, "INVALID");
    });

    cy.getBySel("signin-error")
      .should("be.visible")
      .and("have.text", "Username or password is invalid");
    cy.visualSnapshot("Sign In, Invalid Username, Username or Password is Invalid");
  });
  */

});



