const xrpl = require('xrpl')

const { WALLET_SEED, METADATA_URL } = process.env

async function main() {
    // Connect to XRPL Testnet
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
    await client.connect()

    // Define wallet
    const wallet = xrpl.Wallet.fromSeed(WALLET_SEED)

    // Fetch current account info
    const account_info = await client.request({
        command: 'account_info',
        account: wallet.classicAddress
    })

    // Define sequence number
    const sequence = account_info.result.account_data.Sequence

    // Define the NFT details and point it to Arweave metadata
    const nftDetails = {
        TransactionType: "AccountSet",
        Account: wallet.classicAddress,
        Domain: METADATA_URL,
        Sequence: sequence,
        Fee: "12"
    }

    // Sign the transaction
    const signedTx = wallet.sign(nftDetails)

    // Submit the transaction
    const submit_response = await client.request({
        command: 'submit',
        tx_blob: signedTx.tx_blob
    })

    console.log(submit_response)

    // Always disconnect when you're done
    await client.disconnect()
}

main().catch(console.error)
