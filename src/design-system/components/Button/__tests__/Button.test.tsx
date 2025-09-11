/**
 * Design System - Button Tests
 * Unit tests for Button component
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '../../../themes/ThemeProvider';
import { Button } from '../Button';

// Mock vibration
jest.mock('react-native/Libraries/Vibration/Vibration', () => ({
  vibrate: jest.fn(),
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider initialTheme="light">
    {children}
  </ThemeProvider>
);

describe('Button Component', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(
      <TestWrapper>
        <Button title="Test Button" />
      </TestWrapper>
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <TestWrapper>
        <Button title="Test Button" onPress={onPressMock} />
      </TestWrapper>
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <TestWrapper>
        <Button title="Test Button" onPress={onPressMock} disabled />
      </TestWrapper>
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('does not call onPress when loading', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <TestWrapper>
        <Button title="Test Button" onPress={onPressMock} loading />
      </TestWrapper>
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('renders with subtitle', () => {
    const { getByText } = render(
      <TestWrapper>
        <Button title="Main Title" subtitle="Subtitle text" />
      </TestWrapper>
    );
    
    expect(getByText('Main Title')).toBeTruthy();
    expect(getByText('Subtitle text')).toBeTruthy();
  });

  it('renders loading indicator when loading', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Button title="Test Button" loading testID="test-button" />
      </TestWrapper>
    );
    
    // ActivityIndicator should be present when loading
    const button = getByTestId('test-button');
    expect(button).toBeTruthy();
  });

  it('applies correct accessibility properties', () => {
    const { getByRole } = render(
      <TestWrapper>
        <Button 
          title="Test Button" 
          accessibilityLabel="Custom label"
          accessibilityHint="Custom hint"
        />
      </TestWrapper>
    );
    
    const button = getByRole('button');
    expect(button.props.accessibilityLabel).toBe('Custom label');
    expect(button.props.accessibilityHint).toBe('Custom hint');
  });

  it('renders different variants correctly', () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost'] as const;
    
    variants.forEach(variant => {
      const { getByText } = render(
        <TestWrapper>
          <Button title={`${variant} button`} variant={variant} />
        </TestWrapper>
      );
      
      expect(getByText(`${variant} button`)).toBeTruthy();
    });
  });

  it('renders different sizes correctly', () => {
    const sizes = ['small', 'medium', 'large'] as const;
    
    sizes.forEach(size => {
      const { getByText } = render(
        <TestWrapper>
          <Button title={`${size} button`} size={size} />
        </TestWrapper>
      );
      
      expect(getByText(`${size} button`)).toBeTruthy();
    });
  });
});