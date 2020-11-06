import "mocha"
import chai = require("chai");
const expect = chai.expect;
import { FakeIdentityProvider } from "../../adapters/secondary/FakeIdentityProvider"
import { Ballot } from "../../core/ports/Ballot";
import { UserServiceProvider } from "../../core/serviceProviders/UserServiceProvider";
import { BallotServiceProvider } from "../../core/serviceProviders/BallotServiceProvider";
import { FakeBallotRepositoryInteractor } from "../../adapters/secondary/FakeBallotProvider";
describe(`=====================
Feature : Retreive Ballot
    As an individual,
    In order to vote about a subject,
    I can retreive the ballot about this subject.
=====================`, () => {
    describe(`Scenario: Retreive a ballot that doesn't exist`, () => {
        const subject = "US Presidentials 99999"
        const individualIdentifier = "user65563563453"
        const ballotFactory = new BallotServiceProvider(new FakeBallotRepositoryInteractor([]));
        const userServiceProvider = new UserServiceProvider(new FakeIdentityProvider([{identifier:"user65563563453"}]),ballotFactory)
        it(`Given the ballot with subject '${subject}' doesn't exist`, () => {
            expect(ballotFactory.isBallotExist(subject)).is.false
        })
        let ballot: Ballot;
        it(`When the individual identified by '${individualIdentifier}' want to retreive the ballot with the subject '${subject}'`, (done) => {
            const user = userServiceProvider.retreiveIndividual(individualIdentifier)
            expect(user.individual.identifier).equal(individualIdentifier)
            ballot = user.useCases.retreiveBallotBySubject(subject)
            done()
        })
        it(`Then the ballot with subject '${subject}' exist`, () => {
            expect(ballotFactory.isBallotExist(subject)).is.true
        })
        it(`And the retreived ballot subject is '${subject}'`, () => {
            expect(ballot.subject).equal(subject)
        })
    })
    /*
    describe(`Scenario: Retreive a ballot that doesn't exist`,() => {
        const subject = "US Presidentials 99999"
        const individualName = "Bob"
        it(`Given the ballot with subject '${subject}' doesn't exist`, ()=> {
            expect(ballotFactory.isBallotExist(subject)).is.false
        })
        let ballot:Ballot;
        it(`When the individual nammed '${individualName}' want to retreive the ballot with the subject '${subject}'`,(done)=> {
            const individual = individualFactory.retreiveIndividual(individualName)
            expect(individual.identifier).equal(individualName)
            ballot = individual.retreiveBallot(subject)
            done()
        })
        it(`Then the ballot with subject '${subject}' exist`,()=> {
            expect(ballotFactory.isBallotExist(subject)).is.true
        })
        it(`And the retreived ballot subject is '${subject}'`,()=> {
            expect(ballot.subject).equal(subject)
        })
    })
    */
})
