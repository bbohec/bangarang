import "mocha"
import chai = require("chai");
const expect = chai.expect;
import { Bangarang } from "../../adapters/primary/Bangarang";
import { FakeIdentityProvider } from "../../adapters/secondary/FakeIdentityProvider"
import { FakeBallotRepositoryProvider } from "../../adapters/secondary/FakeBallotProvider";
import { userDontExist } from "../../core/ports/Errors";
import { individualAlreadySubscribed } from "../../core/ports/individualAlreadySubscribed";
describe(`=====================
Feature : Individual service subscription.
    As an individual,
    In order to be a user identified in Bangarang,
    I must suscribe to the service.
=====================`, () => {
    const individual = {identifier:"65465sd4f654sf",firstName:"John",lastName:"Doe",gifLink:""}
    describe(`Scenario: Suscribe as a new user.`, () => {
        const bangarang = new Bangarang(new FakeIdentityProvider([]),new FakeBallotRepositoryProvider([]))
        it(`Given the individual identified by '${individual.identifier}' don't exist on user service provider.`, () => {
            expect(()=>bangarang.userServiceProvider.retreiveUserByIdentifer(individual.identifier).individual.identifier).to.throw(userDontExist(individual.identifier))
        })
        it(`When the individual identified by '${individual.identifier}' subscribe to the service.`, (done) => {
            bangarang.userServiceProvider.suscribeIndividual(individual)
            done()
        })
        it(`Then the individual identified by '${individual.identifier}' exist on user service provider.`, () => {
            expect(bangarang.userServiceProvider.retreiveUserByIdentifer(individual.identifier).individual.identifier).equal(individual.identifier)
        })
    })
    describe(`Scenario: Cannot suscribe. User already exist.`, () => {
        const bangarang = new Bangarang(new FakeIdentityProvider([individual]),new FakeBallotRepositoryProvider([]))
        it(`Given the individual identified by '${individual.identifier}' exist on user service provider.`, () => {
            expect(bangarang.userServiceProvider.retreiveUserByIdentifer(individual.identifier).individual.identifier).equal(individual.identifier)
        })
        it(`When the individual identified by '${individual.identifier}' try to subscribe to the service, 
        then he receive an error message that inform him that he has already subscribed with the service.`, () => {
            expect(()=>bangarang.userServiceProvider.suscribeIndividual(individual)).to.throw(individualAlreadySubscribed)
        })
    })
})


