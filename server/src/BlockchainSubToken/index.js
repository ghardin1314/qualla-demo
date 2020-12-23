import { ApolloServer, gql, UserInputError } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";
import { ethers } from "ethers";
import amqp from "amqplib/callback_api";

import { getSubToken, getSubTokens, getSubbedTo } from "./getSubToken";
import { subscriptionV1 } from "./utils";

let _channel;
let exchange = "direct_services";

const typeDefs = gql`
  type Query {
    subscriptionToken(id: ID!): SubscriptionToken
    subscriptionTokens: [SubscriptionToken!]
  }

  type Mutation {
    unsubscribe(userID: ID!, tokenID: ID!, signature: String!): Boolean!
  }

  extend type User @key(fields: "id") {
    id: ID! @external
  }

  extend type BaseToken @key(fields: "id") {
    id: ID! @external
  }

  type SubscriptionToken @key(fields: "id") {
    id: ID!
    owner: User
    creator: User!
    nextWithdraw: String!
    baseToken: BaseToken
  }
`;

const resolvers = {
  Query: {
    subscriptionToken: async (_, { id }) => {
      return await getSubToken(id.toLowerCase());
    },
    subscriptionTokens: async () => await getSubTokens(),
    
  },
  Mutation: {
    unsubscribe: async (_, { userID, tokenID, signature }) => {
      signature = ethers.utils.splitSignature(signature);

      await subscriptionV1.unSubscribe(
        userID,
        tokenID,
        signature.v,
        signature.r,
        signature.s
      );

      return true;
    },
  },
  SubscriptionToken: {
    async __resolveReference(subscriptionToken) {
      return await getSubToken(subscriptionToken.id.toString());
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
});

server.listen(4003).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

amqp.connect("amqp://root:example@rabbitmq", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    channel.assertExchange(exchange, "direct", {
      durable: false,
    });

    channel.assertQueue(
      "",
      {
        exclusive: true,
      },
      function (error2, q) {
        if (error2) {
          throw error2;
        }
        console.log(" [*] Waiting for logs. To exit press CTRL+C");

        channel.bindQueue(q.queue, exchange, "SubToken");

        channel.consume(
          q.queue,
          function (msg) {
            console.log(
              " [x] %s: '%s'",
              msg.fields.routingKey,
              msg.content.toString()
            );
          },
          {
            noAck: true,
          }
        );
      }
    );

    _channel = channel;
  });
});
