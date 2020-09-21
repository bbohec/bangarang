import "mocha"
import chai = require("chai");
import { individualFactory } from "../../src/core/entities/individualFactory";
import { ballotFactory } from "../../src/core/entities/ballotFactory";
import { fakeIndividualRepository } from "../../src/adapters/secondary/fakeIndividualRepository"
import { Ballot } from "../../src/core/ports/Ballot";
const expect = chai.expect;
describe(`=====================
Feature : Retreive Ballot
    As an individual,
    In order to vote about a subject,
    I can retreive the ballot about this subject.
=====================`, () => {
    describe(`Scenario: Retreive a ballot that doesn't exist`, () => {
        const subject = "US Presidentials 99999"
        const individualIdentifier = "Bob"
        it(`Given the ballot with subject '${subject}' doesn't exist`, () => {
            expect(ballotFactory.isBallotExist(subject)).is.false
        })
        let ballot: Ballot;
        it(`When the individual identified by '${individualIdentifier}' want to retreive the ballot with the subject '${subject}'`, (done) => {
            const individual = new individualFactory(fakeIndividualRepository).retreiveIndividual(individualIdentifier)
            expect(individual.identifier).equal(individualIdentifier)
            ballot = individual.individualUseCases.retreiveBallotBySubject(subject)
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
