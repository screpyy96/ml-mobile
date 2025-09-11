/**
 * Design System - Input Tests
 * Unit tests for Input component
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '../../../themes/ThemeProvider';
import { Input } from '../Input';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider initialTheme="light">
    {children}
  </ThemeProvider>
);

describe('Input Component', () => {
  it('renders correctly with label', () => {
    const { getByText } = render(
      <TestWrapper>
        <Input label="Test Label" />
      </TestWrapper>
    );
    
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeTextMock = jest.fn();
    const { getByDisplayValue } = render(
      <TestWrapper>
        <Input 
          label="Test Input" 
          value="initial"
          onChangeText={onChangeTextMock} 
        />
      </TestWrapper>
    );
    
    const input = getByDisplayValue('initial');
    fireEvent.changeText(input, 'new text');
    expect(onChangeTextMock).toHaveBeenCalledWith('new text');
  });

  it('shows error message when error state is true', () => {
    const { getByText } = render(
      <TestWrapper>
        <Input 
          label="Test Input" 
          error 
          errorMessage="This is an error" 
        />
      </TestWrapper>
    );
    
    expect(getByText('This is an error')).toBeTruthy();
  });

  it('shows success message when success state is true', () => {
    const { getByText } = render(
      <TestWrapper>
        <Input 
          label="Test Input" 
          success 
          successMessage="This is success" 
        />
      </TestWrapper>
    );
    
    expect(getByText('This is success')).toBeTruthy();
  });

  it('shows helper text when provided', () => {
    const { getByText } = render(
      <TestWrapper>
        <Input 
          label="Test Input" 
          helperText="This is helper text" 
        />
      </TestWrapper>
    );
    
    expect(getByText('This is helper text')).toBeTruthy();
  });

  it('renders search variant with search icon', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Input 
          variant="search"
          placeholder="Search..."
          testID="search-input"
        />
      </TestWrapper>
    );
    
    const input = getByTestId('search-input');
    expect(input).toBeTruthy();
  });

  it('renders textarea variant correctly', () => {
    const { getByDisplayValue } = render(
      <TestWrapper>
        <Input 
          variant="textarea"
          value="Multi-line text"
          multiline
        />
      </TestWrapper>
    );
    
    expect(getByDisplayValue('Multi-line text')).toBeTruthy();
  });

  it('handles focus and blur events', () => {
    const onFocusMock = jest.fn();
    const onBlurMock = jest.fn();
    
    const { getByDisplayValue } = render(
      <TestWrapper>
        <Input 
          value="test"
          onFocus={onFocusMock}
          onBlur={onBlurMock}
        />
      </TestWrapper>
    );
    
    const input = getByDisplayValue('test');
    fireEvent(input, 'focus');
    fireEvent(input, 'blur');
    
    expect(onFocusMock).toHaveBeenCalled();
    expect(onBlurMock).toHaveBeenCalled();
  });

  it('applies correct accessibility properties', () => {
    const { getByLabelText } = render(
      <TestWrapper>
        <Input 
          label="Test Input"
          accessibilityLabel="Custom label"
          accessibilityHint="Custom hint"
        />
      </TestWrapper>
    );
    
    const input = getByLabelText('Custom label');
    expect(input).toBeTruthy();
  });

  it('renders different sizes correctly', () => {
    const sizes = ['small', 'medium', 'large'] as const;
    
    sizes.forEach(size => {
      const { getByDisplayValue } = render(
        <TestWrapper>
          <Input 
            value={`${size} input`}
            size={size}
          />
        </TestWrapper>
      );
      
      expect(getByDisplayValue(`${size} input`)).toBeTruthy();
    });
  });

  it('disables input when disabled prop is true', () => {
    const { getByDisplayValue } = render(
      <TestWrapper>
        <Input 
          value="disabled input"
          disabled
        />
      </TestWrapper>
    );
    
    const input = getByDisplayValue('disabled input');
    expect(input.props.editable).toBe(false);
  });
});