import 'mocha';
import {expect} from "chai";
import { User } from '../../client/businessLogic/User';
import { FakeBangarangMembersInteractor } from '../../client/adapters/FakeBangarangMembersInteractor';
import { FakeSigningInUserNotificationInteractor } from '../../client/adapters/FakeSigningInUserNotificationInteractor';
import { FakeDeclaringClaimUserNotificationInteractor } from '../../client/adapters/FakeDeclaringClaimUserNotificationInteractor';
import { FakeRetrievingClaimUserNotificationInteractor } from "../../client/adapters/FakeRetrievingClaimUserNotificationInteractor";
import { FakeBangarangClaimInteractor } from '../../client/adapters/FakeBangarangClaimInteractor';
import type { ClaimContract } from '../../client/port/ClaimContract';
import { claimAlreadyExistDeclaringClaimUserNotification, claimWithoutTitleDeclaringClaimUserNotification, claimWithoutTypeDeclaringClaimUserNotification, DeclaringClaimNotificationType, DeclaringClaimUserNotificationInteractorContract, successDeclaringClaimUserNotification,} from '../../client/port/interactors/DeclaringClaimUserNotificationInteractorContract';
import { FakeBangarangUserInterfaceInteractor } from '../../client/adapters/FakeBangarangUserInterfaceInteractor';
import { bangarangClaimNotFound } from '../../client/port/interactors/BangarangClaimInteractor';



