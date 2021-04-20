const Web3 = require('web3')
const ganache = require('ganache-cli')
const assert = require('assert')

//Setting up a provider for web3
const web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
const web3 = new Web3(web3Provider)

//Getting Compiled contract
const contract  = require('../compile.js')

//Getting the abi interface and the bytecode of the contract
const abi = contract['lottery.sol'].Lottery.abi
const bytecode = contract['lottery.sol'].Lottery.evm.bytecode.object

let accounts;
let lottery;
beforeEach(async () => {
    //Get accounts list provided by ganache 
    accounts = await web3.eth.getAccounts()

    //Contract instance
    lottery = await new web3.eth.Contract(abi)    
        .deploy({ data: bytecode })
        // .estimateGas({from: accounts[0]})
        .send({ from: accounts[0], gas: '1000000'})
})

describe('Lottery', () => {
    //Testing deployment
    it('deploys a contract', () => {
        assert.ok(lottery.options.address)
    })

    //Using a method
    it('allows one account to enter', async () =>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.allPlayers().call({
            from: accounts[0]
        })

        assert.equal(accounts[0], players[0])
        assert.equal(1, players.length)
    })
    //Using a method
    it('allows multiple account to enter', async () =>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        });
        
        const players = await lottery.methods.allPlayers().call({
            from: accounts[0]
        })

        assert.equal(accounts[0], players[0])
        assert.equal(accounts[1], players[1])
        assert.equal(accounts[2], players[2])
        assert.equal(3, players.length)
    })


    //Asserts for an error
    it('minimum amount required of enther  to enter ', async () => {
        try {
            //wrong
            //assert(false)
            assert.throw(async function() {
                await lottery.methods.enter().send({
                    from: accounts[0],
                    value: 0
                });
             },Error, 'Error was trown');
        } catch (error) {
            assert(error);
        }
    })

    //Testing function modifiers
    it('testes for only manager functions', async () => {
        try {
            assert.throw(async function() {
                await lottery.methods.pickWinner().call({
                    from: accounts[1]
                });
            }, Error, 'Error was thrown')
        } catch (error) {
            assert(error)
        }
    })

    it('sends money to the winner and resets the players array', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        })

        const initialBalance = await web3.eth.getBalance(accounts[0])

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        })

        const finalBalance = await web3.eth.getBalance(accounts[0])

        const difference = finalBalance - initialBalance
        console.log(difference);
        assert(difference >  web3.utils.toWei('1.8', 'ether'))
        
    })
})