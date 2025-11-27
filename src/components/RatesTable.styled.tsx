import { Paper } from '@mui/material';
import styled from 'styled-components';

export const StyledPaper = styled(Paper)`
	padding: 16px;
	margin-top: 24px;
	overflow-x: auto;
`;

export const Table = styled.table`
	width: 100%;
	border-collapse: collapse;
`;

export const Thead = styled.thead`
	background-color: ${({ theme }) => theme.palette.grey[100]};
`;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
	&:hover {
		background-color: ${({ theme }) => theme.palette.action.hover};
	}

	&:not(:last-child) {
		border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
	}
`;

export const Th = styled.th<{ $align?: 'left' | 'right' | 'center' }>`
	padding: 12px 16px;
	text-align: ${({ $align }) => $align || 'left'};
	font-weight: 600;
	color: ${({ theme }) => theme.palette.text.primary};
	font-size: 0.875rem;
`;

export const Td = styled.td<{ $align?: 'left' | 'right' | 'center' }>`
	padding: 12px 16px;
	text-align: ${({ $align }) => $align || 'left'};
	color: ${({ theme }) => theme.palette.text.secondary};
	font-size: 0.875rem;
`;

export const LoadingContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 200px;
`;
