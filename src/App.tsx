import { useCnbRates } from './query-hooks';
import { AppWrapper } from './App.styled';
import { CircularProgress, Alert, Typography, Box } from '@mui/material';
import { env } from './env';

export const App: React.FC = () => {
	const { data, isLoading, error } = useCnbRates();

	if (isLoading) {
		return (
			<AppWrapper>
				<Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
					<CircularProgress />
				</Box>
			</AppWrapper>
		);
	}

	if (error) {
		return (
			<AppWrapper>
				<Alert severity="error">Chyba při načítání kurzů: {error.message}</Alert>
			</AppWrapper>
		);
	}

	if (!data) {
		return null;
	}

	return (
		<AppWrapper>
			{env.FE_CNB_API_URL}
			<Typography variant="h4" component="h1" gutterBottom>
				CNB Rates Calculator
			</Typography>

			<Typography variant="subtitle1" gutterBottom>
				{data.date} #{data.serialNumber}
			</Typography>

			<Box component="table" sx={{ borderCollapse: 'collapse', width: '100%', mt: 2 }}>
				<thead>
					<tr>
						<th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #ddd' }}>
							Country
						</th>
						<th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #ddd' }}>
							Currency
						</th>
						<th style={{ textAlign: 'right', padding: '8px', borderBottom: '2px solid #ddd' }}>
							Amount
						</th>
						<th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #ddd' }}>
							Code
						</th>
						<th style={{ textAlign: 'right', padding: '8px', borderBottom: '2px solid #ddd' }}>
							Rate
						</th>
					</tr>
				</thead>
				<tbody>
					{data.rates.map((rate) => (
						<tr key={rate.code}>
							<td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{rate.country}</td>
							<td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{rate.currency}</td>
							<td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'right' }}>
								{rate.amount}
							</td>
							<td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{rate.code}</td>
							<td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'right' }}>
								{rate.normalizedRate}
							</td>
						</tr>
					))}
				</tbody>
			</Box>
		</AppWrapper>
	);
};
