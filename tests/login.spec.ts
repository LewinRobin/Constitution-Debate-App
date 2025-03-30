import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config({ path: './test.env' });


test.describe('Login Page', () => {
	test('should log in successfully and navigate to the dashboard', async ({ page }) => {
		// Go to the login page
		await page.goto(`${process.env.URL}/login`); // Change URL if different

		// Fill in the email and password
		await page.fill('#email', String(process.env.EMAIL));
		await page.fill('#password', String(process.env.PASSWORD));

		// Click the login button
		await page.click('button[type="submit"]');

		// Wait for navigation to the dashboard
		await page.waitForURL(`${process.env.URL}/dashboard`);

		// Assert that the dashboard is displayed
		await expect(page).toHaveURL(`${process.env.URL}/dashboard`);
	});

	test('test invalid email and password', async ({ page }) => {
		await page.goto(`${process.env.URL}/login`);

		await page.fill('#email', String(process.env.WRONG_EMAIL));
		await page.fill('#password', String(process.env.WRONG_PASSWORD));

		await page.click('button[type="submit"]');

		// Check for error message
		await expect(page.locator('.text-red-500')).toBeVisible();
	});

	test('should allow demo login', async ({ page }) => {
		await page.goto(`${process.env.URL}/login`);

		await page.click('button:has-text("Demo Login")');

		await page.waitForURL(`${process.env.URL}/dashboard`);

		await expect(page).toHaveURL(`${process.env.URL}/dashboard`);
	});
	test('log in with admin password, access create article ', async ({ page }) => {
		// Go to the login page
		await page.goto(`${process.env.URL}/login`); // Change URL if different

		// Fill in the email and password
		await page.fill('#email', String(process.env.ADMIN_EMAIL));
		await page.fill('#password', String(process.env.ADMIN_PASSWORD));

		// Click the login button
		await page.click('button[type="submit"]');

		// Wait for navigation to the dashboard
		await page.waitForURL(`${process.env.URL}/dashboard`);

		// Assert that the dashboard is displayed
		await expect(page).toHaveURL(`${process.env.URL}/dashboard`);


		await page.click('a:text("Create Article")');
		await page.waitForURL(`${process.env.URL}/creation`);

		// Assert that the dashboard is displayed

	});
	test('test dashboard opinions', async ({ page }) => {
		await page.goto('http://localhost:8080/login');
		await page.getByRole('textbox', { name: 'Email' }).click();
		await page.getByRole('textbox', { name: 'Email' }).fill(String(process.env.EMAIL));
		await page.getByRole('textbox', { name: 'Password' }).click();
		await page.getByRole('textbox', { name: 'Password' }).fill(String(process.env.PASSWORD));
		await page.locator('form').getByRole('button', { name: 'Login', exact: true }).click();
		await page.getByRole('button', { name: 'Logout' }).click();
		await page.getByRole('textbox', { name: 'Email' }).click();
		await page.getByRole('textbox', { name: 'Email' }).fill(String(process.env.EMAIL));
		await page.getByRole('textbox', { name: 'Email' }).press('Tab');
		await page.getByRole('textbox', { name: 'Password' }).fill(String(process.env.PASSWORD));
		await page.locator('form').getByRole('button', { name: 'Login', exact: true }).click();
		await page.locator('.mb-8 > .space-y-4').click();
	});
	test('test opinions', async ({ page }) => {
		await page.goto('http://localhost:8080/login');
		await page.getByRole('textbox', { name: 'Email' }).click();
		await page.getByRole('textbox', { name: 'Email' }).fill(String(process.env.EMAIL));
		await page.getByRole('textbox', { name: 'Email' }).press('Tab');
		await page.getByRole('textbox', { name: 'Password' }).fill(String(process.env.PASSWORD));
		await page.getByRole('textbox', { name: 'Password' }).press('Tab');
		await page.locator('form').getByRole('button', { name: 'Login', exact: true }).click();
		await page.getByRole('button', { name: 'Logout' }).click();
		await page.getByRole('textbox', { name: 'Email' }).click();
		await page.getByRole('textbox', { name: 'Email' }).fill(String(process.env.EMAIL));
		await page.getByRole('textbox', { name: 'Email' }).press('Tab');
		await page.getByRole('textbox', { name: 'Password' }).fill(String(process.env.PASSWORD));
		await page.locator('form').getByRole('button', { name: 'Login', exact: true }).click();
		await page.getByText('hi', { exact: true }).click();
		await page.getByText('hi', { exact: true }).click();
	});

});
