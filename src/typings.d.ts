import { GraphQLFieldResolver } from 'graphql';

export interface ApolloGuard<TSource, TContext, TArgs = undefined> {
  (next: GraphQLFieldResolver<TSource, TContext, TArgs>): GraphQLFieldResolver<
    TSource,
    TContext,
    TArgs
  >;
}

// export interface MutationResolver<Args, ReturnType> {
// TODO
// (parent: null, args: Args, context: )
// }
