import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ResetPassword from '../src/Screens/Auth/ResetPassword';
import axios from 'axios';

// Mock the navigation prop and route params
const mockNavigation = {
  navigate: jest.fn(),
};
const mockRoute = {
  params: {
    email: 'test@example.com',
  },
};

// Mock axios
jest.mock('axios');

describe('ResetPassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <ResetPassword route={mockRoute} navigation={mockNavigation} />
    );

    // Check if all text components and input fields are displayed
    expect(getByText('Reset Password')).toBeTruthy();
    expect(getByText('test@example.com')).toBeTruthy();
    expect(getByPlaceholderText('Enter Your Password')).toBeTruthy();
    expect(getByPlaceholderText('Re-enter Your Password')).toBeTruthy();
  });

  it('should update password and confirm password input fields', () => {
    const { getByPlaceholderText } = render(
      <ResetPassword route={mockRoute} navigation={mockNavigation} />
    );

    const passwordInput = getByPlaceholderText('Enter Your Password');
    const confirmPasswordInput = getByPlaceholderText('Re-enter Your Password');

    fireEvent.changeText(passwordInput, 'Password123!');
    fireEvent.changeText(confirmPasswordInput, 'Password123!');

    expect(passwordInput.props.value).toBe('Password123!');
    expect(confirmPasswordInput.props.value).toBe('Password123!');
  });

  it('should submit the form and navigate on success', async () => {
    const { getByText, getByPlaceholderText } = render(
      <ResetPassword route={mockRoute} navigation={mockNavigation} />
    );

    // Fill the password and confirm password input fields
    const passwordInput = getByPlaceholderText('Enter Your Password');
    const confirmPasswordInput = getByPlaceholderText('Re-enter Your Password');
    fireEvent.changeText(passwordInput, 'Password123!');
    fireEvent.changeText(confirmPasswordInput, 'Password123!');

    // Mock axios success response
    axios.post.mockResolvedValueOnce({
      data: {
        message: 'Password reset successfully',
      },
    });

    // Press the continue button
    const continueButton = getByText(/continue/i);
    fireEvent.press(continueButton);

    // Wait for navigation to be called after successful API call
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('UserLogin');
    });
  });

  it('should show an error message if API request fails', async () => {
    const { getByText, getByPlaceholderText } = render(
      <ResetPassword route={mockRoute} navigation={mockNavigation} />
    );

    // Fill the password and confirm password input fields
    const passwordInput = getByPlaceholderText('Enter Your Password');
    const confirmPasswordInput = getByPlaceholderText('Re-enter Your Password');
    fireEvent.changeText(passwordInput, 'Password123!');
    fireEvent.changeText(confirmPasswordInput, 'Password123!');

    // Mock axios failure response
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Something went wrong',
        },
      },
    });

    // Press the continue button
    const continueButton = getByText(/continue/i);
    fireEvent.press(continueButton);

    // Expect an error message to appear
    await waitFor(() => {
      expect(getByText(/something went wrong/i)).toBeTruthy();
    });
  });

  it('should show validation error for invalid password input', async () => {
    const { getByText, getByPlaceholderText } = render(
      <ResetPassword route={mockRoute} navigation={mockNavigation} />
    );

    // Fill invalid passwords
    const passwordInput = getByPlaceholderText('Enter Your Password');
    const confirmPasswordInput = getByPlaceholderText('Re-enter Your Password');
    fireEvent.changeText(passwordInput, 'short');
    fireEvent.changeText(confirmPasswordInput, 'short');

    // Press the continue button
    const continueButton = getByText(/continue/i);
    fireEvent.press(continueButton);

    // Expect a validation error to be shown
    await waitFor(() => {
      expect(getByText(/invalid password format/i)).toBeTruthy();
    });
  });
});
