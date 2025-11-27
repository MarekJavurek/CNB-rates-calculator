import { useState, useMemo, useCallback } from 'react';
import { CircularProgress } from '@mui/material';
import type { CnbRate } from '../types/cnb';
import { formatNumberCZ } from '../utils/format.helpers';
import { StyledPaper, Table, Thead, Tbody, Tr, Td, LoadingContainer } from './RatesTable.styled';
import { SortableHeader } from './table/SortableHeader';
import { type Order, type OrderBy, getComparator } from './table/table.helpers';

type RatesTableProps = {
	rates: CnbRate[];
	isLoading?: boolean;
};

export const RatesTable: React.FC<RatesTableProps> = ({ rates, isLoading = false }) => {
	const [order, setOrder] = useState<Order>('asc');
	const [orderBy, setOrderBy] = useState<OrderBy>('country');

	const handleRequestSort = useCallback(
		(property: OrderBy) => {
			setOrder((prevOrder) => {
				setOrderBy(property);
				return orderBy === property && prevOrder === 'asc' ? 'desc' : 'asc';
			});
		},
		[orderBy]
	);

	const sortedRates = useMemo(
		() => [...rates].sort(getComparator(order, orderBy)),
		[rates, order, orderBy]
	);

	if (isLoading) {
		return (
			<StyledPaper>
				<LoadingContainer>
					<CircularProgress />
				</LoadingContainer>
			</StyledPaper>
		);
	}

	return (
		<StyledPaper>
			<Table>
				<Thead>
					<Tr>
						<SortableHeader
							property="country"
							label="Country"
							order={order}
							orderBy={orderBy}
							onSort={handleRequestSort}
						/>
						<SortableHeader
							property="currency"
							label="Currency"
							order={order}
							orderBy={orderBy}
							onSort={handleRequestSort}
						/>
						<SortableHeader
							property="code"
							label="Code"
							order={order}
							orderBy={orderBy}
							onSort={handleRequestSort}
						/>
						<SortableHeader
							property="normalizedRate"
							label="Rate normalized"
							order={order}
							orderBy={orderBy}
							align="right"
							onSort={handleRequestSort}
						/>
					</Tr>
				</Thead>
				<Tbody>
					{sortedRates.map((rate) => (
						<Tr key={rate.code}>
							<Td>{rate.country}</Td>
							<Td>{rate.currency}</Td>
							<Td>{rate.code}</Td>
							<Td $align="right">{formatNumberCZ(rate.normalizedRate)}</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</StyledPaper>
	);
};
