// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import "hardhat/types/artifacts";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";

import { Ballot$Type } from "./Ballot";

declare module "hardhat/types/artifacts" {
  interface ArtifactsMap {
    ["Ballot"]: Ballot$Type;
    ["contracts/Ballot.sol:Ballot"]: Ballot$Type;
  }

  interface ContractTypesMap {
    ["Ballot"]: GetContractReturnType<Ballot$Type["abi"]>;
    ["contracts/Ballot.sol:Ballot"]: GetContractReturnType<Ballot$Type["abi"]>;
  }
}