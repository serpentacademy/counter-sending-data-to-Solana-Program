import * as borsh from 'borsh';
import * as web3 from "@solana/web3.js";
const BN = require("bn.js");
/**
 * The public key of the account we are saying hello to
 */
 let greetedPubkey: web3.PublicKey;
 /**
 * The state of a greeting account managed by the hello world program
 */
class GreetingAccount {
    counter = 0;
    constructor(fields: {counter: number} | undefined = undefined) {
      if (fields) {
        this.counter = fields.counter;
      }
    }
  }

  /**
 * Borsh schema definition for greeting accounts
 */
const GreetingSchema = new Map([
    [GreetingAccount, {kind: 'struct', fields: [['counter', 'u64']]}],
  ]);
  
  /**
   * The expected size of each greeting account.
   */
  const GREETING_SIZE = borsh.serialize(
    GreetingSchema,
    new GreetingAccount(),
  ).length;

 

const connection = new web3.Connection(web3.clusterApiUrl("devnet"));

async function main(){
     const key: Uint8Array = Uint8Array.from(["YOUR PRIVATE KEY"]);


        const data_to_send: Buffer = Buffer.from(
            
            Uint8Array.of(0, ...new BN(10).toArray("le", 8)
            
            ));

             const data_b = borsh.serialize(
              GreetingSchema,
              new GreetingAccount(),
            )
            const data: Buffer = Buffer.from(data_b);
        const signer: web3.Keypair = web3.Keypair.fromSecretKey(key);
        let programId: web3.PublicKey = new web3.PublicKey("CW6tJkuhLoWmtaemiAfVqeRJnMLvYT3aig88H6KtySf6");
     
          // Derive the address (public key) of a greeting account from the program so that it's easy to find later.
   
   //first create account with seed then refer with Public Key
          const GREETING_SEED = 'hello 33';
  //  greetedPubkey = await web3.PublicKey.createWithSeed(
  //    signer.publicKey,
  //    GREETING_SEED,
  //    programId,
  //  );
   
  greetedPubkey = new web3.PublicKey("3DEvWYH8fg1fMtqUSrW5jiVumx7XNC7sgcHiXEkyQEAY");


   let fees = 0;
 
 

   const lamports = await connection.getMinimumBalanceForRentExemption(
    GREETING_SIZE,
  );
 

//This creteAccount with Seed  only first time    
   const transaction = new web3.Transaction()

  //  .add(
  //   web3.SystemProgram.createAccountWithSeed({
  //     fromPubkey: signer.publicKey,
  //     basePubkey: signer.publicKey,
  //     seed: GREETING_SEED,
  //     newAccountPubkey: greetedPubkey,
  //     lamports,
  //     space: GREETING_SIZE,
  //     programId,
  //   }),
  // );


//programId = greetedPubkey;
  transaction.add(
    new web3.TransactionInstruction({
        keys: [
          {pubkey: greetedPubkey, isSigner: false, isWritable: true}],
            programId,
        data: data_to_send
        
        
    })
);
// const transaction = new web3.Transaction().add(
//   new web3.TransactionInstruction({
//       keys: [{
//         "pubkey": signer.publicKey
//         ,
//         "isSigner": true,
//         "isWritable": true
//          }],
//       programId,
//       data
      
      
//   })
// );

await web3
.sendAndConfirmTransaction(connection, transaction, [signer])
.then((sig)=> {
  console.log("sig: {}", sig);
});
reportGreetings();
    

    }
     async function reportGreetings(): Promise<void> {
        const accountInfo = await connection.getAccountInfo(greetedPubkey);
        if (accountInfo === null) {
          throw 'Error: cannot find the greeted account';
        }
        const greeting = borsh.deserialize(
          GreetingSchema,
          GreetingAccount,
          accountInfo.data,
        );
        console.log(
          greetedPubkey.toBase58(),
          'has been greeted',
          Number(greeting.counter),
          'time(s)',
        );
      }

    main();
