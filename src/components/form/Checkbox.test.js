import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Checkbox from './Checkbox.svelte';

describe('Checkbox Component', () => {
	it('renders with the correct label and default checked value', async () => {
		render(Checkbox, { props: { inputKey: 'TestKey' } });

		// Verify label is shown correctly
		await expect(screen.getByText('TestKey')).toBeInTheDocument();

		// Verify checkbox attributes
		const checkbox = screen.getByRole('checkbox');
		expect(checkbox).toHaveAttribute('name', 'testkey'); // `inputKey.toLowerCase()`
		expect(checkbox).toBeChecked(); // Default checked value (`true`)
	});

	it('toggles the checked value when clicked', async () => {
		render(Checkbox, { props: { inputKey: 'TestKey' } });

		const checkbox = screen.getByRole('checkbox');

		// Default state should be checked
		expect(checkbox).toBeChecked();

		// Click the checkbox (uncheck)
		await fireEvent.click(checkbox);
		expect(checkbox).not.toBeChecked();

		// Click again (check)
		await fireEvent.click(checkbox);
		expect(checkbox).toBeChecked();
	});

	it('renders fallback label when inputKey is not provided', () => {
		render(Checkbox); // No props, defaults should be used

		// Default label should be shown
		expect(screen.getByText('Active')).toBeInTheDocument();

		// Default checkbox name should be `active` (from `inputKey.toLowerCase()`)
		const checkbox = screen.getByRole('checkbox');
		expect(checkbox).toHaveAttribute('name', 'active');
	});
});
