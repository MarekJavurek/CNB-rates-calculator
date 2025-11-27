import styled from 'styled-components';
import { Box, Paper, TextField, Autocomplete } from '@mui/material';

export const FormPaper = styled(Paper)`
	padding: ${({ theme }) => theme.spacing(3)};
	margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

export const FormBox = styled(Box)`
	display: flex;
	gap: ${({ theme }) => theme.spacing(2)};
	flex-wrap: wrap;
	align-items: center;
`;

export const TextLabel = styled.span`
	font-size: 1.3rem;
	font-weight: 500;
	color: ${({ theme }) => theme.palette.text.secondary};
`;

export const AmountTextField = styled(TextField)`
	width: 100%;
	min-width: 0;

	${({ theme }) => theme.breakpoints.up('sm')} {
		width: auto;
		min-width: 150px;
		max-width: 200px;
		flex: 1;
	}
`;

export const CurrencyAutocomplete = styled(Autocomplete)`
	width: 100%;
	min-width: 0;

	${({ theme }) => theme.breakpoints.up('sm')} {
		width: auto;
		min-width: 200px;
		max-width: 300px;
		flex: 1;
	}
` as typeof Autocomplete; // type assertion to preserve Autocomplete types

export const SkeletonBox = styled(Box)`
	display: flex;
	gap: ${({ theme }) => theme.spacing(2)};
	align-items: center;
`;
