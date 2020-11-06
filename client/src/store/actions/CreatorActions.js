import * as actionTypes from "./actionTypes";

export const updateCreator = (key, value) => {
    return {
      type: actionTypes.UPDATE_CREATOR,
      key: key,
      value: value,
    };
  };