import { ApolloServer, gql, UserInputError } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";
import { ethers } from "ethers";
import { connect, NatsConnectionOptions, Payload } from "ts-nats";

import { getUser, getUsers, getSubbedTo } from "./getUsers";
import { dai } from "./utils";

let nc;

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
      nc.publish("chain.sub", { action: "test", payload: msg });
      nc.publish("chain.base", { action: "test", payload: msg });
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

async function natsConn() {
  try {
    nc = await connect({
      servers: [`${process.env.NATS}:4222`],
      payload: Payload.JSON,
    });

    nc.subscribe("chain.user", (err, msg) => {
      if (err) {
      } else {
        let data = msg.data;
        switch (data.action) {
          default:
            console.log(data);
            break;
        }
      }
    });
  } catch {
    console.log("NATS connection error");
  }
}

natsConn();
