const { ApolloServer, gql } = require('apollo-server-lambda')
var faunadb = require('faunadb'),
  q = faunadb.query;
require("dotenv").config()
const typeDefs = gql`
  type Query {
    bookmarks: [Bookmark!]!
  }
  type Bookmark {
    id: ID!
    title: String!
    url: String!
  }
  type Mutation {
    addBookmark(title: String!, url: String!): Bookmark!
    removeBookmark(id: ID!): Bookmark
  }
`

const resolvers = {
  Query: {
    bookmarks: async (root, args, context) => {
      try {
        var adminClient = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index('url-data'))),
            q.Lambda(x => q.Get(x))
          )
        )
        
        return result.data.map(d => {
          return {
            id: d.ref.id,
            title: d.data.title,
            url: d.data.url
          }
        })

      } catch (err) {
        console.log(err);
      }
    }
  },
  Mutation: {
    addBookmark: async (_, { title, url }) => {
      console.log(title, url)
      try {
        var adminClient = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

        const result = await adminClient.query(
          q.Create(
            q.Collection('links'),
            {
              data: {
                title,
                url
              }
            },
          )
        )
        return result.data.map((d) => {
          return {
            id: d.ref.id,
           title: d.data.title,
            url: d.data.url,
          };
        });
      }
      catch (err) {
        console.log(err)
      }
    },
    removeBookmark: async (_, { id }) => {
      try {
        var adminClient = new faunadb.Client({ secret: process.env.FAUNADB_SECRET  });

        const result = await adminClient.query(
          q.Delete(q.Ref(q.Collection("links"), id))
        );
       return {
          id: result.ref.id,
          title: result.data.title,
          url: result.data.url,
        };
      } catch (error) {
        console.log("Error in Deleting Data : ", error);
      }
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()