import {setupServer} from 'msw/lib/node';
import {
  fireEvent,
  queryByAttribute,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import FormVersionsList from './FormVersionsList';
import {rest} from 'msw';
import {Provider} from 'react-redux';
import store from '../../app/store';

const server = setupServer(
  rest.get('http://localhost:8443/api/*/forms', (req, res, ctx) => {
    // Mock the API response to return 3 rows of data
    const data = {
      content: [
        {
          version: 'v1.0.0',
          updatedDate: 'June 20 2023',
        },
        {
          version: 'v1.0.0',
          updatedDate: 'June 20 2023',
        },
        {
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

describe('List of forms versions', () => {
  test('renders Modal', () => {
    render(
      <Provider store={store}>
        <FormVersionsList open={true} />
      </Provider>,
    );

    const text = screen.getByText(/Form/);

    expect(text).toBeInTheDocument();
  });

  test('renders textfield', async () => {
    render(
      <Provider store={store}>
        <FormVersionsList open={true} />
      </Provider>,
    );
    const searchField = await screen.getByPlaceholderText('Versions');
    expect(searchField).toBeInTheDocument();
  });

  test('handles user input', () => {
    render(
      <Provider store={store}>
        <FormVersionsList open={true} />
      </Provider>,
    );

    const inputElement = screen.getByPlaceholderText('Versions');

    // Simulate user input
    fireEvent.change(inputElement, {target: {value: 'Test input'}});

    // Ensure the input value is updated
    expect(inputElement.value).toBe('Test input');
  });

  test('renders the given data', async () => {
    render(
      <Provider store={store}>
        <FormVersionsList open={true} />
      </Provider>,
    );
    server.use(
      rest.get(
        'http://localhost:8443/api/forms/*/form-versions',
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              content: [
                {
                  version: 'v1.0.0',
                  updatedDate: 'June 20 2023',
                },
                {
                  version: 'v1.0.0',
                  updatedDate: 'June 20 2023',
                },
                {
                  version: 'v1.0.0',
                  updatedDate: 'June 20 2023',
                },
              ],
            }),
          );
        },
      ),
    );
    await waitFor(() => {
      const tableRows = screen.getAllByRole('row');
      expect(tableRows.length).toBe(4); // Updated to match the number of mock data items
    });
  });

  test('renders the message when data length is <=0', async () => {
    // Mock the API response to return no data
    server.use(
      rest.get(
        'http://localhost:8443/api/forms/*/form-versions',
        (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({content: []}));
        },
      ),
    );

    render(
      <Provider store={store}>
        <FormVersionsList open={true} />
      </Provider>,
    );

    await waitFor(() => {
      const noFormsMessage = screen.getByText('No Data');
      expect(noFormsMessage).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    // Mock the API response to return an error
    server.use(
      rest.get(
        'http://localhost:8443/api/forms/*/form-versions',
        (req, res, ctx) => {
          return res(
            ctx.status(404, 'err'),
            ctx.json({message: 'Error fetching data'}),
          ); // Simulate a server error
        },
      ),
    );

    render(
      <Provider store={store}>
        <FormVersionsList open={true} />
      </Provider>,
    );

    await waitFor(() => {
      const errorMessage = screen.getByText('Error fetching data');
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
