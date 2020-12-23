import { ApolloServer, gql, UserInputError } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";
import { ethers } from "ethers";
import amqp from "amqplib/callback_api";

import { getUser, getUsers, getSubbedTo } from "./getUsers";
import { dai } from "./utils";

let _channel;
let exchange = "direct_services";

const typeDefs = gql`
  type Query {
    user(id: ID!): User
    users: [User!]
    userSubscribedTo(userID: ID!, creatorID: ID!): User
  }

  type Mutation {
    permit(userID: ID!, signature: String!, nonce: String!): Boolean!
    mintDai(userID: ID!, amt: String!): Boolean!
    testPub(msg: String!): Boolean!
  }

  type User @key(fields: "id") {
    id: ID!
    nonce: Float!
    baseTokens: [BaseToken!]
    subscriptions: [SubscriptionToken!]
    subscribers: [SubscriptionToken!]
  }

  extend type BaseToken @key(fields: "id") {
    id: ID! @external
  }

  extend type SubscriptionToken @key(fields: "id") {
    id: ID! @external
  }
`;

const resolvers = {
  Query: {
    user: async (_, { id }) => {
      return await getUser(id.toLowerCase());
    },
    users: async () => await getUsers(),
    userSubscribedTo: async (_, { userID, creatorID }) => {
      return await getSubbedTo(userID.toLowerCase(), creatorID.toLowerCase());
    },
  },
  Mutation: {
    permit: async (_, { userID, signature, nonce }) => {
      // check if already permitted

      signature = ethers.utils.splitSignature(signature);

      // console.log(signature);
      console.log(process.env.SUB_CONTRACT);
      console.log(userID);

      await dai.permit(
        userID,
        process.env.SUB_CONTRACT,
        0,
        0, // expiry
        true,
        signature.v,
        signature.r,
        signature.s
      );

      return true;
    },
    mintDai: async (_, { userID, amt }) => {
      const initBal = await dai.balanceOf(userID.toLowerCase());
      console.log(`Old balance: ${initBal}`);

      if (initBal < 3000000000000000000000) {
        await dai.mintTokens(userID.toLowerCase(), amt);
      } else {
        throw new UserInputError("Excessive funds, don't be greedy!", {
          invalidArgs: Object.keys(userID),
        });
      }

      return true;
    },
    testPub: async (_, { msg }) => {
      _channel.publish(exchange, "SubToken", Buffer.from(msg));
      _channel.publish(exchange, "BaseToken", Buffer.from(msg));
      console.log(" [x] Sent %s: '%s'", "SubToken", msg);
      console.log(" [x] Sent %s: '%s'", "BaseToken", msg);
      return true;
    },
  },
  User: {
    __resolveReference(user) {
      return getUser(user.id);
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

server.listen(4001).then(({ url }) => {
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

        channel.bindQueue(q.queue, exchange, "BlockUser");

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
