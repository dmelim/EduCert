var contract = undefined;
var customProvider = undefined;
var address = "0x5ac78270Cf1CA51Ffe5df7C30b69b099A9ceB8fC";
var abi = undefined;

function notary_init () {
    if (typeof web3 !== 'undefined') {
        // Use existing gateway
        window.web3 = new Web3(web3.currentProvider);
    } else {
        alert("No Ethereum interface injected into browser. Read-only access");
    }

        ethereum.enable()
    .then(function (accounts) {
    // You now have an array of accounts!
    // Currently only ever one:
    // ['0xFDEa65C8e26263F6d9A1B5de9555D2931A33b825']
    })
    .catch(function (error) {
    // Handle error. Likely the user rejected the login
    console.error(error)
    })

    abi = [
        {
            "constant": false,
            "inputs": [
                {
                    "name": "hash",
                    "type": "bytes32"
                }
            ],
            "name": "addDocHash",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
          "constant": true,
          "inputs": [
              {
                  "name": "hash",
                  "type": "bytes32"
              }
          ],
          "name": "findDocHash",
          "outputs": [
              {
                  "name": "",
                  "type": "uint256"
              },
              {
                  "name": "",
                  "type": "uint256"
              },
              {
                  "name": "",
                  "type": "address"
              }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        }
    ];

    contract = new web3.eth.Contract(abi, address);

};

//sends a hash to the blockchain
function notary_send (hash, callback) {
    web3.eth.getAccounts(function (error, accounts) {
        contract.methods.addDocHash(hash).send({
            from: accounts[0]
        },function(error, tx) {
            if (error) callback(error, null);
            else callback(null, tx);
        });
    });
};

//looks up a hash on the blockchain
function notary_find (hash, callback) {
    contract.methods.findDocHash(hash).call(function (error, result) {
        if (error) callback(error, null);
        else {
            let resultObj = {
                mineTime:  new Date(result[0] * 1000),
                blockNumber: result[1],
                messageSender: result[2]
            }
            callback(null, resultObj);
        }
    });
};
