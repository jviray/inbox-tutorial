pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;

    function Lottery() public {
        manager = msg.sender;
    }

    modifier onlyManager() {
        require(msg.sender == manager);
        _;
    }

    function enter() public payable {
        require(msg.value > .01 ether);

        players.push(msg.sender);
    }

    // Only manager should be able to pick winner; use modifier
    function pickWinner() public onlyManager {
        // Note:_random() is being called by this contract, not msg.sender
        uint index = _random() % players.length;

        // Note: Addresses are object with a set of methods
        // Trasnfers ETH from current contract to the address calling the method
        players[index].transfer(this.balance);

        // Re-assigns players with a dynamic address array w/ a length of 0
        players = new address[](0);
    }

    function getPlayers() public view returns (address[]) {
        return players;
    }

    function _random() private view returns (uint) {
      return uint(keccak256(block.difficulty, now, players));
    }
}
