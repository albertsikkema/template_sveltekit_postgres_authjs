import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Checkbox from './Checkbox.svelte';

if (globalThis.window) {
  console.log('Client-side test running (jsdom)');
} else {
  console.log('Server-side test running (Node.js)');
}
describe('Checkbox Component', () => {
  it('renders with the correct label and default checked value', async () => {
    render(Checkbox, { props: { inputKey: 'TestKey' } });
    await expect(screen.getByText('TestKey')).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('name', 'testkey');
    expect(checkbox).toBeChecked();
    expect(screen.getByText('Checked value: true')).toBeInTheDocument();
  });

  it('toggles the checked value when clicked', async () => {
    render(Checkbox, { props: { inputKey: 'TestKey' } });
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    expect(screen.getByText('Checked value: true')).toBeInTheDocument();
    await fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(screen.getByText('Checked value: false')).toBeInTheDocument();

    await fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(screen.getByText('Checked value: true')).toBeInTheDocument();

  });
  it('renders fallback label when inputKey is not provided', () => {
    render(Checkbox);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });
}); 