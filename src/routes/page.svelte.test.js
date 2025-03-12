import Page from './+page.svelte';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest'; 

describe('Page', () => {
  it('renders the heading "Welcome to SvelteKit"', () => {
    render(Page);
    // Verify that the heading is rendered
    expect(
      screen.getByRole('heading', { name: /welcome to sveltekit/i })
    ).toBeInTheDocument();
  }); 

  it('renders the theme toggle with a sun icon', () => {
    render(Page);
    // There is one input with test-id "input" for our theme controller
    const themeInput = screen.getByTestId('input');
    expect(themeInput).toBeInTheDocument(); 
// Verify that the sun icon is rendered
const sunIcon = document.querySelector('svg.swap-off');
expect(sunIcon).toBeTruthy();

  }); 

  it('toggles the theme checkbox when the label is clicked', async () => {
    render(Page);
    // Get the hidden checkbox input with test-id "input"
    const themeInput = screen.getByTestId('input');
    expect(themeInput).toBeInTheDocument();
    // Initially, the checkbox should not be checked
    expect(themeInput).not.toBeChecked(); 
// Get the parent label that wraps the input (the clickable area)
const swapLabel = themeInput.closest('label');
if (!swapLabel) throw new Error('Swap label not found');

// Click the label to toggle the checkbox on
await fireEvent.click(swapLabel);
expect(themeInput).toBeChecked();

// Click again to toggle off
await fireEvent.click(swapLabel);
expect(themeInput).not.toBeChecked();
  });
}); 