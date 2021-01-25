import "mocha"
import {expect} from "chai";
import { Bangarang } from "../../adapters/primary/Bangarang";
import { FakeIdentityProvider } from "../../adapters/secondary/FakeIdentityProvider";
import { FakeBallotRepositoryProvider } from "../../adapters/secondary/FakeBallotProvider";
import { userDontExist } from "../../core/ports/Errors";
describe(`=====================
Feature : Identify individual as User.
    As an individual,
    In order to vote about a subject,
    I must be a user identified in the application.
=====================`, () => {
    const individualIdentifier = "user65563563453"
    describe(`Scenario: Individual exist as a user.`, () => {
        const bangarang = new Bangarang(new FakeIdentityProvider([{identifier:individualIdentifier,firstName:"",lastName:"",gifLink:""}]),new FakeBallotRepositoryProvider([]))
        it(`The individual identified by '${individualIdentifier}' exist from user service provider.`, () => {
            expect(bangarang.userServiceProvider.retreiveUserByIdentifer(individualIdentifier).individual.identifier).equal(individualIdentifier)
        })
    })
    describe(`Scenario: Individual don't exist as a user.`, () => {
        const bangarang = new Bangarang(new FakeIdentityProvider([]),new FakeBallotRepositoryProvider([]))
        it(`The individual identified by '${individualIdentifier}' don't exist from user service provider.`, () => {
            expect(()=>bangarang.userServiceProvider.retreiveUserByIdentifer(individualIdentifier).individual.identifier).to.throw(userDontExist(individualIdentifier))
        })
    })
})


