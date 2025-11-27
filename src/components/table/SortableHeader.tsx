import { TableSortLabel, Box } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { Th } from '../RatesTable.styled';
import { type Order, type OrderBy } from './table.helpers';

type SortableHeaderProps = {
	property: OrderBy;
	label: string;
	order: Order;
	orderBy: OrderBy;
	align?: 'left' | 'right';
	onSort: (property: OrderBy) => void;
};

export const SortableHeader: React.FC<SortableHeaderProps> = ({
	property,
	label,
	order,
	orderBy,
	align,
	onSort,
}) => {
	const isActive = orderBy === property;

	return (
		<Th $align={align}>
			<TableSortLabel
				active={isActive}
				direction={isActive ? order : 'asc'}
				onClick={() => onSort(property)}
			>
				{label}
				{isActive ? (
					<Box component="span" sx={visuallyHidden}>
						{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
					</Box>
				) : null}
			</TableSortLabel>
		</Th>
	);
};
