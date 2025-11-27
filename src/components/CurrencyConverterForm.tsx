import { useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Skeleton } from '@mui/material';
import type { CnbRate } from '../types/cnb';
import type { CurrencyOption } from '../types/currency';
import { formatNumberCZ } from '../utils/format.helpers';
import { useCurrencyConverterForm } from './useCurrencyConverterForm';
import {
	FormPaper,
	FormBox,
	AmountTextField,
	CurrencyAutocomplete,
	TextLabel,
	SkeletonBox,
} from './CurrencyConverterForm.styled';

type CurrencyConverterFormData = {
	amount: string;
	selectedCurrency: CurrencyOption | null;
};

type CurrencyConverterFormProps = {
	currencies: CnbRate[];
	isLoading?: boolean;
};

export const CurrencyConverterForm: React.FC<CurrencyConverterFormProps> = ({
	currencies,
	isLoading = false,
}) => {
	const {
		currencyOptions,
		defaultCurrency,
		getOptionLabel,
		isOptionEqualToValue,
		filterCurrencyOptions,
		renderInput,
	} = useCurrencyConverterForm(currencies);

	const { control, watch } = useForm<CurrencyConverterFormData>({
		defaultValues: {
			amount: '',
			selectedCurrency: defaultCurrency,
		},
		values: {
			amount: '',
			selectedCurrency: defaultCurrency,
		},
	});

	const amount = watch('amount');
	const selectedCurrency = watch('selectedCurrency');

	const renderCurrencyAutocomplete = useCallback(
		({
			field: { onChange, value },
		}: {
			field: {
				onChange: (value: CurrencyOption | null) => void;
				value: CurrencyOption | null;
			};
		}) => (
			<CurrencyAutocomplete
				options={currencyOptions}
				getOptionLabel={getOptionLabel}
				value={value}
				onChange={(_event: React.SyntheticEvent, newValue: CurrencyOption | null) =>
					onChange(newValue)
				}
				renderInput={renderInput}
				isOptionEqualToValue={isOptionEqualToValue}
				filterOptions={filterCurrencyOptions}
				autoHighlight
			/>
		),
		[currencyOptions, getOptionLabel, renderInput, isOptionEqualToValue, filterCurrencyOptions]
	);

	const convertedAmount = useMemo(() => {
		if (!amount || !selectedCurrency) return null;

		// for more comlex validation i would use YUP/ZOD validation schema
		const amountNum = Number.parseFloat(amount);
		if (Number.isNaN(amountNum) || amountNum <= 0) return null;

		const currency = currencies.find((c) => c.code === selectedCurrency.code);
		if (!currency) return null;

		// CZK to foreign currency: CZK amount / normalizedRate
		const result = amountNum / currency.normalizedRate;

		// Format number with proper locale formatting
		return formatNumberCZ(result);
	}, [amount, selectedCurrency, currencies]);

	if (isLoading) {
		return (
			<FormPaper>
				<SkeletonBox>
					<Skeleton variant="rectangular" width={150} height={56} />
					<Skeleton variant="text" width={60} />
					<Skeleton variant="rectangular" width={250} height={56} />
					<Skeleton variant="text" width={200} />
				</SkeletonBox>
			</FormPaper>
		);
	}

	return (
		<FormPaper>
			<FormBox>
				<Controller
					name="amount"
					control={control}
					render={({ field }) => (
						<AmountTextField {...field} label="Amount" type="number" variant="outlined" autoFocus />
					)}
				/>
				<TextLabel>CZK TO</TextLabel>
				<Controller name="selectedCurrency" control={control} render={renderCurrencyAutocomplete} />
				<TextLabel>
					={' '}
					{convertedAmount !== null
						? `${convertedAmount} ${selectedCurrency?.code || ''}`
						: 'Please enter amount and select currency'}
				</TextLabel>
			</FormBox>
		</FormPaper>
	);
};
