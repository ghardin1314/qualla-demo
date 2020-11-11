import Contract from "../models/contract";
import User from "../models/user";
import Tier from "../models/tier";
import {UserInputError} from "apollo-server";
import {ethers} from "ethers";
import {getContract, getContracts} from "../datasources/contractData";
import {provider, acount, dai, factory, account} from "../web3";
import merge from "lodash.merge";
import mongoose from "mongoose";

const resolver = {
  Query: {
    contracts: async () => {
      // Pull from graph protocol
      let contracts = await getContracts();
      let ids = contracts.map(({id}) => id);

      // Pull from local data
      let _contracts = await Contract.find()
        .where("_id")
        .in(ids)
        .populate("publisher");

      // Stitch
      contracts = merge(contracts, _contracts);

      return contracts;
    },
    contract: async (_, args) => {
      // finds contract by address of publisher

      // Pull from graph protocol
      let contract = await getContract(args.id.toLowerCase());
      if (!contract) {
        return contract;
      }

      // Pull from local data
      let _contract = await Contract.findById(contract.id.toLowerCase())
        .populate("publisher")
        .exec();

      // Stitch
      if (_contract) {
        contract = merge(contract, _contract);
      }

      return contract;
    },
  },
  Mutation: {
    createContract: async (_, args) => {
      // Check if user has contract

      let contract = await getContract(args.publisher.toLowerCase());
      // let contract = null;

      if (contract) {
        throw new UserInputError("User already has contract", {
          invalidArgs: Object.keys(args),
        });
      }

      let values = [];
      for (var i = 0; i < args.tiers.length; i++) {
        values.push(
          ethers.constants.WeiPerEther.mul(args.tiers[i].value).toString()
        );
      }

      console.log(values[0].toString());

      try {
        await factory.createSubscription(args.publisher, [dai.address], values);

        // Not sure if there is a better way to get the address.
        var address = await factory.getSubscription(
          args.publisher.toLowerCase()
        );

        let _contract = new Contract();
        _contract._id = address.toLowerCase();
        let _publisher = await User.findById(args.publisher).populate(
          "contract"
        );

        if (_publisher === null) {
          _publisher = await User.create({_id: args.publisher});
        }

        let tier;
        for (var j = 0; j < args.tiers.length; j++) {
          tier = new Tier();
          tier.id = mongoose.Types.ObjectId();
          tier.title = args.tiers[j].title;
          tier.value = args.tiers[j].value;
          tier.perks = args.tiers[j].perks;
          tier.save();
          _contract.tiers.push(tier);
        }

        _contract.publisher = _publisher;
        await _contract.save();
        _publisher.contract = _contract._id;
        await _publisher.save();

        contract = {};

        contract.id = address;
        contract.acceptedValues = values;
        contract.paymentTokens = [dai.address];
        contract.publisher = _publisher;
        contract.publisherNonce = 0;
        contract.subscribers = [];

        return contract;
      } catch (err) {
        console.log(err);
        return;
      }
    },
  },
};

module.exports = resolver;
