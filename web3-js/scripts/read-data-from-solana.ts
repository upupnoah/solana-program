// import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

// const connection = new Connection(clusterApiUrl("testnet"));
// const address = new PublicKey('2x1rzVKHDK7e9jfx4msFHfSQq1WRZLEpNFrvSfhXyjzW');
// const balance = await connection.getBalance(address);

// console.log(`The balance of the account at ${address} is ${balance} lamports`); 
// console.log(`✅ Finished!`)

import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
const address = new PublicKey('CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN');
const balance = await connection.getBalance(address);
const balanceInSol = balance / LAMPORTS_PER_SOL;

console.log(`The balance of the account at ${address} is ${balanceInSol} SOL`); 
console.log(`✅ Finished!`)