import * as borsh from '@coral-xyz/borsh'
import * as web3 from '@solana/web3.js'
import { getKeypairFromEnvironment } from "@solana-developers/helpers"
import "dotenv/config"


// const equipPlayerSchema = borsh.struct([
//     borsh.u8('variant'),
//     borsh.u16('playerId'),
//     borsh.u256('itemId')
// ])

// const buffer = Buffer.alloc(1000)
// equipPlayerSchema.encode({ variant: 2, playerId: 1435, itemId: 737498 }, buffer)

// const instructionBuffer = buffer.slice(0, equipPlayerSchema.getSpan(buffer))

// const endpoint = web3.clusterApiUrl('devnet')
// const connection = new web3.Connection(endpoint)

// const player = getKeypairFromEnvironment("PLAYER")
// const playerInfoAccount = new web3.PublicKey('test')
// const PROGRAM_ID = new web3.PublicKey('test')

// const transaction = new web3.Transaction()
// const instruction = new web3.TransactionInstruction({
//     keys: [
//         {
//             pubkey: player.publicKey,
//             isSigner: true,
//             isWritable: false,
//         },
//         {
//             pubkey: playerInfoAccount,
//             isSigner: false,
//             isWritable: true,
//         },
//         {
//             pubkey: web3.SystemProgram.programId,
//             isSigner: false,
//             isWritable: false,
//         }
//     ],
//     data: instructionBuffer,
//     programId: PROGRAM_ID
// })

// transaction.add(instruction)

// web3.sendAndConfirmTransaction(connection, transaction, [player]).then((txid) => {
//     console.log(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`)
// })


export class Movie {
    title: string;
    rating: number;
    description: string;

    borshInstructionSchema = borsh.struct([
        borsh.u8('variant'), // 表示应该执行哪个指令
        borsh.str('title'),
        borsh.u8('rating'),
        borsh.str('description'),
    ])

    serialize(): Buffer {
        const buffer = Buffer.alloc(1000)
        this.borshInstructionSchema.encode({ ...this, variant: 0 }, buffer)
        return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer))
    }
}