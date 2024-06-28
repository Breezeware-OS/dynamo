// FormList.test.js (Updated)

import {
  queryByAttribute,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import FormList from './FormList';
import user from '@testing-library/user-event';
import {setupServer} from 'msw/lib/node';
import {rest} from 'msw';
import {BrowserRouter as Router} from 'react-router-dom'; // Import the Router
import {Provider} from 'react-redux';
import store from '../../app/store';

const server = setupServer(
  rest.get('http://localhost:8443/api/forms', (req, res, ctx) => {
    // Mock the API response to return 3 rows of data
    const data = {
      content: [
        {
          id: 1,
          title: 'Form 1',
          description: 'Form 1',
          status: 'Draft',
          version: 'v1.0.0',
          updatedDate: 'June 20 2023',
        },
        {
          id: 2,
          title: 'Form 2',
          description: 'Form 2',
          status: 'Draft',
          version: 'v1.0.0',
          updatedDate: 'June 20 2023',
        },
        {
          id: 3,
          title: 'Form 3',
          description: 'Form 3',
          status: 'Draft',
          version: 'v1.0.0',
          updatedDate: 'June 20 2023',
        },
      ],
    };

    return res(ctx.status(200), ctx.json(data));
  }),
);

beforeAll(() => {
  // Start the MSW server before running tests
  server.listen();
});

afterAll(() => {
  // Stop the MSW server after all tests are done
  server.close();
});

describe('List of forms', () => {
  test('renders page', () => {
    render(
      <Router>
        <Provider store={store}>
          <FormList />
        </Provider>
      </Router>,
    );
    const text = screen.getByText('Forms');
    expect(text).toBeInTheDocument();
  });

  test('renders create form button', () => {
    render(
      <Router>
        <Provider store={store}>
          <FormList />
        </Provider>
      </Router>,
    );
    const button = screen.getByRole('button', {name: /Create Form/});
    expect(button).toBeInTheDocument();
  });

  test('renders the given data', async () => {
    render(
      <Router>
        <Provider store={store}>
          <FormList />
        </Provider>
      </Router>,
    );

    await waitFor(() => {
      const tableRows = screen.getAllByRole('row');
      expect(tableRows.length).toBe(4); // Updated to match the number of mock data items
    });
  });

  test('renders the message when data length is <=0', async () => {
    // Mock the API response to return no data
    server.use(
      rest.get('http://localhost:8443/api/forms', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({content: []}));
      }),
    );

    render(
      <Router>
        <Provider store={store}>
          <FormList />
        </Provider>
      </Router>,
    );

    await waitFor(() => {
      const noFormsMessage = screen.getByText('No Data');
      expect(noFormsMessage).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    // Mock the API response to return an error
    server.use(
      rest.get('http://localhost:8443/api/forms', (req, res, ctx) => {
        return res(
          ctx.status(404, 'err'),
          ctx.json({message: 'Error fetching data'}),
        ); // Simulate a server error
      }),
    );

    render(
      <Router>
        <Provider store={store}>
          <FormList />
        </Provider>
      </Router>,
    );

    await waitFor(() => {
      const errorMessage = screen.getByText('Error fetching data');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  //   test('check menu is opened when action button is clicked', async () => {
  //     const {findAllByTestId, findByTestId} = render(<FormList />);
  //     const actionsBtn = await screen.findAllByTestId('actions');
  //     const elementToBeClicked = actionsBtn[0];

  //     user.click(elementToBeClicked);

  //     const menu = await screen.findByTestId('action-menu');
  //     expect(menu).toBeInTheDocument();
  //   });
});
