import {
  binary__factory as BinaryOptionsFactory,
  BinaryOptions,
  DIAOracle,
  DIAOracle__factory as DIAOracleFactory,
} from "../typechain";

const { expect } = require("chai");
const { ethers } = require("hardhat");
const { SignerWithAddress } = require("ethers");

let boContract: BinaryOptions;
let binaryOptions: BinaryOptionsFactory;
let oracleContractFactory: DIAOracleFactory;
let oracleContract: DIAOracle;

let owner = SignerWithAddress;
let addr1 = SignerWithAddress;
let addr2 = SignerWithAddress;

describe("Testing oracle integration", function () {
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    oracleContractFactory = await ethers.getContractFactory("DIAOracle");
    oracleContract = await oracleContractFactory.deploy();

    await oracleContract.setValue("ASTR/USD", 23817709, 1649433703);

    binaryOptions = await ethers.getContractFactory("BinaryOptions");
    boContract = await binaryOptions.deploy(
      oracleContract.address,
      owner.address,
      addr2.address,
      10,
      120,
      0,
      0,
      1000,
      "ASTR/USD"
    );
  });

  it("Validate if oracle price is right", async function () {
    const rightPrice = 23817709;
    const [price] = await oracleContract.getValue("ASTR/USD");
    expect(price).to.equal(rightPrice);
  });

  it("Error whenever pair is doesn't exists", async function () {
    const [value, timestamp] = await oracleContract.getValue("XXXXX");

    expect(value).to.equal(0);
    expect(timestamp).to.equal(0);
  });

  it("Update oracle admin address", async function () {
    expect(oracleContract.updateOracleUpdaterAddress(addr1.address))
      .to.emit(oracleContract, "UpdaterAddressChange")
      .withArgs(addr1.address);
  });

  it("Read oracle price from contract", async function () {
    const rightPrice = 23817709;
    const [oraclePrice] = await oracleContract.getValue("ASTR/USD");
    const oracleAddress = await boContract.diaOracle();
    expect(rightPrice).to.equal(oraclePrice);
    expect(oracleAddress).to.equal(oracleContract.address);
  });
});
