import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Skeleton } from '@mui/material';
import type { CnbRate } from '../types/cnb';
import { formatNumberCZ } from '../utils/format.helpers';
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
	selectedCurrency: { country: string; code: string } | null;
};

type CurrencyConverterFormProps = {
	currencies: CnbRate[];
	isLoading?: boolean;
};

export const CurrencyConverterForm: React.FC<CurrencyConverterFormProps> = ({
	currencies,
	isLoading = false,
}) => {
	const currencyOptions = useMemo(
		() =>
			currencies.map((currency) => ({
				country: currency.country,
				code: currency.code,
			})),
		[currencies]
	);

	const defaultCurrency = useMemo(
		() => currencyOptions.find((c) => c.code === 'USD') || null,
		[currencyOptions]
	);

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
				<Controller
					name="selectedCurrency"
					control={control}
					render={({ field: { onChange, value } }) => (
						<CurrencyAutocomplete
							options={currencyOptions}
							getOptionLabel={(option) => `${option.country} (${option.code})`}
							value={value}
							onChange={(_, newValue) => onChange(newValue)}
							renderInput={(params) => (
								<TextField {...params} label="Currency or Country" variant="outlined" />
							)}
							isOptionEqualToValue={(option, value) => option.code === value.code}
						/>
					)}
				/>
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
