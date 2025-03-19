import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import ErrorMessage from './ErrorMessage.svelte';

describe('ErrorMessage Component', () => {
	it('renders error messages when inputErrors is provided', () => {
		const inputErrors = {
			username: 'is required',
			password: 'must be at least 8 characters'
		};
		render(ErrorMessage, { props: { inputErrors } });
		// There should be one alert element wrapping all errors.
		const alert = screen.getByRole('alert');
		expect(alert).toBeInTheDocument();

		// Check if error messages are rendered with the first letter of the key capitalized.
		expect(screen.getByText('Username: is required')).toBeInTheDocument();
		expect(screen.getByText('Password: must be at least 8 characters')).toBeInTheDocument();
	});

	it('renders nothing when inputErrors is undefined', () => {
		render(ErrorMessage, { props: { inputErrors: undefined } });
		expect(screen.queryByRole('alert')).toBeNull();
	});
	it('renders nothing when inputErrors is an empty object', () => {
		render(ErrorMessage, { props: { inputErrors: {} } });
		expect(screen.queryByRole('alert')).toBeNull();
	});
});
