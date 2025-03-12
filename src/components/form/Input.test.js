import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import InputField from './Input.svelte'; // Ensure correct import path

describe('InputField Component', () => {
  
  it('renders the input with correct attributes', () => {
    const props = {
      inputKey: 'Username',
      inputValue: '',
      maxLength: 10,
      minLength: 3,
      inputType: 'text',
      requiredInput: true,
      disabled: false
    };
    render(InputField, { props });

    // Check label text
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('(required)')).toBeInTheDocument();

    // Check length counter
    expect(screen.getByText('0/10')).toBeInTheDocument();

    // Get input field
    const input = screen.getByRole('textbox');

    // Check input attributes
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('name', 'username');
    expect(input).toHaveAttribute('placeholder', 'Enter username...');
    expect(input).toBeRequired();
    expect(input).not.toBeDisabled();
    expect(input).toHaveAttribute('minlength', '3');
    expect(input).toHaveAttribute('maxlength', '10');

    // Check pattern enforcement
    expect(input).toHaveAttribute('pattern', '[A-Za-z0-9\\- ]*');
  });

  it('does not display `(required)` when requiredInput is false', () => {
    render(InputField, { props: { inputKey: 'Password', requiredInput: false } });

    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.queryByText('(required)')).toBeNull();
  });

  it('disables input when `disabled` is true', () => {
    render(InputField, { props: { inputKey: 'DisabledField', disabled: true } });

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('updates the length counter dynamically as user types', async () => {
    const user = userEvent.setup();
    render(InputField, { props: { inputKey: 'Username', inputValue: '', maxLength: 10 } });

    const input = screen.getByRole('textbox');
    await user.type(input, 'hello');

    // Verify length counter updates correctly
    expect(screen.getByText('5/10')).toBeInTheDocument();
  });
  it('prevents entering more than `maxLength` characters', async () => {
    const user = userEvent.setup();
    render(InputField, { props: { inputKey: 'Username', maxLength: 6 } });

    const input = screen.getByRole('textbox');
    await user.type(input, 'exceeding');

    // **Input should be trimmed to maxLength**
    expect(input.value.length).toBe(6);
    expect(input.validity.tooLong).toBe(false);
  });

  it('shows validation error for disallowed special characters', async () => {
    const user = userEvent.setup();
    render(InputField, { props: { inputKey: 'Username', inputType: 'text' } });

    const input = screen.getByRole('textbox');
    await user.type(input, 'Hello!@#');

    // **PatternMismatch should be true for invalid characters**
    expect(input.validity.patternMismatch).toBe(true);
  });

  it('allows valid email format, but rejects incorrect formats', async () => {
    const user = userEvent.setup();
    render(InputField, { props: { inputKey: 'Email', inputType: 'email' } });

    const input = screen.getByRole('textbox');
    
    // Try entering an invalid email
    await user.type(input, 'invalid-email');
    expect(input.validity.typeMismatch).toBe(true);

    // Try entering a valid email
    await user.clear(input);
    await user.type(input, 'test@example.com');
    expect(input.validity.valid).toBe(true);
  });

});