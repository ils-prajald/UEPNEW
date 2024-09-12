import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import VerifyAccount from '../src/Screens/Auth/VerifyAccount';
import axios from 'axios';
import { Alert } from 'react-native';

// Mock navigation and route
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

describe('VerifyAccount Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <VerifyAccount route={mockRoute} navigation={mockNavigation} />
    );
    
    // Check if headers and input fields are displayed
    expect(getByText('VERIFY ACCOUNT')).toBeTruthy();
    expect(getByText('Please enter the code below:')).toBeTruthy();
    expect(getByPlaceholderText('Verification Code')).toBeTruthy();
  });

  it('should update code input field', () => {
    const { getByPlaceholderText } = render(
      <VerifyAccount route={mockRoute} navigation={mockNavigation} />
    );
    
    const input = getByPlaceholderText('Verification Code');
    
    fireEvent.changeText(input, '12345');
    
    expect(input.props.value).toBe('12345');
  });

  it('should call the submit function when continue button is pressed', async () => {
    const { getByText, getByPlaceholderText } = render(
      <VerifyAccount route={mockRoute} navigation={mockNavigation} />
    );
    
    const input = getByPlaceholderText('Verification Code');
    fireEvent.changeText(input, '12345');
    
    // Mock API response
    axios.post.mockResolvedValueOnce({
      data: {
        message: 'Success',
      },
    });

    // Press the continue button
    const continueButton = getByText(/continue/i);
    fireEvent.press(continueButton);

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('SetPassword', {
        email: 'test@example.com',
      });
    });
  });

  it('should show error if API fails on submit', async () => {
    const { getByText, getByPlaceholderText } = render(
      <VerifyAccount route={mockRoute} navigation={mockNavigation} />
    );

    const input = getByPlaceholderText('Verification Code');
    fireEvent.changeText(input, '12345');

    // Mock API error response
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Invalid OTP',
        },
      },
    });

    const continueButton = getByText(/continue/i);
    fireEvent.press(continueButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Warning', 'Invalid OTP');
    });
  });

  it('should resend OTP when resend button is pressed', async () => {
    const { getByText } = render(
      <VerifyAccount route={mockRoute} navigation={mockNavigation} />
    );

    // Mock API response
    axios.post.mockResolvedValueOnce({
      data: {
        message: 'OTP resent successfully',
      },
    });

    const resendButton = getByText(/Resend OTP/i);
    fireEvent.press(resendButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/sendResetPasswordToken'), expect.any(Object));
    });
  });
});
