const { ApolloServer } = require("apollo-server");
const { ApolloGateway, LocalGraphQLDataSource } = require("@apollo/gateway");
const { buildFederatedSchema } = require("@apollo/federation");

const accounts = require('./services/accounts');
const inventory = require('./services/inventory');
const products = require('./services/products');
const reviews = require('./services/reviews');

const gateway = new ApolloGateway({
  localServiceList: [accounts, inventory, products, reviews],
  buildService: service => {
      return new LocalGraphQLDataSource(buildFederatedSchema([service]));
    },
});

(async () => {
  const { schema, executor } = await gateway.load();

  const server = new ApolloServer({ schema, executor });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();