describe(`Feature: Declaring Claim
    As a guest or a Bangarang Member
    In order to claim or share a claim
    I want to declare a claim
    `,()=> {
    const fakeBangarangClaimInteractor = new FakeBangarangClaimInteractor()
    const declaringClaimNotificationType:DeclaringClaimNotificationType="Declaring claim."
    const fakeDeclaringClaimUserNotificationInteractor = new FakeDeclaringClaimUserNotificationInteractor()
    const expectedClaim:ClaimContract={title:'expectedClaim',type:"simple",peopleClaimed:0,peopleClaimedFor:0,peopleClaimedAgainst:0}
    const expectedClaimView = expectedClaim.title
    const declaringClaimMenuView = "declaring claim menu"
    const fakeBangarangUserInterfaceInteractor = new FakeBangarangUserInterfaceInteractor()
    describe(`Scenario: Declaring Simple Claim`,()=>{
        before(()=>initScenario([]))
        it(`Given the user current view is the "${declaringClaimMenuView}"`,()=> {
            expect(fakeBangarangUserInterfaceInteractor.currentView).equal(declaringClaimMenuView)
        })
        it(`And the claim with title '${expectedClaim.title}' is not declared on Bangarang.`,()=>{
            expect(()=> {throw fakeBangarangClaimInteractor.claimByTitle(expectedClaim.title)})
                .to.throw(bangarangClaimNotFound(expectedClaim.title))
        })
        it(`When the user declare a new '${expectedClaim.type}' claim with title '${expectedClaim.title}'.`,(done)=>{
            declareClaim(expectedClaim)
            done()
        })
        it(`Then the claim with title '${expectedClaim.title}' is declared on Bangarang.`,()=>{
            expect(fakeBangarangClaimInteractor.claimByTitle(expectedClaim.title)).deep.equal(expectedClaim)
        })
        it(`And the user has a '${declaringClaimNotificationType}' notification with '${successDeclaringClaimUserNotification.status}' status and '${successDeclaringClaimUserNotification.message}' message.`,()=> {
            expect(fakeDeclaringClaimUserNotificationInteractor.currentUserNotification?.status).equal(successDeclaringClaimUserNotification.status)
            expect(fakeDeclaringClaimUserNotificationInteractor.currentUserNotification?.message).equal(successDeclaringClaimUserNotification.message)
        })
        it(`And the user current view is the "${expectedClaimView}"`,()=> {
            expect(fakeBangarangUserInterfaceInteractor.currentView).equal(expectedClaimView)
        })
    })
    
    describe(`Scenario: Claim with same title already exist`,()=>{
        before(()=>initScenario([expectedClaim]))
        it(`Given the user current view is the "${declaringClaimMenuView}"`,()=> {
            expect(fakeBangarangUserInterfaceInteractor.currentView).equal(declaringClaimMenuView)
        })
        it(`And the claim with title '${expectedClaim.title}' is declared on Bangarang.`,()=>{
            expect(fakeBangarangClaimInteractor.claimByTitle(expectedClaim.title)).deep.equal(expectedClaim)
        })
        it(`When the user declare a new '${expectedClaim.type}' claim with title '${expectedClaim.title}'.`,(done)=>{
            declareClaim(expectedClaim)
            done()
        })
        it(`Then the new claim is not declared on Bangarang.`,()=>{
            expect(fakeBangarangClaimInteractor.declaredClaims.length).equal(1)
        })
        it(`And the user has a '${declaringClaimNotificationType}' notification with '${claimAlreadyExistDeclaringClaimUserNotification(expectedClaim.title).status}' status and '${claimAlreadyExistDeclaringClaimUserNotification(expectedClaim.title).message}' message.`,()=> {
            expect(fakeDeclaringClaimUserNotificationInteractor.currentUserNotification?.message).equal(claimAlreadyExistDeclaringClaimUserNotification(expectedClaim.title).message)
            expect(fakeDeclaringClaimUserNotificationInteractor.currentUserNotification?.status).equal(claimAlreadyExistDeclaringClaimUserNotification(expectedClaim.title).status)
        })
        it(`And the user current view is the "${expectedClaimView}"`,()=> {
            expect(fakeBangarangUserInterfaceInteractor.currentView).equal(expectedClaimView)
        })
    })
    describe(`Scenario: Claim with same title uppercase already exist`,()=>{
        before(()=>initScenario([expectedClaim]))
        const upperCaseClaim:ClaimContract={title:expectedClaim.title.toUpperCase(),type:"simple",peopleClaimed:0,peopleClaimedFor:0,peopleClaimedAgainst:0}
        it(`Given the user current view is the "${declaringClaimMenuView}"`,()=> {
            expect(fakeBangarangUserInterfaceInteractor.currentView).equal(declaringClaimMenuView)
        })
        it(`And the claim with title '${expectedClaim.title}' is declared on Bangarang.`,()=>{
            expect(fakeBangarangClaimInteractor.claimByTitle(expectedClaim.title)).deep.equal(expectedClaim)
        })
        it(`When the user declare a new '${upperCaseClaim.type}' claim with title '${upperCaseClaim.title}'.`,(done)=>{
            declareClaim(upperCaseClaim);
            done()
        })
        it(`Then the new claim is not declared on Bangarang.`,()=>{
            expect(fakeBangarangClaimInteractor.declaredClaims.length).equal(1)
        })
        it(`And the user has a '${declaringClaimNotificationType}' notification with '${claimAlreadyExistDeclaringClaimUserNotification(upperCaseClaim.title).status}' status and '${claimAlreadyExistDeclaringClaimUserNotification(upperCaseClaim.title).message}' message.`,()=> {
            expect(fakeDeclaringClaimUserNotificationInteractor.currentUserNotification?.message).equal(claimAlreadyExistDeclaringClaimUserNotification(upperCaseClaim.title).message)
            expect(fakeDeclaringClaimUserNotificationInteractor.currentUserNotification?.status).equal(claimAlreadyExistDeclaringClaimUserNotification(upperCaseClaim.title).status)
        })
        it(`And the user current view is the "${expectedClaimView}"`,()=> {
            expect(fakeBangarangUserInterfaceInteractor.currentView).equal(expectedClaimView)
        })
    })
    describe(`Scenario: Claim with empty title`,()=>{
        before(()=>initScenario([]))
        const claimWithoutTitle:ClaimContract={title:'',type:"simple",peopleClaimed:0,peopleClaimedFor:0,peopleClaimedAgainst:0}
        it(`Given the user current view is the "${declaringClaimMenuView}"`,()=> {
            expect(fakeBangarangUserInterfaceInteractor.currentView).equal(declaringClaimMenuView)
        })
        it(`When the user declare a new '${claimWithoutTitle.type}' claim with title '${claimWithoutTitle.title}'.`,(done)=>{
            declareClaim(claimWithoutTitle);
            done()
        })
        it(`Then the new claim is not declared on Bangarang.`,()=>{
            expect(fakeBangarangClaimInteractor.declaredClaims.length).equal(0)
        })
        it(`And the user has a '${declaringClaimNotificationType}' notification with '${claimWithoutTitleDeclaringClaimUserNotification.status}' status and '${claimWithoutTitleDeclaringClaimUserNotification.message}' message.`,()=> {
            expect(fakeDeclaringClaimUserNotificationInteractor.currentUserNotification?.message).equal(claimWithoutTitleDeclaringClaimUserNotification.message)
            expect(fakeDeclaringClaimUserNotificationInteractor.currentUserNotification?.status).equal(claimWithoutTitleDeclaringClaimUserNotification.status)
        })
        it(`And the user current view is the "${declaringClaimMenuView}"`,()=> {
            expect(fakeBangarangUserInterfaceInteractor.currentView).equal(declaringClaimMenuView)
        })
    })
    describe(`Scenario: Claim with no type`,()=>{
        before(()=>initScenario([]))
        const claimWithoutType:ClaimContract={title:'claim',type:"",peopleClaimed:0,peopleClaimedFor:0,peopleClaimedAgainst:0}
        it(`Given the user current view is the "${declaringClaimMenuView}"`,()=> {
            expect(fakeBangarangUserInterfaceInteractor.currentView).equal(declaringClaimMenuView)
        })
        it(`When the user declare a new '${claimWithoutType.type}' claim with title '${claimWithoutType.title}'.`,(done)=>{
            declareClaim(claimWithoutType)
            done()
        })
        it(`Then the new claim is not declared on Bangarang.`,()=>{
            expect(fakeBangarangClaimInteractor.declaredClaims.length).equal(0)
        })
        it(`And the user has a '${declaringClaimNotificationType}' notification with '${claimWithoutTypeDeclaringClaimUserNotification.status}' status and '${claimWithoutTypeDeclaringClaimUserNotification.message}' message.`,()=> {
            expect(fakeDeclaringClaimUserNotificationInteractor.currentUserNotification?.message).equal(claimWithoutTypeDeclaringClaimUserNotification.message)
            expect(fakeDeclaringClaimUserNotificationInteractor.currentUserNotification?.status).equal(claimWithoutTypeDeclaringClaimUserNotification.status)
        })
        it(`And the user current view is the "${declaringClaimMenuView}"`,()=> {
            expect(fakeBangarangUserInterfaceInteractor.currentView).equal(declaringClaimMenuView)
        })
    })
    function initScenario(expectedClaims:ClaimContract[]) {
        fakeBangarangClaimInteractor.withClaims(expectedClaims);
        fakeDeclaringClaimUserNotificationInteractor.resetNotification();
        fakeBangarangUserInterfaceInteractor.goToView(declaringClaimMenuView);
    }
    function declareClaim( claimToDeclare: ClaimContract) {
        const user = new User({ username: "", password: "", fullname: "" }, {
            bangarangClaimInteractor: fakeBangarangClaimInteractor,
            bangarangMembersInteractor: new FakeBangarangMembersInteractor(),
            declaringClaimUserNotificationInteractor: fakeDeclaringClaimUserNotificationInteractor,
            signingInUserNotificationInteractor: new FakeSigningInUserNotificationInteractor(),
            bangarangUserInterfaceInteractor: fakeBangarangUserInterfaceInteractor,
            retrievingClaimUserNotificationInteractor:new FakeRetrievingClaimUserNotificationInteractor()
        });
        user.declareClaim(claimToDeclare);
    }
})




