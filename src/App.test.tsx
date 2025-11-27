import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { render, createTestQueryClient } from './test/test-utils';
import { App } from './App';
import { mockCnbResponseText } from './test/mock-data';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('App Integration Tests', () => {
	let queryClient: ReturnType<typeof createTestQueryClient>;

	beforeEach(() => {
		queryClient = createTestQueryClient();
		vi.clearAllMocks();
	});

	it('should load and display CNB rates on mount', async () => {
		mockedAxios.get.mockResolvedValueOnce({
			data: mockCnbResponseText,
		});

		render(<App />, { queryClient });

		// Should show loading state initially (implicitly through lack of content)
		expect(screen.queryByText(/Australia/i)).not.toBeInTheDocument();

		// Wait for data to load
		await waitFor(() => {
			expect(screen.getByText(/CNB Rates Calculator/i)).toBeInTheDocument();
			expect(screen.getByText(/27 Nov 2024/i)).toBeInTheDocument();
		});

		// Check serial number is displayed
		expect(screen.getByText(/#230/i)).toBeInTheDocument();

		// Check that currencies are displayed in the table
		await waitFor(() => {
			expect(screen.getByText(/EMU/i)).toBeInTheDocument();
			expect(screen.getByText(/Japan/i)).toBeInTheDocument();
		});
	});

	it('should display error message when API fails', async () => {
		mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

		render(<App />, { queryClient });

		await waitFor(() => {
			expect(screen.getByText(/Error loading rates:.*Network error/i)).toBeInTheDocument();
		});
	});

	it('should allow user to convert currency after data loads', async () => {
		mockedAxios.get.mockResolvedValueOnce({
			data: mockCnbResponseText,
		});

		const user = userEvent.setup();
		render(<App />, { queryClient });

		// Wait for data to load
		await waitFor(() => {
			expect(screen.getByText(/27 Nov 2024 #230/i)).toBeInTheDocument();
		});

		// Fill in the conversion form
		const amountInput = screen.getByLabelText(/amount/i);
		await user.type(amountInput, '100');

		const currencyInput = screen.getByLabelText(/currency or country/i);
		await user.click(currencyInput);

		await waitFor(() => {
			expect(screen.getByText(/EMU \(EUR\)/i)).toBeInTheDocument();
		});

		await user.click(screen.getByText(/EMU \(EUR\)/i));

		// Check that conversion result is displayed
		await waitFor(() => {
			expect(screen.getByText(/= 3,830[0-9]{2} EUR/i)).toBeInTheDocument();
		});
	});

	it('should show rates table with correct data', async () => {
		mockedAxios.get.mockResolvedValueOnce({
			data: mockCnbResponseText,
		});

		render(<App />, { queryClient });

		await waitFor(() => {
			expect(screen.getByText(/27 Nov 2024 #230/i)).toBeInTheDocument();
		});

		// Check specific rate values in the table
		await waitFor(() => {
			expect(screen.getByText('EUR')).toBeInTheDocument();
			expect(screen.getByText(/26[,.]105/)).toBeInTheDocument();
			expect(screen.getByText('JPY')).toBeInTheDocument();
			expect(screen.getByText(/0[,.]15644/)).toBeInTheDocument();
		});
	});

	it('should allow refreshing rates', async () => {
		// Initial load
		mockedAxios.get.mockResolvedValueOnce({
			data: mockCnbResponseText,
		});

		const user = userEvent.setup();
		render(<App />, { queryClient });

		await waitFor(() => {
			expect(screen.getByText(/27 Nov 2024 #230/i)).toBeInTheDocument();
		});

		// Mock second load with different data
		const updatedResponse = mockCnbResponseText.replace('27 Nov 2024 #230', '28 Nov 2024 #231');
		mockedAxios.get.mockResolvedValueOnce({
			data: updatedResponse,
		});

		// Click refresh button
		const refreshButton = screen.getByRole('button', { name: /refresh rates/i });
		await user.click(refreshButton);

		// Wait for updated data
		await waitFor(() => {
			expect(screen.getByText(/28 Nov 2024 #231/i)).toBeInTheDocument();
		});

		// Verify axios was called twice
		expect(mockedAxios.get).toHaveBeenCalledTimes(2);
	});

	it('should complete full user workflow: load data -> select currency -> convert', async () => {
		mockedAxios.get.mockResolvedValueOnce({
			data: mockCnbResponseText,
		});

		const user = userEvent.setup();
		render(<App />, { queryClient });

		// Step 1: Wait for data to load
		await waitFor(() => {
			expect(screen.getByText(/CNB Rates Calculator/i)).toBeInTheDocument();
			expect(screen.getByText(/27 Nov 2024 #230/i)).toBeInTheDocument();
		});

		// Step 2: Verify rates table is populated
		await waitFor(() => {
			expect(screen.getByText('EMU')).toBeInTheDocument();
			expect(screen.getByText('Japan')).toBeInTheDocument();
		});

		// Step 3: Enter amount
		const amountInput = screen.getByLabelText(/amount/i);
		await user.type(amountInput, '1000');

		// Step 4: Select Euro
		const currencyInput = screen.getByLabelText(/currency or country/i);
		await user.click(currencyInput);

		await waitFor(() => {
			expect(screen.getByText(/EMU \(EUR\)/i)).toBeInTheDocument();
		});

		await user.click(screen.getByText(/EMU \(EUR\)/i));

		// Step 5: Verify conversion result (1000 CZK / 26.105 ≈ 38.3066 EUR)
		await waitFor(() => {
			expect(screen.getByText(/= 38,306[0-9]{2} EUR/i)).toBeInTheDocument();
		});

		// Step 6: Change currency to JPY
		await user.click(currencyInput);

		await waitFor(() => {
			expect(screen.getByText(/Japan \(JPY\)/i)).toBeInTheDocument();
		});

		await user.click(screen.getByText(/Japan \(JPY\)/i));

		// Step 7: Verify updated conversion (1000 CZK / 0.15644 ≈ 6392.227 JPY)
		await waitFor(() => {
			expect(screen.getByText(/= 6.?392,[0-9]+ JPY/i)).toBeInTheDocument();
		});
	});
	it('should handle API timeout gracefully', async () => {
		mockedAxios.get.mockRejectedValueOnce(new Error('Request timeout'));

		render(<App />, { queryClient });

		await waitFor(() => {
			expect(screen.getByText(/Error loading rates:.*Request timeout/i)).toBeInTheDocument();
		});
	});

	it('should display all form elements when loaded', async () => {
		mockedAxios.get.mockResolvedValueOnce({
			data: mockCnbResponseText,
		});

		render(<App />, { queryClient });

		await waitFor(() => {
			expect(screen.getByText(/27 Nov 2024 #230/i)).toBeInTheDocument();
		});

		// Check all major UI elements are present
		expect(screen.getByText(/CNB Rates Calculator/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /refresh rates/i })).toBeInTheDocument();
		expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/currency or country/i)).toBeInTheDocument();
		expect(screen.getByText(/czk to/i)).toBeInTheDocument();
	});
});
