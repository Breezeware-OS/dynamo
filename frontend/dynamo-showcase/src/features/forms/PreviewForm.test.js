import {
    queryByAttribute,
    render,
    screen,
    waitFor,
  } from '@testing-library/react';
  import user from '@testing-library/user-event';
  import {setupServer} from 'msw/lib/node';
  import {rest} from 'msw';
import PreviewForm from './PreviewForm';

const server = setupServer(
    rest.get('http://localhost:8443/api/forms/*', (req, res, ctx) => {
      // Mock the API response to return 3 rows of data
      const data =  {
        name:'Form 1',
        description:'Description',
        formJson:{
            components:[{
                "label": "Text field",
                "type": "textfield",
                "layout": {
                  "row": "Row_0xdgoho",
                  "columns": 8
                },
                "id": "Field_1bnnnem",
                "key": "field_1hsteyu"
              }]
        }
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

describe('Preview forms',()=>{
    test('renders page',()=>{
       
          
          render(<PreviewForm/>)
          server.use(
            rest.get('http://localhost:8443/api/forms/*', (req, res, ctx) => {
              return res(ctx.status(200), ctx.json({
                name:'Form 1',
                description:'Description',
                formJson:{
                    components:[{
                        "label": "Text field",
                        "type": "textfield",
                        "layout": {
                          "row": "Row_0xdgoho",
                          "columns": 8
                        },
                        "id": "Field_1bnnnem",
                        "key": "field_1hsteyu"
                      }]
                }
              }));
            }),
          );
          new Promise((resolve) => setTimeout(resolve, 5000))

        const text=screen.getByText('Form 1');
        expect(text).toBeInTheDocument()
    })

    // test('renders the given data',async()=>{
    //     server.use(
    //         rest.get('http://localhost:8443/api/forms/*', (req, res, ctx) => {
    //           return res(ctx.status(200), ctx.json({data: {
    //             name:'Form 1',
    //             description:'Description',
    //             formJson:{
    //                 components:[{
    //                     "label": "Text field",
    //                     "type": "textfield",
    //                     "layout": {
    //                       "row": "Row_0xdgoho",
    //                       "columns": 8
    //                     },
    //                     "id": "Field_1bnnnem",
    //                     "key": "field_1hsteyu"
    //                   }]
    //             }
    //           }}));
    //         }),
    //       );
    //       render(<PreviewForm/>)
    //  new Promise((resolve) => setTimeout(resolve, 3000))

    //       await waitFor(async() => {

    //       const textField=await screen.getByPlaceholderText('Text field')
    //       expect(textField).toBeInTheDocument();
    //     },{interval:5000});

    // })

    // test('handles api error',async ()=>{
    //     server.use(
    //         rest.get('http://localhost:8443/api/forms/*', (req, res, ctx) => {
    //           return res(
    //             ctx.status(404, 'err'),
    //             ctx.json({message: 'Error fetching data'}),
    //           ); // Simulate a server error
    //         }),
    //       );
    //     render(<PreviewForm/>)
    //     await waitFor(() => {
    //         const errorMessage = screen.getByText('Error fetching data');
    //         expect(errorMessage).toBeInTheDocument();
    //       });
    // })

    // test('show notification on submit',async ()=>{
    //     server.use(
    //         rest.get('http://localhost:8443/api/forms/*', (req, res, ctx) => {
    //           return res(
    //             ctx.status(200),
    //             ctx.json({message: 'Form submitted Successfully'}),
    //           ); // Simulate a server error
    //         }),
    //       );
    //     render(<PreviewForm/>)
    //     await waitFor(() => {
    //         const button = screen.getByRole('button',{name:/Submit/});
    //          fireEvent.click(button);
    //         const sucessMessage = screen.getByText('Form submitted Successfully');
    //         expect(sucessMessage).toBeInTheDocument();
    //       });
    // })
})