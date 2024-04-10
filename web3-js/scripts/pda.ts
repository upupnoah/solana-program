import * as borsh from '@coral-xyz/borsh'
import * as web3 from '@solana/web3.js'
import { getKeypairFromEnvironment } from "@solana-developers/helpers"
import "dotenv/config"

const payer = getKeypairFromEnvironment("SECRET_KEY")
const programId = new web3.PublicKey('test')

// 通过用户公钥 和 program 的 id 来生成 pda, 存储数据
const [pda, bump] = web3.PublicKey.findProgramAddressSync(
    [
        payer.publicKey.toBuffer()
    ],
    programId
)

// 通过用户公钥 和 其他种子 和 program 的 id 来生成 pda, 生成更多的 pda
const [pda1, bump1] = web3.PublicKey.findProgramAddressSync(
    [
        payer.publicKey.toBuffer(),
        Buffer.from("Shopping list")
    ],
    programId
);

// Getting Multiple Program Accounts
const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
// 返回一个对象数组，每个对象都有一个pubkey属性，表示账户的公钥，以及一个类型为 AccountInfo的account 属性
const accounts = connection.getProgramAccounts(programId).then(accounts => {
    accounts.map(({ pubkey, account }) => {
        console.log('Account:', pubkey)
        console.log('Data buffer:', account.data)
    })
})

// Deserializing program data
// 需要知道数据的结构
const borshAccountSchema = borsh.struct([
    borsh.bool("initialized"),
    borsh.u16("playerId"),
    borsh.str("name"),
]);
const buffer = Buffer.alloc(1000)
const { playerId, name } = borshAccountSchema.decode(buffer);


export class Movie {
    title: string;
    rating: number;
    description: string;

    constructor(title: string, rating: number, description: string) {
        this.title = title
        this.rating = rating
        this.description = description
    }

    static borshAccountSchema = borsh.struct([
        borsh.bool('initialized'),
        borsh.u8('rating'),
        borsh.str('title'),
        borsh.str('description'),
    ])

    // 创建反序列化数据
    static deserialize(buffer?: Buffer): Movie | null {
        if (!buffer) {
            return null
        }

        try {
            const { title, rating, description } = this.borshAccountSchema.decode(buffer)
            return new Movie(title, rating, description)
        } catch (error) {
            console.log('Deserialization error:', error)
            return null
        }
    }
}

// 获取电影评论账户
// https://www.soldev.app/course/deserialize-custom-data