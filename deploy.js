const HDWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3')


//Getting Compiled contract
const contract  = require('./compile.js')

//Getting the abi interface and the bytecode of the contract
const abi = contract['inbox.sol'].inbox.abi
const bytecode = contract['inbox.sol'].inbox.evm.bytecode.object

console.log(process.env.METAMASK_MNEMONIC);
//Setting up provider
const provider = new HDWalletProvider(
    'lizard peanut valve oxygen vacant other oyster inject distance tumble beauty patch',
    'https://rinkeby.infura.io/v3/8173bc023d8f45e595df4f3fb55db36e'
)
const web3 = new Web3(provider)


const deploy = async () => {
    const accounts = await web3.eth.getAccounts()

    console.log('Attempting to deploy from account get account: ', accounts[0]);

    //Attempting to deploy 
    const result = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode })
        // .estimateGas({from: accounts[0]})
        .send({ from: accounts[0], gas: '1000000'})
        console.log('Contract has been deployed', result.options.address);
}

deploy()