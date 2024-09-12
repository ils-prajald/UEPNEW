import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SetPassword from '../src/Screens/Auth/SetPassword';
import axios from 'axios';

// Mock the navigation and route props
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

describe('SetPassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <SetPassword route={mockRoute} navigation={mockNavigation} />
    );

    // Check if headers and input fields are displayed
    expect(getByText('Enter Your Password')).toBeTruthy();
    expect(getByText('Re-enter Your Password')).toBeTruthy();
    expect(getByPlaceholderText('Enter Your Password')).toBeTruthy();
    expect(getByPlaceholderText('Re-enter Your Password')).toBeTruthy();
  });

  it('should update password and confirm password input fields', () => {
    const { getByPlaceholderText } = render(
      <SetPassword route={mockRoute} navigation={mockNavigation} />
    );

    const passwordInput = getByPlaceholderText('Enter Your Password');
    const confirmPasswordInput = getByPlaceholderText('Re-enter Your Password');

    fireEvent.changeText(passwordInput, 'Test@123');
    fireEvent.changeText(confirmPasswordInput, 'Test@123');

    expect(passwordInput.props.value).toBe('Test@123');
    expect(confirmPasswordInput.props.value).toBe('Test@123');
  });

  it('should call the submit function and navigate on success', async () => {
    const { getByText, getByPlaceholderText } = render(
      <SetPassword route={mockRoute} navigation={mockNavigation} />
    );

    // Fill the inputs
    const passwordInput = getByPlaceholderText('Enter Your Password');
    const confirmPasswordInput = getByPlaceholderText('Re-enter Your Password');

    fireEvent.changeText(passwordInput, 'Test@123');
    fireEvent.changeText(confirmPasswordInput, 'Test@123');

    // Mock axios success response
    axios.post.mockResolvedValueOnce({
      data: {
        message: 'Password setup successful',
      },
    });

    // Press the continue button
    const continueButton = getByText(/continue/i);
    fireEvent.press(continueButton);

    // Wait for navigation to be called after successful password setup
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('RegisterConfirm');
    });
  });

  it('should show error if password confirmation fails', async () => {
    const { getByText, getByPlaceholderText } = render(
      <SetPassword route={mockRoute} navigation={mockNavigation} />
    );

    // Fill mismatching passwords
    const passwordInput = getByPlaceholderText('Enter Your Password');
    const confirmPasswordInput = getByPlaceholderText('Re-enter Your Password');

    fireEvent.changeText(passwordInput, 'Test@123');
    fireEvent.changeText(confirmPasswordInput, 'Test@321');

    // Press the continue button
    const continueButton = getByText(/continue/i);
    fireEvent.press(continueButton);

    // Expect an error message for password mismatch
    await waitFor(() => {
      expect(getByText(/passwords do not match/i)).toBeTruthy();
    });
  });

  it('should show error if API request fails', async () => {
    const { getByText, getByPlaceholderText } = render(
      <SetPassword route={mockRoute} navigation={mockNavigation} />
    );

    // Fill the inputs
    const passwordInput = getByPlaceholderText('Enter Your Password');
    const confirmPasswordInput = getByPlaceholderText('Re-enter Your Password');

    fireEvent.changeText(passwordInput, 'Test@123');
    fireEvent.changeText(confirmPasswordInput, 'Test@123');

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

    // Expect an error message
    await waitFor(() => {
      expect(getByText(/something went wrong/i)).toBeTruthy();
    });
  });
});
