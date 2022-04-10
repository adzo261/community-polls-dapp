var CommunityPolls = artifacts.require("./CommunityPolls.sol");

module.exports = function(deployer) {
  deployer.deploy(CommunityPolls);
};
