const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date scalar type',
  parseValue(value: number) {
    return new Date(value);
  },
  serialize(value: Date) {
    return value.getTime();
  },
  parseLiteral(ast: any) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return null;
  },
});

export default dateScalar
