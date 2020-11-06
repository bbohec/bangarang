import "mocha"
import chai = require("chai");
import { FakeIdentityProvider } from "../../adapters/secondary/FakeIdentityProvider"
import { Ballot } from "../../core/ports/Ballot";
import { UserServiceProvider } from "../../core/serviceProviders/UserServiceProvider";
import { BallotServiceProvider } from "../../core/serviceProviders/BallotServiceProvider";
import { FakeBallotRepositoryInteractor } from "../../adapters/secondary/FakeBallotProvider";
import { userDontExist } from "../../core/ports/Errors";
const expect = chai.expect;
describe(`=====================
Feature : Register individual as User.
    As an individual,
    In order to be a user identified in Bangarang,
    I must suscribe to the service.
=====================`, () => {
    describe(`Scenario: Suscribe as a new user.`, () => {
        const individualIdentifier = "John Doe"
        const userServiceProvider = new UserServiceProvider(new FakeIdentityProvider([]),new BallotServiceProvider(new FakeBallotRepositoryInteractor([])))
        it(`Given the individual identified by '${individualIdentifier}' don't exist on user service provider.'`, () => {
            expect(()=>userServiceProvider.retreiveIndividual(individualIdentifier).individual.identifier).to.throw(userDontExist(individualIdentifier))
        })
        it(`When the individual identified by '${individualIdentifier}' subscribe to the service.'`, (done) => {
            userServiceProvider.suscribeIndividual(individualIdentifier)
            done()
        })
        it(`Then the individual identified by '${individualIdentifier}' exist on user service provider.'`, () => {
            const userServiceProvider = new UserServiceProvider(new FakeIdentityProvider([{identifier:individualIdentifier}]),new BallotServiceProvider(new FakeBallotRepositoryInteractor([])))
            expect(userServiceProvider.retreiveIndividual(individualIdentifier).individual.identifier).equal(individualIdentifier)
        })
    })
    describe(`Scenario: Cannot suscribe. User already exist.`, () => {
        const individualIdentifier = "John Doe"
        const userServiceProvider = new UserServiceProvider(new FakeIdentityProvider([{identifier:individualIdentifier}]),new BallotServiceProvider(new FakeBallotRepositoryInteractor([])))
        it(`Given the individual identified by '${individualIdentifier}' exist on user service provider.'`, () => {
            expect(userServiceProvider.retreiveIndividual(individualIdentifier).individual.identifier).equal(individualIdentifier)
        })
        /*
        it(`When the individual identified by '${individualIdentifier}' subscribe to the service.'`, (done) => {
            userServiceProvider.suscribeIndividual(individualIdentifier)
            done()
        })
        it(`Then the individual identified by '${individualIdentifier}' exist on user service provider.'`, () => {
            const userServiceProvider = new UserServiceProvider(new FakeIdentityProvider([{identifier:individualIdentifier}]),new BallotServiceProvider(new FakeBallotRepositoryInteractor([])))
            expect(userServiceProvider.retreiveIndividual(individualIdentifier).individual.identifier).equal(individualIdentifier)
        })
        */
    })
})


