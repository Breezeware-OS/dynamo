import {
  fireEvent,
  queryByAttribute,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import CreateForm from './CreateForm';
import user from '@testing-library/user-event';
import {setupServer} from 'msw/lib/node';
import {rest} from 'msw';
import {BrowserRouter as Router} from 'react-router-dom'; // Import the Router
import {Provider} from 'react-redux';
import store from '../../app/store';

describe('Create form', () => {
  test('renders page', () => {
    render(
      <Router>
        <Provider store={store}>
          <CreateForm />
        </Provider>
      </Router>,
    );
    const text = screen.getByText(/Create Forms/);
    expect(text)?.toBeInTheDocument();
  });

  test('renders input elements', async () => {
    render(
      <Router>
        <Provider store={store}>
          <CreateForm />
        </Provider>
      </Router>,
    );

    const saveBtn = screen.getByRole('button', {name: /Save/});
    expect(saveBtn).toBeInTheDocument();
    // const previewBtn = screen.getByRole('button', {name: /Preview/});
    // expect(previewBtn).toBeIntheDocument();
    // const publishBtn = screen.getByRole('button', {name: /Publish/});
    // expect(publishBtn).toBeIntheDocument();
    // const discardBtn = screen.getByRole('button', {name: /Discard/});
    // expect(discardBtn).toBeIntheDocument();
    // const formTitleField = screen.getByRole('textbox', {name: 'title'});
    // expect(formTitleField).toBeIntheDocument();
    // const formDescriptionField = screen.getByRole('textbox', {
    //   name: 'description',
    // });
    // expect(formDescriptionField).toBeIntheDocument();
  });

  test('handles user input', () => {
    render(
      <Router>
        <Provider store={store}>
          <CreateForm />
        </Provider>
      </Router>,
    );

    const inputElement = screen.getByPlaceholderText(/Form Title/);

    // Simulate user input
    fireEvent.change(inputElement, {target: {value: 'Test input'}});

    // Ensure the input value is updated
    expect(inputElement.value).toBe('Test input');
  });

  test('handles description field', () => {
    render(
      <Router>
        <Provider store={store}>
          <CreateForm />
        </Provider>
      </Router>,
    );

    const descriptionEle = screen.getByPlaceholderText(/Description/);

    // Simulate user input
    fireEvent.change(descriptionEle, {target: {value: 'Test input'}});

    // Ensure the input value is updated
    expect(descriptionEle.value).toBe('Test input');
  });

  test('check error message is displayed if form title is not given', async () => {
    render(
      <Router>
        <Provider store={store}>
          <CreateForm />
        </Provider>
      </Router>,
    );
    await waitFor(() => {
      const inputElement = screen.getByPlaceholderText(/Form Title/);
      fireEvent.change(inputElement, {target: {value: ''}});
      const saveBtn = screen.getByRole('button', {name: /Save/});
      fireEvent.click(saveBtn);
    });
    const errorMessage = await screen.findByText('Form Title is required.');

    expect(errorMessage).toBeInTheDocument();
  });

  // test('check error message is not displayed if form title is given', async () => {
  //   render(
  //     <Router>
  //       <Provider store={store}>
  //         <CreateForm />
  //       </Provider>
  //     </Router>,
  //   );

  //   await waitFor(() => {
  //     const inputElement = screen.getByPlaceholderText(/Form Title/);
  //     fireEvent.change(inputElement, {target: {value: 'Test Value'}});
  //     const saveBtn = screen.getByRole('button', {name: /Save/});
  //     fireEvent.click(saveBtn);
  //   });
  //   const errorMessage = await screen.getByTestId('title');
  //   if (!errorMessage || errorMessage === undefined || errorMessage === null) {
  //     console.log('====================================');
  //     console.log(errorMessage);
  //     console.log('====================================');
  //     expect(true).toBe(true);
  //   }
  //   expect(errorMessage).not.toBeInTheDocument();
  // });
});
