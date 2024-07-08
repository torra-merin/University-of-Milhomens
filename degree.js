    const contractAddress = '0x60178B17a568b906ADbB366dB5c66ADef6410cBe';
    const contractABI = [
{
"inputs": [
  {
    "internalType": "string",
    "name": "_name",
    "type": "string"
  },
  {
    "internalType": "string",
    "name": "_degreeName",
    "type": "string"
  }
],
"name": "register",
"outputs": [
  {
    "internalType": "bytes32",
    "name": "",
    "type": "bytes32"
  }
],
"stateMutability": "nonpayable",
"type": "function"
},
{
"anonymous": false,
"inputs": [
  {
    "indexed": true,
    "internalType": "bytes32",
    "name": "hash",
    "type": "bytes32"
  },
  {
    "indexed": false,
    "internalType": "string",
    "name": "name",
    "type": "string"
  },
  {
    "indexed": false,
    "internalType": "string",
    "name": "degreeName",
    "type": "string"
  },
  {
    "indexed": false,
    "internalType": "uint256",
    "name": "timestamp",
    "type": "uint256"
  }
],
"name": "UserRegistered",
"type": "event"
},
{
"inputs": [],
"name": "getUserHashes",
"outputs": [
  {
    "internalType": "bytes32[]",
    "name": "",
    "type": "bytes32[]"
  }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [
  {
    "internalType": "bytes32",
    "name": "hash",
    "type": "bytes32"
  }
],
"name": "getUserInfo",
"outputs": [
  {
    "internalType": "string",
    "name": "",
    "type": "string"
  },
  {
    "internalType": "string",
    "name": "",
    "type": "string"
  },
  {
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [
  {
    "internalType": "address",
    "name": "",
    "type": "address"
  },
  {
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }
],
"name": "userHashes",
"outputs": [
  {
    "internalType": "bytes32",
    "name": "",
    "type": "bytes32"
  }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [
  {
    "internalType": "bytes32",
    "name": "",
    "type": "bytes32"
  }
],
"name": "userInfos",
"outputs": [
  {
    "internalType": "string",
    "name": "name",
    "type": "string"
  },
  {
    "internalType": "string",
    "name": "degreeName",
    "type": "string"
  },
  {
    "internalType": "uint256",
    "name": "timestamp",
    "type": "uint256"
  }
],
"stateMutability": "view",
"type": "function"
}
];

    document.getElementById('privateDegree').addEventListener('change', function() {
        const seedContainer = document.getElementById('seedContainer');
        seedContainer.style.display = this.checked ? 'block' : 'none';
    });

    async function registerDegree(event) {
        event.preventDefault();

        if (window.ethereum) {
            try {
                await window.ethereum.enable();
                const web3 = new Web3(window.ethereum);
                const contract = new web3.eth.Contract(contractABI, contractAddress);

                let name = document.getElementById('name').value;
                let degreeName = document.getElementById('degreeName').value;
                const privateDegree = document.getElementById('privateDegree').checked;

                if (privateDegree) {
                    const seed = document.getElementById('seed').value;
                    name = CryptoJS.AES.encrypt(name, seed).toString();
                    degreeName = CryptoJS.AES.encrypt(degreeName, seed).toString();
                }

                const accounts = await web3.eth.getAccounts();
                const account = accounts[0];

                const transaction = await contract.methods.register(name, degreeName).send({ from: account });

                // Wait for the transaction receipt to ensure it's mined
                const receipt = await web3.eth.getTransactionReceipt(transaction.transactionHash);

                // Parse event logs to get hash
                const logs = receipt.logs;
                let hash = null;

                logs.forEach(log => {
                    if (log.topics.length > 0 && log.topics[0] === '0x' + web3.utils.sha3('UserRegistered(bytes32,string,string)').substring(2)) {
                        hash = log.topics[1]; // Assuming the hash is the second topic
                        console.log(hash);
                    }
                });

                if (!hash) {
                    throw new Error('Hash not found in event logs');
                }


                // Redirect after successful registration
                const seedcode = document.getElementById('seed').value;
                const seedParam = privateDegree ? `?seed=${seedcode}` : '';
                window.location.href = `/validate/#${hash}${seedParam}`;
            } catch (error) {
                console.error('Error registering degree:', error);
                alert('Error registering degree. See console for details.');
            }
        } else {
            alert('Please install MetaMask!');
        }
    }

    document.getElementById('degreeForm').addEventListener('submit', registerDegree);
