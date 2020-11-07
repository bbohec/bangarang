import "mocha"
import chai = require("chai");
const expect = chai.expect;
import { Bangarang } from "../../adapters/primary/Bangarang";
import { FakeIdentityProvider } from "../../adapters/secondary/FakeIdentityProvider"
import { FakeBallotRepositoryInteractor } from "../../adapters/secondary/FakeBallotProvider";
import { userDontExist } from "../../core/ports/Errors";
import { individualAlreadySubscribed } from "../../core/ports/individualAlreadySubscribed";
describe(`=====================
Feature : Individual service subscription.
    As an individual,
    In order to be a user identified in Bangarang,
    I must suscribe to the service.
=====================`, () => {
    describe(`Scenario: Suscribe as a new user.`, () => {
        const individualIdentifier = "John Doe"
        const bangarang = new Bangarang(new FakeIdentityProvider([]),new FakeBallotRepositoryInteractor([]))
        it(`Given the individual identified by '${individualIdentifier}' don't exist on user service provider.`, () => {
            expect(()=>bangarang.userServiceProvider.retreiveIndividual(individualIdentifier).individual.identifier).to.throw(userDontExist(individualIdentifier))
        })
        it(`When the individual identified by '${individualIdentifier}' subscribe to the service.`, (done) => {
            bangarang.userServiceProvider.suscribeIndividual(individualIdentifier)
            done()
        })
        it(`Then the individual identified by '${individualIdentifier}' exist on user service provider.`, () => {
            expect(bangarang.userServiceProvider.retreiveIndividual(individualIdentifier).individual.identifier).equal(individualIdentifier)
        })
    })
    describe(`Scenario: Cannot suscribe. User already exist.`, () => {
        const individualIdentifier = "John Doe"
        const bangarang = new Bangarang(new FakeIdentityProvider([{identifier:individualIdentifier}]),new FakeBallotRepositoryInteractor([]))
        it(`Given the individual identified by '${individualIdentifier}' exist on user service provider.`, () => {
            expect(bangarang.userServiceProvider.retreiveIndividual(individualIdentifier).individual.identifier).equal(individualIdentifier)
        })
        it(`When the individual identified by '${individualIdentifier}' try to subscribe to the service, 
        then he receive an error message that inform him that he has already subscribed with the service.`, () => {
            expect(()=>bangarang.userServiceProvider.suscribeIndividual(individualIdentifier)).to.throw(individualAlreadySubscribed)
        })
    })
})


