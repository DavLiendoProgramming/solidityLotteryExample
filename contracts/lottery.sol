// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Lottery {

    //State variables
    address public manager;
    address payable [] public players;

    //Constructor
    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        //Require to had sent ether to use this
        require(msg.value > 0.01 ether);
        players.push(payable(msg.sender));
    }

    //Return kind of random number, NOT SAFE, recommended to use oracle instead
    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function pickWinner() public onlyManager{

        uint index = random() % players.length;
        players[index].transfer(address(this).balance);
        //Reset lottery
        players = new address payable [](0);
    }

    //function modifier
    modifier onlyManager() {
        //Only manager can use this function
        require(msg.sender == manager);
        //Necesary to implement the function where it's called
        _;     
    }

    function allPlayers() public view  returns(address payable[] memory) {
        return players;
    }
}