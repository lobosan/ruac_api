export default `
type Post {
  _id: ID!
  name: String!
}

type User {
  _id: ID!
  username: String!
  email: String!
}

type Query {
  post(_id: ID!): Post
  allPosts: [Post]
  loggedInUser: User
  allUsers: [User!]!
}

type Mutation {
  createPost(name: String!): Post
  signup(username: String!, email: String!, password: String!): User!
  login(email: String!, password: String!): String!
}
`
