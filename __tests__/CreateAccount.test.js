import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CreateAccount from '../src/Screens/Auth/CreateAccount';
import axios from 'axios';
import { decryptData , encryptData } from '../src/utilities/Crypto';

jest.mock('axios');
jest.mock('../../utilities/Crypto', () => ({
  decryptData: jest.fn(),
}));

describe('CreateAccount Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: encryptData({
        data: {
          countries: [{ id: 1, name: 'united States' }, { id: 2, name: 'Canada' }],
          states: [{ id: 1, name: 'Alaska' }, { id: 2, name: 'Ontario' }],
          cities: [{ id: 1, name: 'Barrow' }, { id: 2, name: 'Queensville' }],
        },
      }),
    });
    decryptData.mockResolvedValue({
      data: {
        countries: [{ id: 1, name: 'united States' }, { id: 2, name: 'Canada' }],
          states: [{ id: 1, name: 'Alaska' }, { id: 2, name: 'Ontario' }],
          cities: [{ id: 1, name: 'Barrow' }, { id: 2, name: 'Queensville' }],
      },
    });
  });

  it('renders correctly', () => {
    const { getByPlaceholderText } = render(<CreateAccount />);
    expect(getByPlaceholderText('First Name')).toBeTruthy();
    expect(getByPlaceholderText('Last Name')).toBeTruthy();
    expect(getByPlaceholderText('Email Address')).toBeTruthy();
  });

  it('shows error when form is submitted with missing fields', async () => {
    const { getByText, getByPlaceholderText } = render(<CreateAccount />);

    // Press the continue button without filling in details
    fireEvent.press(getByText('Countinue'));

    await waitFor(() => {
      expect(getByText('Please select country')).toBeTruthy();
    });
  });

  it('submits form correctly when all fields are filled', async () => {
    const { getByText, getByPlaceholderText } = render(<CreateAccount />);

    fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
    fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('Email Address'), 'john.doe@example.com');
    fireEvent.changeText(getByPlaceholderText('Street Address'), '1234 Street');
    fireEvent.changeText(getByPlaceholderText('Zip Code'), '12345');
    fireEvent.changeText(getByPlaceholderText('Telephone'), '(123) 456-7890');

    fireEvent.press(getByText('Countinue'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });

  it('fetches countries and states on render', async () => {
    const { getByText } = render(<CreateAccount />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/getCountries'));
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/getStates'));
    });
  });
});
