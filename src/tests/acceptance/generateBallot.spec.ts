import "mocha"
import chai = require("chai");
const expect = chai.expect;
import { Bangarang } from "../../adapters/primary/Bangarang";
import { FakeIdentityProvider } from "../../adapters/secondary/FakeIdentityProvider"
import { FakeBallotRepositoryProvider } from "../../adapters/secondary/FakeBallotProvider";
import { BallotContract } from "../../core/ports/BallotContract";
describe(`=====================
Feature : Retreive Ballot
    As an individual,
    In order to vote about a subject,
    I can retreive the ballot about this subject.
=====================`, () => {
    describe(`Scenario: Retreive a ballot that doesn't exist`, () => {
        const subject = "US Presidentials 99999"
        const individualIdentifier = "user65563563453"
        const bangarang = new Bangarang(new FakeIdentityProvider([{identifier:"user65563563453",firstName:"",lastName:"",gifLink:""}]),new FakeBallotRepositoryProvider([]))
        it(`Given the ballot with subject '${subject}' doesn't exist`, () => {
            expect(bangarang.ballotServiceProvider.isBallotExist(subject)).is.false
        })
        let ballot: BallotContract;
        it(`When the individual identified by '${individualIdentifier}' want to retreive the ballot with the subject '${subject}'`, (done) => {
            const user = bangarang.userServiceProvider.retreiveUserByIdentifer(individualIdentifier)
            expect(user.individual.identifier).equal(individualIdentifier)
            ballot = user.useCases.retreiveBallotBySubject(subject)
            done()
        })
        it(`Then the ballot with subject '${subject}' exist`, () => {
            expect(bangarang.ballotServiceProvider.isBallotExist(subject)).is.true
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
