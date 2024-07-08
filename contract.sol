// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DegreeRegistry {
    struct UserInfo {
        string name;
        string degreeName;
        uint256 timestamp; // Added timestamp field
    }

    mapping(bytes32 => UserInfo) public userInfos;
    mapping(address => bytes32[]) public userHashes; // Track hashes per user

    event UserRegistered(bytes32 indexed hash, string name, string degreeName, uint256 timestamp); // Updated event definition

    function register(string memory _name, string memory _degreeName) public returns (bytes32) {
        bytes32 uniqueHash = generateUniqueHash(_name, _degreeName, msg.sender);
        userInfos[uniqueHash] = UserInfo(_name, _degreeName, block.timestamp); // Store timestamp
        userHashes[msg.sender].push(uniqueHash); // Track hashes for the sender
        emit UserRegistered(uniqueHash, _name, _degreeName, block.timestamp); // Emit timestamp in event
        return uniqueHash; // Return the generated hash
    }

    function getUserInfo(bytes32 hash) public view returns (string memory, string memory, uint256) {
        UserInfo storage userInfo = userInfos[hash];
        return (userInfo.name, userInfo.degreeName, userInfo.timestamp);
    }

    function getUserHashes() public view returns (bytes32[] memory) {
        return userHashes[msg.sender];
    }

    function generateUniqueHash(string memory _name, string memory _degreeName, address sender) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(_name, _degreeName, block.timestamp, sender));
    }
}
