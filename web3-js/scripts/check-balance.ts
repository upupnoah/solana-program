// import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

// const publicKey = new PublicKey("<your public key>");

// const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// const balanceInLamports = await connection.getBalance(publicKey);

// const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

// console.log(
//     `💰 Finished! The balance for the wallet at address ${publicKey} is ${balanceInSOL}!`
// );


// pnpx esrun check-balance.ts <address>

// import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

// const suppliedPublicKey = process.argv[2];
// if (!suppliedPublicKey) {
//     throw new Error("Provide a public key to check the balance of!");
// }

// const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// const publicKey = new PublicKey(suppliedPublicKey);

// const balanceInLamports = await connection.getBalance(publicKey);

// const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

// console.log(
//     `✅ Finished! The balance for the wallet at address ${publicKey} is ${balanceInSOL}!`
// );


import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

// Famous Solana wallets - For demonstration, replace with actual public keys resolved from SNS
const famousWallets = {
    "toly.sol": "<TOLY_SOL_PUBLIC_KEY>",
    "shaq.sol": "<SHAQ_SOL_PUBLIC_KEY>",
    "mccann.sol": "<MCCANN_SOL_PUBLIC_KEY>"
};

const walletName = process.argv[2];
if (!walletName) {
    throw new Error("Provide a Solana wallet name to check the balance of!");
}

// Assuming you have a function to resolve SNS to PublicKey
// For demonstration, using the famousWallets mapping
const suppliedPublicKey = famousWallets[walletName];
if (!suppliedPublicKey) {
    throw new Error("Could not resolve the wallet name to a public key or invalid wallet name!");
}

const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

let publicKey: PublicKey;
try {
    publicKey = new PublicKey(suppliedPublicKey);
} catch (error) {
    console.error("Invalid wallet address provided:", error.message);
    process.exit(1); // Exit with error
}

const getBalance = async () => {
    try {
        const balanceInLamports = await connection.getBalance(publicKey);
        const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;
        console.log(
            `✅ Finished! The balance for the wallet at address ${publicKey} is ${balanceInSOL} SOL!`
        );
    } catch (error) {
        console.error("Failed to get the wallet balance:", error.message);
    }
};

getBalance();
