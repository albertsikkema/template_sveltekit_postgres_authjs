import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Page from './+page.svelte';

describe('Page component', () => {
	it('renders the header "Dashboard"', () => {
		render(Page);
		expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
	});
});
