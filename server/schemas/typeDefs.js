const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
    _id: ID
    username: String
    email: String
    bookCount: int
    savedBooks: [Book]!
}

type Book {
    bookId: String
    authors: [String]!
    description: String
    title: String
    image: String
    link: String
}

type Auth {
    token: ID!
    user: User
}

type Query {
    me: User
}

input BookContent {
    bookId: String
    authors: [String]!
    description: String
    title: String
    image: String
    link: String
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(Book: BookContent!): User
    removeBook(BookId: String!): User
}

`;

module.exports = typeDefs;