const { GraphQLServer } = require('graphql-yoga');

//defines your GraphQL schema
const typeDefs = `
type Query {
    info : String!
}
`
//implementation of the GraphQL schema
const resolvers = {
    Query:{
        info: () => `this is the API of a hackernews Clone`
    }
}

const server  = new GraphQLServer({
    typeDefs, 
    resolvers
})

server.start(()=> console.log(`Server is running on http://localhost:4000`));