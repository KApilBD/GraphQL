const { GraphQLServer } = require('graphql-yoga')

const typeDefs = `
  type Query {
    hello(name: String): String,
    greet(greet: String): String,
  }
`

const resolvers = {
  Query: {
    hello: (_, args) => `Hello ${args.name || 'World'}!`,
    greet: (_, args) => `${args.greet || 'Ohaio Gosiemush'}`,
  },
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log(`Server is running at http://localhost:4000`))
