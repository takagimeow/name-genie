import { rest } from 'msw';

export const handlers = [
  rest.get('/articles', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: [
          {
            id: "1",
            title: "Article 1",
            content: "Content 1"
          },
          {
            id: "2",
            title: "Article 2",
            content: "Content 2"
          },
          {
            id: "3",
            title: "Article 3",
            content: "Content 3"
          },
        ]
      })
    )
  })
]