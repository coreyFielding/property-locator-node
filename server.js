import express from 'express';
import cors from 'cors'
import {ApolloServer, gql, makeExecutableSchema} from 'apollo-server-express'
import {typeDefs, resolvers} from './graphql/property/graphqlSchema'
import models from './postgres/models'
import { addToDb } from './app/helpers'
import {fetchProperties} from "./app/scraper";

const PORT = process.env.PORT || 5000;

const schema = makeExecutableSchema({typeDefs: gql(typeDefs), resolvers})
const server = new ApolloServer({
  schema,
  context: async ({req, connection}) => {
    if (connection) return {models}
  },
  onHealthCheck: () => {
    return new Promise((resolve, reject) => {
      true ? resolve() : reject()
    })
  }
})

const app = express()

app.use(cors())
server.applyMiddleware({app, path: '/graphql'})

const initialiseDb = () => addToDb()(fetchProperties())

models.sequelize.sync().then(async () => {
  await initialiseDb()

  app.listen(PORT, async() => {
    console.log(`Apollo Server on http://loclhost:${PORT}/graphql`)
  })
})