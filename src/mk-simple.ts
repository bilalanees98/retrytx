import {
  makeSTXTokenTransfer,
  broadcastTransaction,
  AnchorMode,
} from "@stacks/transactions";
import { StacksTestnet, StacksMainnet } from "@stacks/network";

void (async () => {
  // for mainnet, use `StacksMainnet()`
  const network = new StacksTestnet();

  const txOptions:any = {
    recipient: "ST2CG4QWVTJZKT5FEJ9G4PRG0KW84320NK00MNWNY",
    amount: 1n,
    senderKey:
      "b3753a219580ef47d12b32f46d2c475186dc085331298518a7751b2ca576687b",
    network,
    memo: "test memo",
    //nonce: 10n, // set a nonce manually if you don't want builder to fetch from a Stacks node
    //fee: 200n, // set a tx fee if you don't want the builder to estimate
    anchorMode: AnchorMode.Any,
  };

  const transaction = await makeSTXTokenTransfer(txOptions);
  console.log("before fee update:", transaction.auth.spendingCondition.fee);
  // transaction.setFee(transaction.auth.spendingCondition.fee + 200n);
  txOptions.fee = transaction.auth.spendingCondition.fee + 200n;
  const final_transaction = await makeSTXTokenTransfer(txOptions);

  console.log("after fee update", final_transaction.auth.spendingCondition.fee);

  const serializedTx = final_transaction.serialize().toString("hex");
  console.log("final tx: ", final_transaction);
  // broadcasting final_transaction to the specified network
  const broadcastResponse = await broadcastTransaction(
    final_transaction,
    network
  );
  const txId = broadcastResponse.txid;
  console.log(broadcastResponse);

  // to see the raw serialized tx
  // const serializedTx = transaction.serialize().toString("hex");
  console.log("original tx: ", transaction);
  // // broadcasting transaction to the specified network
  // const broadcastResponse = await broadcastTransaction(transaction, network);
  // const txId = broadcastResponse.txid;
  // console.log(broadcastResponse);
})();
