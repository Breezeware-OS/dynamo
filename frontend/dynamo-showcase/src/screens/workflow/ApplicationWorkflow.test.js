import {render, screen, waitFor, fireEvent} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {BrowserRouter as Router} from 'react-router-dom';
import {Provider} from 'react-redux';

import ApplicantWorkflowList from './ApplicantWorkflowList';
import store from '../../app/store';

const server = setupServer(
  rest.get(
    'http://localhost:8443/api/applicant/applications?user-id=0138e238-6684-47c2-a46e-1f92be8514d2&sort=id,asc&page-size=15&page-no=1&application-id=&application-from-date=2023-09-01T00:00:00.000000Z&application-to-date=2023-09-02T00:00:00.000000Z&status=all',
    (req, res, ctx) => {
      return res(
        ctx.json({
          content: [
            {
              id: 1234,
              createdOn: '2023-09-26T15:49:18.589354Z',
              modifiedOn: '2023-09-26T15:49:18.589354Z',
              applicationId: '1234',
              userId: '0138e238-6684-47c2-a46e-1f92be8514d2',
              status: 'approved',
            },
            {
              id: 1424,
              createdOn: '2023-09-26T15:49:18.589354Z',
              modifiedOn: '2023-09-26T15:49:18.589354Z',
              applicationId: '1424',
              userId: '0138e238-6684-47c2-a46e-1f92be8514d2',
              status: 'declined',
            },
            {
              id: 4512,
              createdOn: '2023-09-26T15:49:18.589354Z',
              modifiedOn: '2023-09-26T15:49:18.589354Z',
              applicationId: '4512',
              userId: '0138e238-6684-47c2-a46e-1f92be8514d2',
              status: 'application_in-progress',
            },
            {
              id: 5421,
              createdOn: '2023-09-26T15:49:18.589354Z',
              modifiedOn: '2023-09-26T15:49:18.589354Z',
              applicationId: '5421',
              userId: '0138e238-6684-47c2-a46e-1f92be8514d2',
              status: 'approved',
            },
            {
              id: 9865,
              createdOn: '2023-09-26T15:49:18.589354Z',
              modifiedOn: '2023-09-26T15:49:18.589354Z',
              applicationId: '9865',
              userId: '0138e238-6684-47c2-a46e-1f92be8514d2',
              status: 'declined',
            },
            {
              id: 3265,
              createdOn: '2023-09-26T15:49:18.589354Z',
              modifiedOn: '2023-09-26T15:49:18.589354Z',
              applicationId: '3265',
              userId: '0138e238-6684-47c2-a46e-1f92be8514d2',
              status: 'application_in-progress',
            },
            {
              id: 1287,
              createdOn: '2023-09-26T15:49:18.589354Z',
              modifiedOn: '2023-09-26T15:49:18.589354Z',
              applicationId: '1287',
              userId: '0138e238-6684-47c2-a46e-1f92be8514d2',
              status: 'approved',
            },
            {
              id: 4522,
              createdOn: '2023-09-26T15:49:18.589354Z',
              modifiedOn: '2023-09-26T15:49:18.589354Z',
              applicationId: '4522',
              userId: '0138e238-6684-47c2-a46e-1f92be8514d2',
              status: 'declined',
            },
            {
              id: 9000,
              createdOn: '2023-09-26T15:49:18.589354Z',
              modifiedOn: '2023-09-26T15:49:18.589354Z',
              applicationId: '9000',
              userId: '0138e238-6684-47c2-a46e-1f92be8514d2',
              status: 'application_in-progress',
            },
            {
              id: 9871,
              createdOn: '2023-09-26T15:49:18.589354Z',
              modifiedOn: '2023-09-26T15:49:18.589354Z',
              applicationId: '9871',
              userId: '0138e238-6684-47c2-a46e-1f92be8514d2',
              status: 'approved',
            },
            {
              id: 5410,
              createdOn: '2023-09-26T15:49:18.589354Z',
              modifiedOn: '2023-09-26T15:49:18.589354Z',
              applicationId: '5410',
              userId: '0138e238-6684-47c2-a46e-1f92be8514d2',
              status: 'approved',
            },
            {
              id: 3021,
              createdOn: '2023-09-26T15:49:18.589354Z',
              modifiedOn: '2023-09-26T15:49:18.589354Z',
              applicationId: '3021',
              userId: '0138e238-6684-47c2-a46e-1f92be8514d2',
              status: 'declined',
            },
            {
              id: 8780,
              createdOn: '2023-09-26T15:49:18.589354Z',
              modifiedOn: '2023-09-26T15:49:18.589354Z',
              applicationId: '8780',
              userId: '0138e238-6684-47c2-a46e-1f92be8514d2',
              status: 'application_in-progress',
            },
            {
              id: 5400,
              createdOn: '2023-09-26T15:49:18.589354Z',
              modifiedOn: '2023-09-26T15:49:18.589354Z',
              applicationId: '5400',
              userId: '0138e238-6684-47c2-a46e-1f92be8514d2',
              status: 'approved',
            },
            {
              id: 4000,
              createdOn: '2023-09-26T15:49:18.589354Z',
              modifiedOn: '2023-09-26T15:49:18.589354Z',
              applicationId: '4000',
              userId: '0138e238-6684-47c2-a46e-1f92be8514d2',
              status: 'declined',
            },
          ],
          pageable: {
            sort: {
              empty: false,
              unsorted: false,
              sorted: true,
            },
            offset: 0,
            pageNumber: 0,
            pageSize: 15,
            paged: true,
            unpaged: false,
          },
          last: false,
          totalPages: 2,
          totalElements: 20,
          size: 15,
          number: 0,
          sort: {
            empty: false,
            unsorted: false,
            sorted: true,
          },
          first: true,
          numberOfElements: 15,
          empty: false,
        }),
      );
    },
  ),
);

