const fs = require('fs');
const path = require('path');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname,'contracts', 'lottery.sol');
const source = fs.readFileSync(lotteryPath, 'utf-8');

const input = {
    language: 'Solidity',
    sources: {
        'lottery.sol' : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
}; 
module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts;