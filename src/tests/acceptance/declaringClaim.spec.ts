import 'mocha';
import {expect} from "chai";
import { User } from '../../client/businessLogic/User';
import { FakeBangarangMembersInteractor } from '../../client/adapters/FakeBangarangMembersInteractor';
import { FakeSigningInUserNotificationInteractor } from '../../client/adapters/FakeSigningInUserNotificationInteractor';
import { FakeDeclaringClaimUserNotificationInteractor } from '../../client/adapters/FakeDeclaringClaimUserNotificationInteractor';
import { FakeBangarangClaimInteractor } from '../../client/adapters/FakeBangarangClaimInteractor';
import type { ClaimContract } from '../../client/port/ClaimContract';
import { claimAlreadyExistDeclaringClaimUserNotification, DeclaringClaimNotificationType, DeclaringClaimUserNotificationInteractorContract, successDeclaringClaimUserNotification,} from '../../client/port/interactors/DeclaringClaimUserNotificationInteractorContract';
import { FakeUserInterfaceInteractor } from '../../client/adapters/FakeUserInterfaceInteractor';
import { claimNotFound } from '../../client/port/interactors/BangarangClaimInteractor';


describe(`Feature: Declaring Claim
    As a guest or a Bangarang Member
    In order to claim or share a claim
    I want to declare a claim
    `,()=> {
    const declaringClaimNotificationType:DeclaringClaimNotificationType="Declaring claim."
    describe(`Scenario: Declaring Simple Claim`,()=>{
        const fakeDeclaringClaimUserNotificationInteractor = new FakeDeclaringClaimUserNotificationInteractor()
        const fakeBangarangClaimInteractor = new FakeBangarangClaimInteractor()
        const expectedClaim:ClaimContract={title:'claim',type:"simple"}
        const fakeUserInterfaceInteractor = new FakeUserInterfaceInteractor()
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
        it(`And the user has a '${declaringClaimNotificationType}' notification with '${successDeclaringClaimUserNotification.status}' status and '${successDeclaringClaimUserNotification.message}' message.`,()=> {
            expect(fakeDeclaringClaimUserNotificationInteractor.currentUserNotification?.status).equal(successDeclaringClaimUserNotification.status)
            expect(fakeDeclaringClaimUserNotificationInteractor.currentUserNotification?.message).equal(successDeclaringClaimUserNotification.message)
        })
        it(`The user go to the 'claim'.`,()=> {
            expect(fakeUserInterfaceInteractor.currentView).equal('claim')
        })
    })
    describe(`Scenario: Claim with same title already exist`,()=>{
        const fakeDeclaringClaimUserNotificationInteractor = new FakeDeclaringClaimUserNotificationInteractor()
        const expectedClaim:ClaimContract={title:'claim',type:"simple"}
        const fakeBangarangClaimInteractor = new FakeBangarangClaimInteractor([expectedClaim])
        const fakeUserInterfaceInteractor = new FakeUserInterfaceInteractor()
        it(`Given the claim with title '${expectedClaim.title}' is declared on Bangarang.`,()=>{
            expect(fakeBangarangClaimInteractor.claimWithTitle(expectedClaim.title).title).equal(expectedClaim.title)
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
        it(`Then the new claim is not declared on Bangarang.`,()=>{
            expect(fakeBangarangClaimInteractor.declaredClaims.length).equal(1)
        })
        it(`And the user has a '${declaringClaimNotificationType}' notification with '${claimAlreadyExistDeclaringClaimUserNotification(expectedClaim.title).status}' status and '${claimAlreadyExistDeclaringClaimUserNotification(expectedClaim.title).message}' message.`,()=> {
            expect(fakeDeclaringClaimUserNotificationInteractor.currentUserNotification?.message).equal(claimAlreadyExistDeclaringClaimUserNotification(expectedClaim.title).message)
            expect(fakeDeclaringClaimUserNotificationInteractor.currentUserNotification?.status).equal(claimAlreadyExistDeclaringClaimUserNotification(expectedClaim.title).status)
        })
        it(`The user go to the 'claim'.`,()=> {
            expect(fakeUserInterfaceInteractor.currentView).equal('claim')
        })
    })
})

/*
Feature: Declaring Claim
    As a guest or a Bangarang Member
    In order to claim or share a claim
    I want to declare a claim

    Scenario: Claim with same title already exist
        Given the claim with title 'claim' is declared on Bangarang.
        When the user declare a new 'simple' claim with title 'CLAIM'.
        Then the new claim is not declared on Bangarang.
        And the user has a 'Declaring claim.' notification with 'Failed' status and 'The claim "claim" already exist' message.
        And the user go to the 'claim'.

    Scenario: Claim with empty title
        When the user declare a new 'simple' claim with title ''.
        Then the new claim is not declared on Bangarang.
        And the user has a 'Declaring claim.' notification with 'Failed' status and 'A claim must have a title.' message.
        And the user stay on to the 'declaring claim' menu.

    Scenario: Claim with no type
        When the user declare a new '' claim with title 'claim'.
        Then the new claim is not declared on Bangarang.
        And the user has a 'Declaring claim.' notification with 'Failed' status and 'A claim must have a type.' message.
        And the user stay on to the 'declaring claim' menu.
*/