// const countServer = setupServer(
//   rest.get(
//     'http://localhost:8443/api/applicant/applications/status-count?user-id=0138e238-6684-47c2-a46e-1f92be8514d2',
//     (req, res, ctx) => {
//       return ctx.json({all: 20, in_progress: 2, completed: 18});
//     },
//   ),
// );

beforeAll(() => {
  server.listen({onUnhandledRequest: 'bypass'});
  // countServer.listen();
});
afterEach(() => {
  server.listen();
  // countServer.listen();
});
afterAll(() => {
  server.listen();
  // countServer.listen();
});

describe('Applicant Workflow component', () => {
  it('renders component', async () => {
    render(
      <Provider store={store}>
        <Router>
          <ApplicantWorkflowList />
        </Router>
      </Provider>,
    );
    const text = screen.getByText('Workflow - Applicant');
    expect(text).toBeInTheDocument();

    // // Wait for the element to appear in the DOM
    // const workflow = await screen.findByText('#4000');

    // expect(workflow).toBeInTheDocument();
  });

  it.only('displays table with headers', async () => {
    render(
      <Provider store={store}>
        <Router>
          <ApplicantWorkflowList />
        </Router>
      </Provider>,
    );

    const table = screen.getAllByRole('table')[0];
    const headerRow = table.querySelector('thead > tr');
    const headerCells = headerRow.querySelectorAll('th');

    expect(headerCells.length).toBe(4);

    const headers = [];

    // console.log('headerCells', headerCells);
    // headerCells.forEach((cell, index) => {
    //   console.log(`Header Cell ${index + 1}: ${cell.textContent}`);
    //   headers.push(cell.textContent);
    // });

    expect(headers[0]).toEqual(expect.stringContaining('APPLICATION ID'));
    expect(headers[1]).toEqual(expect.stringContaining('STATUS'));
    expect(headers[2]).toEqual(expect.stringContaining('CREATED ON'));
    expect(headers[3]).toEqual(expect.stringContaining('ACTIONS'));
  });

  it('displays tabs', async () => {
    render(
      <Provider store={store}>
        <Router>
          <ApplicantWorkflowList />
        </Router>
      </Provider>,
    );
    const tabs = screen.getByText('All (200)');
    expect(tabs).toBeInTheDocument();
  });

  it('displays search input field', async () => {
    render(
      <Provider store={store}>
        <Router>
          <ApplicantWorkflowList />
        </Router>
      </Provider>,
    );
    const searchField = screen.getByPlaceholderText('Search Application ID');
    expect(searchField).toBeInTheDocument();
  });

  it('displays filter date field', async () => {
    render(
      <Provider store={store}>
        <Router>
          <ApplicantWorkflowList />
        </Router>
      </Provider>,
    );
    const searchField = screen.getByPlaceholderText('dd-mm-yyyy');
    expect(searchField).toBeInTheDocument();
  });

  it('displays sort icons', async () => {
    render(
      <Provider store={store}>
        <Router>
          <ApplicantWorkflowList />
        </Router>
      </Provider>,
    );

    const applicationSortElement = screen.getByTestId('applicationIdSortIcon');
    expect(applicationSortElement).toBeInTheDocument();
    const statusSortElement = screen.getByTestId('statusSortIcon');
    expect(statusSortElement).toBeInTheDocument();
    const createdDateSortElement = screen.getByTestId('createdOnSortIcon');
    expect(createdDateSortElement).toBeInTheDocument();

    // click
    fireEvent.click(applicationSortElement);

    const workflow = await screen.findByText('#4000');

    expect(workflow).toBeInTheDocument();
  });
});
