import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Page from './+page.svelte';

describe('Page Component', () => {
	it('renders the header with the Superapp title and logo', () => {
		render(Page);

		// Check that the Superapp title is present
		expect(screen.getByText('Superapp')).toBeInTheDocument();
	});

	it('renders the hero section with heading and call-to-action buttons', () => {
		render(Page);

		// Check for the main heading
		expect(
			screen.getByRole('heading', { name: /Build fast, Build beautiful, Build anything/i })
		).toBeInTheDocument();

		// Check for description text
		expect(
			screen.getByText(/The time from idea to proof of concept is shorter than ever/i)
		).toBeInTheDocument();
	});

	it('renders all feature sections with correct titles and descriptions', () => {
		render(Page);

		// Feature titles
		expect(screen.getByText('Inspiring and Fast')).toBeInTheDocument();
		expect(screen.getByText('Users and roles management')).toBeInTheDocument();
		expect(screen.getByText('Security')).toBeInTheDocument();
		expect(screen.getByText('Privacy and Analytics')).toBeInTheDocument();

		// Feature descriptions
		expect(
			screen.getByText(/Superapp is build on Sveltekit, TailwindCSS and MongoDb/i)
		).toBeInTheDocument();
		expect(screen.getByText(/Users can be added, roles can be assigned/i)).toBeInTheDocument();
		expect(screen.getByText(/AuthJS is used for authentication/i)).toBeInTheDocument();
		expect(
			screen.getByText(/We only use the highest privacy respecting analytics tools/i)
		).toBeInTheDocument();
	});

	it('renders the footer with copyright text', () => {
		render(Page);

		// Check if footer contains the copyright text
		expect(screen.getByText(/© 2025 Albert Sikkema/i)).toBeInTheDocument();
	});
});
