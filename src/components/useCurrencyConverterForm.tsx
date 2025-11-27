import { useMemo, useCallback } from 'react';
import { TextField } from '@mui/material';
import type { CnbRate } from '../types/cnb';
import type { CurrencyOption } from '../types/currency';

export const useCurrencyConverterForm = (currencies: CnbRate[]) => {
	const currencyOptions = useMemo<CurrencyOption[]>(
		() =>
			currencies.map((currency) => ({
				country: currency.country,
				code: currency.code,
				currency: currency.currency,
			})),
		[currencies]
	);

	const defaultCurrency = useMemo<CurrencyOption | null>(
		() => currencyOptions.find((c) => c.code === 'USD') || null,
		[currencyOptions]
	);

	const getOptionLabel = useCallback(
		(option: CurrencyOption) => `${option.country} (${option.code})`,
		[]
	);

	const isOptionEqualToValue = useCallback(
		(option: CurrencyOption, value: CurrencyOption) => option.code === value.code,
		[]
	);

	const filterCurrencyOptions = useCallback(
		(options: CurrencyOption[], { inputValue }: { inputValue: string }) => {
			const searchTerm = inputValue.toLowerCase();
			return options.filter(
				(option) =>
					option.country.toLowerCase().includes(searchTerm) ||
					option.code.toLowerCase().includes(searchTerm) ||
					option.currency.toLowerCase().includes(searchTerm)
			);
		},
		[]
	);

	const renderInput = useCallback(
		(params: React.ComponentProps<typeof TextField>) => (
			<TextField {...params} label="Currency or Country" variant="outlined" />
		),
		[]
	);

	return {
		currencyOptions,
		defaultCurrency,
		getOptionLabel,
		isOptionEqualToValue,
		filterCurrencyOptions,
		renderInput,
	};
};
