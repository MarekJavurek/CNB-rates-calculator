import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

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

export const HeaderBox = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	gap: theme.spacing(2),
	alignItems: 'center',
	marginBottom: theme.spacing(2),
	[theme.breakpoints.up('sm')]: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
}));

export const StyledSkeleton = styled(Skeleton)(({ theme }) => ({
	marginBottom: theme.spacing(2),
}));
