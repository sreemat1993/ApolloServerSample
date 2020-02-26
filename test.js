const { createTestClient } = require('apollo-server-testing');
const { ApolloServer, gql } = require('apollo-server');

const books = [
    {
        title: 'Harry Potter and the Chamber of Secrets',
        author: 'J.K. Rowling',
    },
    {
        title: 'Jurassic Park',
        author: 'Michael Crichton',
    },
];
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;
const resolvers = {
    Query: {
        books: (parent, args, context, info) => {
            return books;
        },
    },
};
const GET_BOOKS = gql`
query {
    books {
      title
      author
    }
  }
`;

describe('Queries', () => {
    it('Get the lists of books', async () => {
        const server = new ApolloServer({
            typeDefs,
            resolvers
        });
        const { query } = createTestClient(server);
        const res = await query({ query: GET_BOOKS });
        expect(res).toMatchSnapshot();
    });
})
