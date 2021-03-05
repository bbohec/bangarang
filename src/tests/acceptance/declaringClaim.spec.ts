import 'mocha';
import {expect} from "chai";
import { User } from '../../client/businessLogic/User';
import { FakeBangarangMembersInteractor } from '../../client/adapters/FakeBangarangMembersInteractor';
import { FakeSigningInUserNotificationInteractor } from '../../client/adapters/FakeSigningInUserNotificationInteractor';
import { FakeDeclaringClaimUserNotificationInteractor } from '../../client/adapters/FakeDeclaringClaimUserNotificationInteractor';
import { FakeBangarangClaimInteractor } from '../../client/adapters/FakeBangarangClaimInteractor';
import type { ClaimContract } from '../../client/port/ClaimContract';
import { DeclaringClaimNotificationType, successDeclaringUserNotification } from '../../client/port/interactors/DeclaringClaimUserNotificationInteractorContract';

describe(`Feature: Declaring Claim
    As a guest or a Bangarang Member
    In order to claim or share a claim
    I want to declare a claim
    `,()=> {
    describe(`Scenario: Declaring Simple Claim`,()=>{
        const fakeBangarangClaimInteractor = new FakeBangarangClaimInteractor()
        const expectedClaim:ClaimContract={title:'claim',type:"simple"}
        const declaringClaimNotificationType:DeclaringClaimNotificationType="Declaring claim."
        const fakeDeclaringClaimUserNotificationInteractor = new FakeDeclaringClaimUserNotificationInteractor()
        it(`Given the claim with title '${expectedClaim.title}' is not declared on Bangarang.`,()=>{
            expect(()=>fakeBangarangClaimInteractor.claimWithTitle(expectedClaim.title).title)
                .to.throw(claimNotFound(expectedClaim.title))
        })
        it(`When the user declare a new '${expectedClaim.type}' claim with title '${expectedClaim.title}'.`,(done)=>{
            const user = new User({username:"",password:"",fullname:""},{
                bangarangClaimInteractor:fakeBangarangClaimInteractor,
                bangarangMembersInteractor: new FakeBangarangMembersInteractor([]),
                declaringClaimUserNotificationInteractor:fakeDeclaringClaimUserNotificationInteractor,
                signingInUserNotificationInteractor: new FakeSigningInUserNotificationInteractor(),
            })
            user.declareClaim(expectedClaim)
            done()
        })
        it(`Then the claim with title '${expectedClaim.title}' is declared on Bangarang.`,()=>{
            expect(fakeBangarangClaimInteractor.claimWithTitle(expectedClaim.title).title).equal(expectedClaim.title)
        })
        it(`And the user has a '${declaringClaimNotificationType}' notification with '${successDeclaringUserNotification.status}' status and '${successDeclaringUserNotification.message}' message.`,()=> {
            expect(fakeDeclaringClaimUserNotificationInteractor.currentUserNotification?.status).equal(successDeclaringUserNotification.status)
            expect(fakeDeclaringClaimUserNotificationInteractor.currentUserNotification?.message).equal(successDeclaringUserNotification.message)
        })
        it(`The user go to the 'claim'.`,()=> {
            expect(fakeUserInterfaceInteractor.view).equal('claim')
        })
    })
})
export function claimNotFound(title: string): string | undefined {
    return `Claim with title ${title} not found.`;
}
/*
Feature: Declaring Claim
    As a guest or a Bangarang Member
    In order to claim or share a claim
    I want to declare a claim

    Scenario: Declaring Simple Claim
        Given the claim with title 'claim' is not declared on Bangarang.
        When the user declare a new 'simple' claim with title 'claim'.
        Then the claim with title 'claim' is declared on Bangarang.
        And the user has a 'Declaring claim' notification with 'Success' status and 'Declared.' message.
        The user go to the 'claim'.

    Scenario: Claim with same title already exist
        Given the claim with title 'claim' is declared on Bangarang.
        When the user declare a new 'simple' claim with title 'claim'.
        Then the new claim is not declared on Bangarang.
        And the user has a 'The claim 'claim' already exist' error notification.
        The user go to the 'claim'.

    Scenario: Claim with same title already exist
        Given the claim with title 'claim' is declared on Bangarang.
        When the user declare a new 'simple' claim with title 'CLAIM'.
        Then the new claim is not declared on Bangarang.
        And the user has a 'The claim 'claim' already exist' error notification.
        The user go to the 'claim'.

    Scenario: Claim with empty title
        When the user declare a new 'simple' claim with title ''.
        Then the new claim is not declared on Bangarang.
        And the user has a 'A claim must have a title.' error notification.

    Scenario: Claim with no type
        When the user declare a new '' claim with title 'claim'.
        Then the new claim is not declared on Bangarang.
        And the user has a 'A claim must have a type.' error notification.
*/