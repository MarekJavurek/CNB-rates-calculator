import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { theme } from '../theme';
import type { ReactElement, ReactNode } from 'react';

/**
 * Creates a new QueryClient for testing with default options
 */
export function createTestQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: false, // disable retries in tests
				gcTime: Infinity, // prevent garbage collection during tests
			},
		},
	});
}

type AllTheProvidersProps = {
	children: ReactNode;
	queryClient?: QueryClient;
};

/**
 * Wrapper component that provides all necessary context providers for testing
 */
function AllTheProviders({ children, queryClient }: AllTheProvidersProps) {
	const client = queryClient || createTestQueryClient();

	return (
		<QueryClientProvider client={client}>
			<ThemeProvider theme={theme}>
				<StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

/**
 * Custom render function that wraps components with necessary providers
 */
export function renderWithProviders(
	ui: ReactElement,
	{ queryClient, ...renderOptions }: RenderOptions & { queryClient?: QueryClient } = {}
) {
	return {
		...render(ui, {
			wrapper: ({ children }) => (
				<AllTheProviders queryClient={queryClient}>{children}</AllTheProviders>
			),
			...renderOptions,
		}),
		queryClient: queryClient || createTestQueryClient(),
	};
}

// Re-export everything from testing library
export * from '@testing-library/react';
export { renderWithProviders as render };
