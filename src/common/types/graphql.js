// @flow

export interface IGraphQLError {
  message: string;
}

export interface IGraphQLErrors {
  graphQLErrors: Array<IGraphQLError>;
}

export interface IGraphQLData<T> {
  [key: string]: T;
  loading: boolean;
}
