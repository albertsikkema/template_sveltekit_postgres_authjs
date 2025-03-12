import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import Select from './Select.svelte'; // Ensure correct import path

describe('Select Component', () => {
  
  it('renders the dropdown with the correct label', () => {
    render(Select, { props: { inputKey: 'Category', options: { option1: 'Option 1', option2: 'Option 2' } } });

    // Check label text
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('renders options correctly', () => {
    const options = {
      option1: 'Option 1',
      option2: 'Option 2',
      option3: 'Option 3'
    };

    render(Select, { props: { inputKey: 'Category', options } });

    // Ensure all options exist in the dropdown
    for (const key in options) {
      expect(screen.getByRole('option', { name: options[key] })).toBeInTheDocument();
    }
  });

  it('sets the correct initial selected value', () => {
    const options = {
      apple: 'Apple',
      banana: 'Banana',
      orange: 'Orange'
    };

    render(Select, { props: { inputKey: 'Fruits', options, inputValue: 'banana' } });

    const select = screen.getByRole('combobox'); // <select> elements have role "combobox"
    
    // Ensure the default selected option is "Banana"
    expect(select.value).toBe('banana');
  });

  it('updates value when a new option is selected', async () => {
    const user = userEvent.setup();
    const options = {
      cat: 'Cat',
      dog: 'Dog',
      fish: 'Fish'
    };

    render(Select, { props: { inputKey: 'Pets', options, inputValue: 'cat' } });

    const select = screen.getByRole('combobox');

    // Ensure initial value is "Cat"
    expect(select.value).toBe('cat'); 

    // Select a new option
    await user.selectOptions(select, 'fish');

    // Ensure the new selection is "Fish"
    expect(select.value).toBe('fish');
  });

  it('has a `name` attribute in lowercase', () => {
    render(Select, { props: { inputKey: 'Country', options: { usa: 'USA', canada: 'Canada' } } });

    const select = screen.getByRole('combobox');

    // ✅ Ensure the correct `name` attribute is set
    expect(select).toHaveAttribute('name', 'country'); // Lowercase!
  });

});