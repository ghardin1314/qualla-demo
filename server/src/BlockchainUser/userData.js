import {createApolloFetch} from "apollo-fetch";

const fetch = createApolloFetch({
  uri: process.env.GRAPH_URI,
});

const GET_USER = `
  query GetUser($id: String!) {
    user(id: $id) {
      id
      contract {
        id
      }
      subscriptions{
        id
      }
    }
  }
`;

export async function getUser(id) {
  const res = await fetch({
    query: GET_USER,
    variables: {id},
  });
  if (res.data.user) {
    return res.data.user;
  } else {
    return {id: id, contract: null};
  }
}

const GET_USERS = `
  query GetUsers {
    users {
      id
      contract {
        id
      }
      subscriptions{
        id
      }
    }
  }
`;

export async function getUsers() {
  const res = await fetch({
    query: GET_USERS,
  });
  return res.data.users;
}