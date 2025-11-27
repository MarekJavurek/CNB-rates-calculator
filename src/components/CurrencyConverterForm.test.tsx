import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test/test-utils';
import { CurrencyConverterForm } from './CurrencyConverterForm';
import { mockCnbRatesResponse } from '../test/mock-data';

const mockCurrencies = mockCnbRatesResponse.rates;

describe('CurrencyConverterForm', () => {
	it('should render form fields', () => {
		render(<CurrencyConverterForm currencies={mockCurrencies} />);

		expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/currency or country/i)).toBeInTheDocument();
		expect(screen.getByText(/czk to/i)).toBeInTheDocument();
	});

	it('should show prompt message when no input is provided', () => {
		render(<CurrencyConverterForm currencies={mockCurrencies} />);

		expect(screen.getByText(/please enter amount and select currency/i)).toBeInTheDocument();
	});

	it('should convert CZK to EUR correctly', async () => {
		const user = userEvent.setup();
		render(<CurrencyConverterForm currencies={mockCurrencies} />);

		const amountInput = screen.getByLabelText(/amount/i);
		const currencyInput = screen.getByLabelText(/currency or country/i);

		// Enter amount
		await user.type(amountInput, '100');

		// Select EUR currency
		await user.click(currencyInput);
		await waitFor(() => {
			expect(screen.getByText(/EMU \(EUR\)/i)).toBeInTheDocument();
		});
		await user.click(screen.getByText(/EMU \(EUR\)/i));

		// Check conversion: 100 CZK / 26.105 ≈ 3.8307
		await waitFor(() => {
			expect(screen.getByText(/= 3,830[0-9]{2} EUR/i)).toBeInTheDocument();
		});
	});

	it('should convert CZK to EUR with different amount', async () => {
		const user = userEvent.setup();
		render(<CurrencyConverterForm currencies={mockCurrencies} />);

		const amountInput = screen.getByLabelText(/amount/i);
		const currencyInput = screen.getByLabelText(/currency or country/i);

		await user.type(amountInput, '1000');

		await user.click(currencyInput);
		await waitFor(() => {
			expect(screen.getByText(/EMU \(EUR\)/i)).toBeInTheDocument();
		});
		await user.click(screen.getByText(/EMU \(EUR\)/i));

		// Check conversion: 1000 CZK / 26.105 ≈ 38.3066
		await waitFor(() => {
			expect(screen.getByText(/= 38,306[0-9]{2} EUR/i)).toBeInTheDocument();
		});
	});

	it('should handle currencies with amount > 1 (JPY)', async () => {
		const user = userEvent.setup();
		render(<CurrencyConverterForm currencies={mockCurrencies} />);

		const amountInput = screen.getByLabelText(/amount/i);
		const currencyInput = screen.getByLabelText(/currency or country/i);

		await user.type(amountInput, '100');

		await user.click(currencyInput);
		await waitFor(() => {
			expect(screen.getByText(/Japan \(JPY\)/i)).toBeInTheDocument();
		});
		await user.click(screen.getByText(/Japan \(JPY\)/i));

		// Check conversion: 100 CZK / 0.15644 ≈ 639.2227
		await waitFor(() => {
			expect(screen.getByText(/= 639,2[0-9]{4} JPY/i)).toBeInTheDocument();
		});
	});

	it('should update conversion in real-time when amount changes', async () => {
		const user = userEvent.setup();
		render(<CurrencyConverterForm currencies={mockCurrencies} />);

		const amountInput = screen.getByLabelText(/amount/i);
		const currencyInput = screen.getByLabelText(/currency or country/i);

		// First select currency
		await user.click(currencyInput);
		await waitFor(() => {
			expect(screen.getByText(/EMU \(EUR\)/i)).toBeInTheDocument();
		});
		await user.click(screen.getByText(/EMU \(EUR\)/i));

		// Enter first amount
		await user.type(amountInput, '100');
		await waitFor(() => {
			expect(screen.getByText(/= 3,830[0-9]{2} EUR/i)).toBeInTheDocument();
		});

		// Clear and enter new amount
		await user.clear(amountInput);
		await user.type(amountInput, '500');
		await waitFor(() => {
			expect(screen.getByText(/= 19,15[0-9]{3} EUR/i)).toBeInTheDocument();
		});
	});

	it('should update conversion in real-time when currency changes', async () => {
		const user = userEvent.setup();
		render(<CurrencyConverterForm currencies={mockCurrencies} />);

		const amountInput = screen.getByLabelText(/amount/i);
		const currencyInput = screen.getByLabelText(/currency or country/i);

		// Enter amount first
		await user.type(amountInput, '100');

		// Now select EUR
		await user.click(currencyInput);
		await waitFor(() => {
			expect(screen.getByText(/EMU \(EUR\)/i)).toBeInTheDocument();
		});
		await user.click(screen.getByText(/EMU \(EUR\)/i));

		await waitFor(() => {
			expect(screen.getByText(/= 3,830[0-9]{2} EUR/i)).toBeInTheDocument();
		});

		// Change to GBP
		await user.click(currencyInput);
		await waitFor(() => {
			expect(screen.getByText(/Japan \(JPY\)/i)).toBeInTheDocument();
		});
		await user.click(screen.getByText(/Japan \(JPY\)/i));

		await waitFor(() => {
			expect(screen.getByText(/= 639,2[0-9]{4} JPY/i)).toBeInTheDocument();
		});
	});

	it('should handle negative amounts', async () => {
		const user = userEvent.setup();
		render(<CurrencyConverterForm currencies={mockCurrencies} />);

		const amountInput = screen.getByLabelText(/amount/i);
		const currencyInput = screen.getByLabelText(/currency or country/i);

		await user.type(amountInput, '-100');

		await user.click(currencyInput);
		await waitFor(() => {
			expect(screen.getByText(/EMU \(EUR\)/i)).toBeInTheDocument();
		});
		await user.click(screen.getByText(/EMU \(EUR\)/i));

		// Should show prompt message for invalid amount
		expect(screen.getByText(/please enter amount and select currency/i)).toBeInTheDocument();
	});

	it('should handle zero amount', async () => {
		const user = userEvent.setup();
		render(<CurrencyConverterForm currencies={mockCurrencies} />);

		const amountInput = screen.getByLabelText(/amount/i);
		const currencyInput = screen.getByLabelText(/currency or country/i);

		await user.type(amountInput, '0');

		await user.click(currencyInput);
		await waitFor(() => {
			expect(screen.getByText(/EMU \(EUR\)/i)).toBeInTheDocument();
		});
		await user.click(screen.getByText(/EMU \(EUR\)/i));

		// Should show prompt message for invalid amount
		expect(screen.getByText(/please enter amount and select currency/i)).toBeInTheDocument();
	});

	it('should handle decimal amounts', async () => {
		const user = userEvent.setup();
		render(<CurrencyConverterForm currencies={mockCurrencies} />);

		const amountInput = screen.getByLabelText(/amount/i);
		const currencyInput = screen.getByLabelText(/currency or country/i);

		await user.type(amountInput, '50.50');

		await user.click(currencyInput);
		await waitFor(() => {
			expect(screen.getByText(/EMU \(EUR\)/i)).toBeInTheDocument();
		});
		await user.click(screen.getByText(/EMU \(EUR\)/i));

		// Check conversion: 50.5 CZK / 26.105 ≈ 1.9345
		await waitFor(() => {
			expect(screen.getByText(/= 1,9345 EUR/i)).toBeInTheDocument();
		});
	});

	it('should show prompt when currency is cleared', async () => {
		const user = userEvent.setup();
		render(<CurrencyConverterForm currencies={mockCurrencies} />);

		const amountInput = screen.getByLabelText(/amount/i);
		const currencyInput = screen.getByLabelText(/currency or country/i);

		// Enter amount and select currency
		await user.type(amountInput, '100');
		await user.click(currencyInput);
		await waitFor(() => {
			expect(screen.getByText(/EMU \(EUR\)/i)).toBeInTheDocument();
		});
		await user.click(screen.getByText(/EMU \(EUR\)/i));

		// Wait for conversion to appear
		await waitFor(() => {
			expect(screen.getByText(/= 3,830[0-9]{2} EUR/i)).toBeInTheDocument();
		});

		// Clear currency selection
		const clearButton = screen.getByTitle(/clear/i);
		await user.click(clearButton);

		// Should show prompt message
		await waitFor(() => {
			expect(screen.getByText(/please enter amount and select currency/i)).toBeInTheDocument();
		});
	});

	it('should filter currencies by country name', async () => {
		const user = userEvent.setup();
		render(<CurrencyConverterForm currencies={mockCurrencies} />);

		const currencyInput = screen.getByLabelText(/currency or country/i);

		await user.click(currencyInput);
		await user.type(currencyInput, 'Japan');

		await waitFor(() => {
			expect(screen.getByText(/Japan \(JPY\)/i)).toBeInTheDocument();
			expect(screen.queryByText(/EMU \(EUR\)/i)).not.toBeInTheDocument();
		});
	});

	it('should filter currencies by currency code', async () => {
		const user = userEvent.setup();
		render(<CurrencyConverterForm currencies={mockCurrencies} />);

		const currencyInput = screen.getByLabelText(/currency or country/i);

		await user.click(currencyInput);
		await user.type(currencyInput, 'JPY');

		await waitFor(() => {
			expect(screen.getByText(/Japan \(JPY\)/i)).toBeInTheDocument();
			expect(screen.queryByText(/EMU \(EUR\)/i)).not.toBeInTheDocument();
		});
	});

	it('should render with empty currencies array', () => {
		render(<CurrencyConverterForm currencies={[]} />);

		expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/currency or country/i)).toBeInTheDocument();
	});

	it('should display result with 4 decimal places', async () => {
		const user = userEvent.setup();
		render(<CurrencyConverterForm currencies={mockCurrencies} />);

		const amountInput = screen.getByLabelText(/amount/i);
		const currencyInput = screen.getByLabelText(/currency or country/i);

		await user.type(amountInput, '123.45');

		await user.click(currencyInput);
		await waitFor(() => {
			expect(screen.getByText(/EMU \(EUR\)/i)).toBeInTheDocument();
		});
		await user.click(screen.getByText(/EMU \(EUR\)/i));

		// Result should have 2-5 decimal places (trailing zeros are omitted)
		await waitFor(() => {
			const resultText = screen.getByText(/= \d+,\d{2,5} EUR/i);
			expect(resultText).toBeInTheDocument();
		});
	});
});
