const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");

const graphQlScheme = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql', 
  graphqlHTTP({
    schema: graphQlScheme,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
)

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.hpnls.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
.then(() => {
  console.log('Connected to the DB');
  app.listen(3000);
})
.catch(err => {
  console.log(err);
})