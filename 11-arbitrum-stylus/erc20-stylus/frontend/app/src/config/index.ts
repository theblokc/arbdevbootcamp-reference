import { Contract, ContractRunner } from "ethers";
import abi from "./abi.json";
export function getContract(signer: ContractRunner) {
  return new Contract(
    "0xa04f6656eA6316c6c31050ab751c807CFFd6e2aa",
    abi,
    signer
  );
}
