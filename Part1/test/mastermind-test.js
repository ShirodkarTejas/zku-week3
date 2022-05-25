//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected

const chai = require("chai");
const hardhat = require("hardhat");
const path = require("path");
const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const wasm_tester = require("circom_tester").wasm;
const buildPoseidon = require("circomlibjs").buildPoseidon;

const assert = chai.assert;

describe("Mastermind Variation", function ()  {

    this.timeout(100000);

    it("Verify success", async () => {
        const poseidon = await buildPoseidon();
        const F = poseidon.F;
        const circuit = await wasm_tester("contracts/circuits/MasterMindVariation.circom");

        const pubSolnHash = poseidon([16, 2, 4, 8]);
        //console.log(pubSolnHash.toString());
        const INPUT = {
            "pubGuessA": 2,
            "pubGuessB": 4,
            "pubGuessC": 8,
            "pubNumHit": 3,
            "pubNumBlow": 0,
            "pubSolnHash": F.toObject(pubSolnHash),
            "privSolnA": 2,
            "privSolnB": 4,
            "privSolnC": 8,
            "privSalt": 16,
        }

        const witness = await circuit.calculateWitness(INPUT, true);


        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(F.toObject(pubSolnHash))));
    });

}); 