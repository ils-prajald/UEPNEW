import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ForgotPassword from '../src/Screens/Auth/ForgotPassword';
import axios from 'axios';

// Mock the navigation prop
const mockNavigation = {
  navigate: jest.fn(),
};

// Mock axios
jest.mock('axios');

describe('ForgotPassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <ForgotPassword navigation={mockNavigation} />
    );

    // Check if all text components and input fields are displayed
    expect(getByText('Forgot Password')).toBeTruthy();
    expect(getByText('Reset your password')).toBeTruthy();
    expect(getByPlaceholderText('Email Address')).toBeTruthy();
  });

  it('should update email input field', () => {
    const { getByPlaceholderText } = render(
      <ForgotPassword navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('Email Address');

    fireEvent.changeText(emailInput, 'test@example.com');

    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('should submit the form and navigate on success', async () => {
    const { getByText, getByPlaceholderText } = render(
      <ForgotPassword navigation={mockNavigation} />
    );

    // Fill the email input
    const emailInput = getByPlaceholderText('Email Address');
    fireEvent.changeText(emailInput, 'test@example.com');

    // Mock axios success response
    axios.post.mockResolvedValueOnce({
      data: {
        message: 'Reset token sent successfully',
      },
    });

    // Press the continue button
    const continueButton = getByText(/continue/i);
    fireEvent.press(continueButton);

    // Wait for navigation to be called after successful API call
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('VerifyForgotPassword', {
        email: 'test@example.com',
      });
    });
  });

  it('should show an error message if API request fails', async () => {
    const { getByText, getByPlaceholderText } = render(
      <ForgotPassword navigation={mockNavigation} />
    );

    // Fill the email input
    const emailInput = getByPlaceholderText('Email Address');
    fireEvent.changeText(emailInput, 'test@example.com');

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

  it('should show validation error for invalid email input', async () => {
    const { getByText, getByPlaceholderText } = render(
      <ForgotPassword navigation={mockNavigation} />
    );

    // Fill an invalid email
    const emailInput = getByPlaceholderText('Email Address');
    fireEvent.changeText(emailInput, 'invalid-email');

    // Press the continue button
    const continueButton = getByText(/continue/i);
    fireEvent.press(continueButton);

    // Expect a validation error to be shown
    await waitFor(() => {
      expect(getByText(/invalid email format/i)).toBeTruthy();
    });
  });
});
