const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb = require('faunadb'),
  q = faunadb.query;
const typeDefs = gql`
  type Query {
   bookmarks: [Bookmark!]
     }
  type Bookmark {
    id: ID!
    url: String!
    desc: String!
  }
  type Mutation {
    addBookMark(url: String!, desc: String!): Bookmark
  }
`

const authors = [
  { id: 1, url: 'https://web.facebook.com/', desc: "this is facebook url" },
  { id: 2, url: 'https://web.facebook.com/', desc: "this is facebook url" },
  { id: 3, url: 'https://web.facebook.com/', desc: "this is facebook url" },
]

const resolvers = {
  Query: {
       bookmarks: async (root, args, context) => {
         try {
          var client = new faunadb.Client({ secret: "fnAD7ju3HoACBxnjt89EuTIFaRVEKh8drVcN87Sl"});
          var result = await client.query(
            q.Map(
              q.Paginate(q.Match(q.Index("url"))),
              q.Lambda(x => q.Get(x))
            )
          )
           return result.data.map(d => {
             return{
               id: d.ts,
               url: d.data.url,
               desc: d.data.desc
             }
           })
         } catch (error) {
           console.log("error", error)
         }
    },
    
  },
  Mutation: {
    addBookMark: async (_, {url, desc}) => {
      console.log('url--desc', url, 'desc', desc);
      var client = new faunadb.Client({ secret: "fnAD7ju3HoACBxnjt89EuTIFaRVEKh8drVcN87Sl"});
      try {
        var result = await client.query(
          q.Create(
            q.Collection('links'),
            { data: { 
              url,
              desc
            } },
          )
        );
        console.log("Document Created and Inserted in Container: " + result.ref.id);
        return result.ref.data
      } 
      catch (error){
          console.log('Error: ');
          console.log(error);
      }
  

    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = server.createHandler()

module.exports = { handler }
