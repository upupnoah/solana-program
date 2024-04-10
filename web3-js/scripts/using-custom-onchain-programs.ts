import * as web3 from '@solana/web3.js';
import { getKeypairFromEnvironment } from "@solana-developers/helpers"
import "dotenv/config"
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";

const connection = new web3.Connection("https://api.devnet.solana.com", "confirmed");

const programId = new web3.PublicKey("2Q8jfhmkftuvS8TVzpewskyVtroJZSJ856N6HGDdzFj1")
// const programDataAccount = new web3.PublicKey("2JVqELzPJFPkFXSmbbxNJtGVq4vryZoWrkFXJ5kNvppG")
const instructionData = Buffer.alloc(0); // Hello world 不需要数据
const instruction = new web3.TransactionInstruction({
    keys: [], // 如果合约函数需要，这里填入相应的账户信息
    programId,
    data: instructionData, // 指令数据
});

const transaction = new web3.Transaction().add(instruction)
const keypair = getKeypairFromEnvironment("SECRET_KEY")

const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [keypair],
);

console.log(`✅ Success! Transaction signature is: ${signature}`);