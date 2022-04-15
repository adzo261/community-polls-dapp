

class ChainAccess {

    static setChainState(web3, address, contract) {
        ChainAccess.web3 = web3;
        ChainAccess.address = address;
        ChainAccess.contract = contract;
    }
    static setChainAddressState(address) {
        ChainAccess.address = address;
    }
    
    static async createPoll(question, startTime, endTime, options) {
        let response = await ChainAccess.contract.methods.createPoll(question,startTime, endTime, options)
            .send({from: this.address});
        return response;
    }

    static async getAllPolls() {
      
        let pollsCount = await ChainAccess.contract.methods.pollsCount().call();
        let polls = [];
        for (let pollId = 1; pollId <= pollsCount; pollId++) {
            const pollResp = await ChainAccess.contract.methods.pollIdToPoll(pollId).call();
            let poll = {
                id: pollId,
                address: pollResp.creator,
                question: pollResp.question,
                startTime: pollResp.startTime,
                endTime: pollResp.endTime,
                options: []
            }
            let allVotes = 0;
            for (let j = 0; j < 4; j++) {
                let optionResp = await ChainAccess.contract.methods.pollIdToOptions(pollId,j).call();
                poll.options.push({
                    option: optionResp.option,
                    votes: parseInt(optionResp.votes)
                });
                allVotes += parseInt(optionResp.votes);
            }
            
            poll.options = poll.options.map(option => {
                option.percentage = allVotes > 0 ? Math.round(option.votes / allVotes * 100) : 0;
                return option;
            })
            polls.push(poll);
        }
        return polls;
    }

    static async vote(pollId, optionIndex) {
        let response = await ChainAccess.contract.methods.vote(pollId, optionIndex)
            .send({from: this.address});
        return response;
    }
    

}


export default ChainAccess;