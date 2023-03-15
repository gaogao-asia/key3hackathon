import { Dao } from "../types";
import {
  FrontierEvmEvent,
  // FrontierEvmCall,
} from "@subql/frontier-evm-processor";
import { BigNumber } from "ethers";

// Setup types from ABI
type DAOCreatedEventArgs = [BigNumber, string, string, boolean] & {
  daoID: BigNumber;
  name: string;
  metadataURI: string;
  isPrivate: boolean;
};

export async function handleDAOCreatedEvent(
  event: FrontierEvmEvent<DAOCreatedEventArgs>
): Promise<void> {
  const dao = Dao.create({
    id: event.args.daoID.toHexString(),
    daoID: event.args.daoID.toBigInt(),
    name: event.args.name,
    metadataURI: event.args.metadataURI,
    isPrivate: event.args.isPrivate,
    createdTxHash: event.transactionHash,
    createdAt: BigInt(event.blockTimestamp.getTime()),
    createdBlockHeight: BigInt(event.blockNumber),
  });

  await dao.save();
}

// type ApproveCallArgs = [string, BigNumber] & {
//   _spender: string;
//   _value: BigNumber;
// };
// export async function handleEvmCall(
//   event: FrontierEvmCall<ApproveCallArgs>
// ): Promise<void> {
//   const approval = Approval.create({
//     id: event.hash,
//     owner: event.from,
//     value: event.args._value.toBigInt(),
//     spender: event.args._spender,
//     contractAddress: event.to,
//   });

//   await approval.save();
// }
