import {rest} from 'msw';

export const handlers = [
  rest.get('http://localhost:8080/api/forms', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
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
      ]),
    );
  }),
];
