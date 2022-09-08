/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  P256SHA256Algorithm,
  P256SHA256AlgorithmInterface,
} from "../P256SHA256Algorithm";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "key",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "verify",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class P256SHA256Algorithm__factory {
  static readonly abi = _abi;
  static createInterface(): P256SHA256AlgorithmInterface {
    return new utils.Interface(_abi) as P256SHA256AlgorithmInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): P256SHA256Algorithm {
    return new Contract(address, _abi, signerOrProvider) as P256SHA256Algorithm;
  }
}
