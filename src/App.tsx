import { useMemo } from 'react';
import { useCnbRates } from './query-hooks';
import { AppWrapper, HeaderBox, StyledSkeleton } from './App.styled';
import { RatesTable } from './components/RatesTable';
import { CurrencyConverterForm } from './components/CurrencyConverterForm';
import { Alert, Typography, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

export const App: React.FC = () => {
	const {
		data: cnbRates,
		isLoading: isLoadingCnbRates,
		error: errorCnbRates,
		refetch,
	} = useCnbRates();

	const currencies = useMemo(() => cnbRates?.rates || [], [cnbRates?.rates]);

	if (errorCnbRates) {
		return (
			<AppWrapper>
				<Alert severity="error">Error loading rates: {errorCnbRates.message}</Alert>
			</AppWrapper>
		);
	}

	return (
		<AppWrapper>
			<HeaderBox>
				<Typography variant="h4" component="h1">
					CNB Rates Calculator
				</Typography>
				<Button
					variant="outlined"
					startIcon={<RefreshIcon />}
					onClick={() => refetch()}
					disabled={isLoadingCnbRates}
				>
					Refresh Rates
				</Button>
			</HeaderBox>
			{isLoadingCnbRates ? (
				<StyledSkeleton variant="text" width={200} />
			) : (
				cnbRates && (
					<Typography variant="subtitle1" gutterBottom>
						{cnbRates.date} #{cnbRates.serialNumber}
					</Typography>
				)
			)}
			<CurrencyConverterForm currencies={currencies} isLoading={isLoadingCnbRates} />{' '}
			<RatesTable rates={currencies} isLoading={isLoadingCnbRates} />
		</AppWrapper>
	);
};
