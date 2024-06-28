import {fireEvent, render, screen} from '@testing-library/react';
import PublishModal from './PublishModal';
import {BrowserRouter as Router} from 'react-router-dom'; // Import the Router
import {Provider} from 'react-redux';
import store from '../../app/store';

describe('publish modal', () => {
  test('renders modal', () => {
    render(
      <Router>
        <Provider store={store}>
          <PublishModal open={true} />
        </Provider>
      </Router>,
    );
    const text = screen.getByText(/Publish Form/);
    expect(text).toBeInTheDocument();
  });

  test('renders input element', () => {
    render(
      <Router>
        <Provider store={store}>
          <PublishModal open={true} />
        </Provider>
      </Router>,
    );
    const cancelBtn = screen.getByRole('button', {name: /Cancel/});
    expect(cancelBtn).toBeInTheDocument();
    const confirmBtn = screen.getByRole('button', {name: /Publish/});
    expect(confirmBtn).toBeInTheDocument();
    const inputEle = screen.getByPlaceholderText(/Form Version/);
    expect(inputEle).toBeInTheDocument();

    // fireEvent.change(inputEle, {target: {value: 'v1.0.0'}});
  });

  test('Check error message is displayed if form version is not given', async () => {
    render(
      <Router>
        <Provider store={store}>
          <PublishModal open={true} />
        </Provider>
      </Router>,
    );
    const inputEle = screen.getByPlaceholderText(/Form Version/);
    fireEvent.change(inputEle, {target: {value: ''}});
    const confirmBtn = screen.getByRole('button', {name: /Publish/});
    fireEvent.click(confirmBtn);
    const errMsg = await screen.findByText('Form Version is required.');
    expect(errMsg).toBeInTheDocument();
  });
});
