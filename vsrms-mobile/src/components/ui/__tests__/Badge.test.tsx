import React from 'react';
import { render } from '@testing-library/react-native';
import { Badge } from '../Badge';

describe('Badge Component', () => {
  test('renders the label correctly', () => {
    const { getByText } = render(<Badge label="Pending" />);
    expect(getByText('Pending')).toBeTruthy();
  });

  test('renders with the primary variant by default', () => {
    const { getByText } = render(<Badge label="VSRMS" />);
    const text = getByText('VSRMS');
    
    // In our mock, primaryText color is '#F56E0F'
    // This is a snapshot test to ensure stability
    expect(text.props.style).toContainEqual(expect.objectContaining({ color: '#F56E0F' }));
  });

  test('renders different variants correctly', () => {
    const { getByText: getSuccess } = render(<Badge label="Success" variant="success" />);
    // successText color in mock is '#15803D'
    expect(getSuccess('Success').props.style).toContainEqual(expect.objectContaining({ color: '#15803D' }));

    const { getByText: getError } = render(<Badge label="Error" variant="error" />);
    // errorText color in mock is '#DC2626'
    expect(getError('Error').props.style).toContainEqual(expect.objectContaining({ color: '#DC2626' }));
  });
});
