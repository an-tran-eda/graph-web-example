import ApolloClient, {
  HttpLink,
  InMemoryCache,
} from 'apollo-boost';

const cache = new InMemoryCache();
const httpLink = new HttpLink({
  uri: '/graphql',
});

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

const client = new ApolloClient({
  link: httpLink,
  cache,
  defaultOptions,
});

export default client;
