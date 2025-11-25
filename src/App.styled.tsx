import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

export const AppWrapper = styled(Paper)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	maxWidth: '1200px',
	margin: `${theme.spacing(4)} auto 0`,
	padding: theme.spacing(4),
	minHeight: '100vh',
	borderRadius: theme.spacing(2),
	boxShadow: theme.shadows[3],
}));
