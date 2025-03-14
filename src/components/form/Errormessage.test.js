import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import ErrorMessage from './ErrorMessage.svelte'; // Ensure correct path

describe('ErrorMessage Component', () => {
	it('renders all error messages when formMessage.success is false', () => {
		const formMessage = { success: false, message: ['Error 1', 'Error 2'] };
		render(ErrorMessage, { props: { formMessage } });

		// Expect two alerts to be rendered (one for each message)
		const alerts = screen.getAllByRole('alert');
		expect(alerts.length).toBe(2);

		// Check if both messages are rendered
		expect(screen.getByText('Error 1')).toBeInTheDocument();
		expect(screen.getByText('Error 2')).toBeInTheDocument();
	});

	it('does not render anything when formMessage is undefined', () => {
		render(ErrorMessage, { props: { formMessage: undefined } });

		// No alerts should be present as formMessage is not defined
		expect(screen.queryByRole('alert')).toBeNull();
	});

	it('does not render anything when formMessage.success is true', () => {
		const formMessage = { success: true, message: ['Success message'] };
		render(ErrorMessage, { props: { formMessage } });

		// The alert should not exist in the DOM
		expect(screen.queryByRole('alert')).toBeNull();
	});

	it('renders nothing when formMessage.success is false but message array is empty', () => {
		const formMessage = { success: false, message: [] };
		render(ErrorMessage, { props: { formMessage } });

		// No alerts should be present when the message array is empty
		expect(screen.queryByRole('alert')).toBeNull();
	});
});
