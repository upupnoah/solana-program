import * as web3 from '@solana/web3.js'
import * as token from '@solana/spl-token'

// SPL-tokens -> 代表Solana网络上所有 (非SOL）代币。无论是同质化代币（fungible tokens）还是非同质化代币（NFTs），在Solana上都被视为SPL-Tokens
// Token program -> 包含创建和与SPL-Tokens互动所需的指令
// Token Mints -> 存储关于特定代币的数据的账户，但不实际持有代币
// Token Accounts -> 用于持有特定Token Mint的代币

async function buildCreateMintTransaction(
    connection: web3.Connection,
    payer: web3.PublicKey,
    decimals: number
): Promise<web3.Transaction> {
    // connection.getMinimumBalanceForRentExemption(token.MINT_SIZE) // 更通用的方法
    const rent = await token.getMinimumBalanceForRentExemptMint(connection);
    const accountKeypair = web3.Keypair.generate();
    const programId = token.TOKEN_PROGRAM_ID

    // create 和 initialize mint 要在同一个 transaction 里面, 否则有可能让其他人接管您创建的账户并将其用于自己的铸币
    // create token-mint account
    const transaction = new web3.Transaction().add(
        // 用我们generate 出来的 keypair 的 pubkey, 来创建一个账户
        web3.SystemProgram.createAccount({
            fromPubkey: payer, // 传入的 payer 作为创建账户的发起者
            newAccountPubkey: accountKeypair.publicKey, // 新账户的 pubkey
            space: token.MINT_SIZE, // mint account 的大小
            lamports: rent, // 账户初始化中的租金豁免的一部分
            programId, // token program id
        }),
        // token mint 是一个特殊的账户，它存储了 token 的元数据，比如 mint 的所有者，decimals，以及其他的一些信息
        // init token-mint account
        // 使用上面的新账户来初始化 新的 token 账户
        token.createInitializeMintInstruction(
            accountKeypair.publicKey, // new account's pubkey
            decimals,
            payer, // 传入的 payer 作为 mint 的所有者
            payer, // 传入的 payer 作为 freeze 的所有者
            programId // token program id
        )
    );
    return transaction
}

// 创建 token account, 用来保存特定发行源（mint）发行的代币，并且为这些代币指定了一个所有者
// const tokenAccount = await token.createAccount(
//     connection,
//     payer,
//     mint, // 代币的发行源地址，它决定了令牌账户将持有哪种代币
//     owner, // 令牌账户的所有者，只有这个所有者可以授权减少账户的代币余额
//     keypair // 创建账户的密钥对，通常用于为新账户签名和提供安全性
// );


// 创建关联的 token 账户，用于存储特定 mint 的代币，并且为这些代币指定一个所有者
// const associatedTokenAccount = await token.createAssociatedTokenAccount(
//     connection, // 连接到 solana 网络的连接对象
//     payer, // 用于支付创建账户的费用
//     mint, // 代币的发行源地址，它决定了令牌账户将持有哪种代币
//     owner, // 令牌账户的所有者，只有这个所有者可以授权减少账户的代币余额
// );

// 没有则创建，有则获取
// const associatedTokenAccount = await token.getOrCreateAssociatedTokenAccount(
//     connection, // 连接到 solana 网络的连接对象
//     payer, // 用于支付创建账户的费用
//     mint, // 代币的发行源地址，它决定了令牌账户将持有哪种代币
//     owner, // 令牌账户的所有者，只有这个所有者可以授权减少账户的代币余额
// );


// 创建关联的 token 账户
async function buildCreateAssociatedTokenAccountTransaction(
    payer: web3.PublicKey,
    mint: web3.PublicKey
): Promise<web3.Transaction> {
    const associatedTokenAddress = await token.getAssociatedTokenAddress(mint, payer, false);

    const transaction = new web3.Transaction().add(
        token.createAssociatedTokenAccountInstruction(
            payer,
            associatedTokenAddress,
            payer,
            mint
        )
    )

    return transaction
}


// const transactionSignature = await token.mintTo(
//     connection,
//     payer,
//     mint,
//     destination,
//     authority,
//     amount
// );

// mint 代币
async function buildMintToTransaction(
    authority: web3.PublicKey,
    mint: web3.PublicKey,
    amount: number,
    destination: web3.PublicKey
): Promise<web3.Transaction> {
    const transaction = new web3.Transaction().add(
        token.createMintToInstruction(
            mint,
            destination,
            authority,
            amount
        )
    )

    return transaction
}


// transfer
// const transactionSignature = await token.transfer(
//     connection,
//     payer,
//     source, // 代币的来源地址
//     destination, // 代币的目标地址
//     owner,
//     amount
// )

// transfer 底层实现
async function buildTransferTransaction(
    source: web3.PublicKey,
    destination: web3.PublicKey,
    owner: web3.PublicKey,
    amount: number
): Promise<web3.Transaction> {
    const transaction = new web3.Transaction().add(
        token.createTransferInstruction(
            source,
            destination,
            owner,
            amount,
        )
    )

    return transaction
}

// burn
// const transactionSignature = await token.burn(
//     connection,
//     payer,
//     account,
//     mint,
//     owner,
//     amount
// )

// burn 底层
async function buildBurnTransaction(
    account: web3.PublicKey,
    mint: web3.PublicKey,
    owner: web3.PublicKey,
    amount: number
): Promise<web3.Transaction> {
    const transaction = new web3.Transaction().add(
        token.createBurnInstruction(
            account,
            mint,
            owner,
            amount
        )
    )
    return transaction
}

// Approve Delegate 批准代理(委托)
// const transactionSignature = await token.approve(
//     connection,
//     payer,
//     account,
//     delegate,
//     owner, // token账户的所有者账户
//     amount, //  委托账户可以transfer或burn的最大代币数量
// )

// import * as web3 from '@solana/web3'
// import * as token from '@solana/spl-token'
async function buildApproveTransaction(
    account: web3.PublicKey,
    delegate: web3.PublicKey,
    owner: web3.PublicKey,
    amount: number
): Promise<web3.Transaction> {
    const transaction = new web3.Transaction().add(
        token.createApproveInstruction(
            account,
            delegate,
            owner,
            amount
        )
    )

    return transaction
}

// Revoke Delegate 撤销代理
// const transactionSignature = await token.revoke(
//     connection,
//     payer,
//     account,
//     owner,
// )

// 底层实现, 实际使用的时候用上面的方法
// import * as web3 from '@solana/web3'
// import * as token from '@solana/spl-token'
async function buildRevokeTransaction(
    account: web3.PublicKey,
    owner: web3.PublicKey,
): Promise<web3.Transaction> {
    const transaction = new web3.Transaction().add(
        token.createRevokeInstruction(
            account,
            owner,
        )
    )
    return transaction
}