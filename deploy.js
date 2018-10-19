const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  'hundred damp puppy question dance hope ecology copy wealth trigger monster few',
  'https://rinkeby.infura.io/v3/c58307de419b44e2a42cd272d47a08e3'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  // Returns an instance of the contract we deployed
  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['Hi there!'] })
    // Important to set gasLimit (21000 is generally the minimum);
    // was not mentioned in Grider's tutorial
    .send({ from: accounts[0], gas: '1000000', gasLimit: '21000' });

  console.log('Contract deployed to', result.options.address);
};

deploy();

// 0x5340c4Dd423687008ba0F1fF57731337eeaaa25E
