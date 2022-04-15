// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract CommunityPolls {
  uint public pollsCount = 0;
  struct Option {
    string option;
    uint votes;
  }
  struct Poll {
    uint id;
    address creator;
    string question;
    uint startTime;
    uint endTime;
  }

  mapping(uint => Poll) public pollIdToPoll;
  mapping(uint => Option[]) public pollIdToOptions;
  mapping(address => uint[]) public addressToVotedPolls;

  event PollCreated(uint id, address creator, string question, Option[] options);
  event PollVoted(uint id, address voter, uint optionIndex);

  function createPoll(string memory _question, uint _startTime, uint _endTime, Option[] memory _options) public {
    pollsCount++;
    Poll memory _poll = Poll({
      id: pollsCount,
      creator: msg.sender,
      question: _question,
      startTime: _startTime,
      endTime: _endTime
    });
    pollIdToPoll[pollsCount] = _poll;
    for(uint i = 0;i < _options.length;i++) {
      pollIdToOptions[pollsCount].push(_options[i]);
    }

    emit PollCreated(pollsCount, msg.sender, _question, _options);
  }

  function hasVoted(uint _pollId) private view returns (bool) {
    for (uint i = 0; i < addressToVotedPolls[msg.sender].length; i++) {
      if(addressToVotedPolls[msg.sender][i] == _pollId) {
        return true;
      }
    }
    return false;
  }

  function vote(uint _pollId, uint _optionIndex) public {
    
    //Poll must not be expired
    require(pollIdToPoll[_pollId].startTime <= block.timestamp && pollIdToPoll[_pollId].endTime >= block.timestamp);
    //Creator cannot vote own poll
    require(msg.sender != pollIdToPoll[_pollId].creator );
    //pollId must exist
    require(_pollId <= pollsCount);
    //optionIndex must exist
    require(_optionIndex < pollIdToOptions[_pollId].length);
    //Voter cannot vote same poll twice
    require(!hasVoted(_pollId));


    pollIdToOptions[_pollId][_optionIndex].votes++;
    addressToVotedPolls[msg.sender].push(_pollId);
    emit PollVoted(_pollId, msg.sender, _optionIndex);
  }

}
