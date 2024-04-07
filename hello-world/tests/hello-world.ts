import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { HelloWorld } from "../target/types/hello_world";

describe("hello-world", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.HelloWorld as Program<HelloWorld>;
  it("Is initialized!", async () => {
    // Add your test here.

    console.log(program.programId.toString()); // program id
    const txHash = await program.methods.hello().rpc(); // call the hello method with rpc
    console.log("Your transaction signature", txHash);
  });

});
