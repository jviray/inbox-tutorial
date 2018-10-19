const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile')

let accounts;
let inbox;
const INITIAL_MSG = 'Hi there';

beforeEach(async () => {
  // Gets a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use on of the accounts to deploy the contrat
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [INITIAL_MSG] })
    // actually deploys the contract through a transaction on the test net
    .send({ from: accounts[0], gas: '1000000' });

  inbox.setProvider(provider);
});

describe('Inbox', () => {
  it('it deploys a contract', () => {
    // Presence of an address indicates successful deployment to local test net
    assert.ok(inbox.options.address); // test for any "truthy" value (not undefined)
  });

  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INITIAL_MSG);
  });

  it('can change the message', async () => {
    // Rather than returning a string as you might expect, it returns txHash!
    await inbox.methods.setMessage('bye').send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, 'bye');
  });
});
