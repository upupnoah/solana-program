import { Connection, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL, sendAndConfirmTransaction } from '@solana/web3.js'
import { getKeypairFromEnvironment } from "@solana-developers/helpers"
import "dotenv/config"

const transaction = new Transaction()

const sender = new PublicKey("2x1rzVKHDK7e9jfx4msFHfSQq1WRZLEpNFrvSfhXyjzW")
const recipient = new PublicKey("HU4W3Ra2UMCsBGXRdveHQeLNVtPbNGLBDkvbAhVDEwXr")

const amount = 0.1

const sendSolInstruction = SystemProgram.transfer({
    fromPubkey: sender,
    toPubkey: recipient,
    lamports: LAMPORTS_PER_SOL * amount
})

transaction.add(sendSolInstruction)

const connection = new Connection("https://api.testnet.solana.com", "confirmed");
const keypair = getKeypairFromEnvironment("SECRET_KEY")
const signature = sendAndConfirmTransaction(
    connection,
    transaction,
    [keypair],
)

// await airdropIfRequired(
//     connection,
//     keypair.publicKey,
//     1 * LAMPORTS_PER_SOL,
//     0.5 * LAMPORTS_PER_SOL,
// );