const Arweave = require('arweave');
const fs = require('fs');

async function main() {
    // Initialize Arweave
    const arweave = Arweave.init({
        host: 'arweave.net',
        port: 443,
        protocol: 'https',
    });

    // Load your keyfile
    const keyfile = JSON.parse(fs.readFileSync('path/to/arweave-keyfile.json'));

    // Define metadata
    const metadata = {
        name: 'Your NFT Name',
        description: 'Description of your NFT',
        image: 'URL of your NFT Image',
        // Add more properties as needed
    };

    // Prepare transaction
    const transaction = await arweave.createTransaction({
        data: JSON.stringify(metadata),
    }, keyfile);

    // Add tags
    transaction.addTag('Content-Type', 'application/json');
    transaction.addTag('App-Name', 'XRPL-Metaphysical-NFT-SDK');
    transaction.addTag('App-Version', '1.0.0');

    // Sign transaction
    await arweave.transactions.sign(transaction, keyfile);

    // Submit transaction
    const response = await arweave.transactions.post(transaction);

    if (response.status === 200) {
        console.log(`Metadata has been uploaded to Arweave: https://arweave.net/${transaction.id}`);
    } else {
        console.error('Error uploading metadata', response);
    }
}

main().catch(console.error);
