import {render, screen} from '@testing-library/react';
import DiscardModal from './DiscardModal';
import {Route} from 'react-router-dom';

describe('discard and exit modal', () => {
  test('renders modal', () => {
    render(
      <Route>
        <DiscardModal open={true} />
      </Route>,
    );
    const text = screen.getByText(
      'Are you sure you want to discard the changes?',
    );
    expect(text).toBeInTheDocument();
  });

  test('renders header', () => {
    render(
      <Route>
        <DiscardModal open={true} />
      </Route>,
    );
    const text = screen.getByText('Discard Changes');
    expect(text).toBeInTheDocument();
  });

  test('renders cancel btn', () => {
    render(
      <Route>
        <DiscardModal open={true} />
      </Route>,
    );
    const text = screen.getByRole('button', {name: /Cancel/});
    expect(text).toBeInTheDocument();
  });

  test('renders Discard btn', () => {
    render(
      <Route>
        <DiscardModal open={true} />
      </Route>,
    );
    const text = screen.getByRole('button', {name: /Discard/});
    expect(text).toBeInTheDocument();
  });
});
