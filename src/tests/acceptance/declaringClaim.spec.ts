import 'mocha';
import {expect} from "chai";
import type { ClaimContract } from '../../client/port/ClaimContract';
import { UserBuilder } from '../../client/businessLogic/entities/UserBuilder';
import { FakeDeclaringClaimUserNotificationInteractor } from '../../client/adapters/FakeDeclaringClaimUserNotificationInteractor';
import { FakeBangarangClaimInteractor } from '../../client/adapters/FakeBangarangClaimInteractor';
import { FakeBangarangUserInterfaceInteractor } from '../../client/adapters/FakeBangarangUserInterfaceInteractor';
import { claimAlreadyExistDeclaringClaimUserNotification, claimWithoutTitleDeclaringClaimUserNotification, claimWithoutTypeDeclaringClaimUserNotification, DeclaringClaimNotificationType, DeclaringClaimUserNotificationInteractorContract, successDeclaringClaimUserNotification,} from '../../client/port/interactors/DeclaringClaimUserNotificationInteractorContract';
import { bangarangClaimNotFoundById } from '../../client/port/interactors/BangarangClaimInteractorContract';
describe(`Feature: Declaring Claim
    As a guest or a Bangarang Member
    In order to claim or share a claim
    I want to declare a claim
    `,()=> {
    const bangarangClaimInteractor = new FakeBangarangClaimInteractor()
    const declaringClaimNotificationType:DeclaringClaimNotificationType="Declaring claim."
    const fakeDeclaringClaimUserNotificationInteractor = new FakeDeclaringClaimUserNotificationInteractor()
    const expectedClaim:ClaimContract={id:"claimId",title:'expectedClaim',type:"Simple",peopleClaimed:0,peopleClaimedFor:0,peopleClaimedAgainst:0}
    const expectedClaimView = expectedClaim.id
    const declaringClaimMenuView = "declaring claim menu"
    const fakeBangarangUserInterfaceInteractor = new FakeBangarangUserInterfaceInteractor()
    describe(`Scenario: Declaring Simple Claim`,()=>{
        before(()=>initScenario([]))
        it(`Given the user current view is the "${declaringClaimMenuView}"`,()=> {
            expect(fakeBangarangUserInterfaceInteractor.currentView).equal(declaringClaimMenuView)
        })
        it(`And the claim with id '${expectedClaim.id}' is not declared on Bangarang.`,()=>{
            return bangarangClaimInteractor.claimById(expectedClaim.id)
                .then(claim => expect(()=> {throw claim})
                    .to.throw(bangarangClaimNotFoundById(expectedClaim.id))
                )
            
        })
        it(`When the user declare a new '${expectedClaim.type}' claim with title '${expectedClaim.title}'.`,(done)=>{
            declareClaim(expectedClaim).then(()=>done())
        })
        it(`Then the claim with title '${expectedClaim.title}' is declared on Bangarang.`,()=>{
            return bangarangClaimInteractor.claimById(expectedClaim.id)
                .then(claim=>expect(claim).deep.equal(expectedClaim))
            
        })
        it(`And the user has a '${declaringClaimNotificationType}' notification with '${successDeclaringClaimUserNotification.status}' status and '${successDeclaringClaimUserNotification.message.en}' message.`,()=> {
            expect(fakeDeclaringClaimUserNotificationInteractor.currentUserNotification?.status).equal(successDeclaringClaimUserNotification.status)
            expect(fakeDeclaringClaimUserNotificationInteractor.currentUserNotification?.message.en).equal(successDeclaringClaimUserNotification.message.en)
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
        it(`And the claim with id '${expectedClaim.id}' and title '${expectedClaim.title}' is declared on Bangarang.`,()=>{
            return bangarangClaimInteractor.claimById(expectedClaim.id)
                .then(claim=>expect(claim).deep.equal(expectedClaim))
        })
        it(`When the user declare a new '${expectedClaim.type}' claim with title '${expectedClaim.title}'.`,(done)=>{
            declareClaim(expectedClaim).then(()=>done())
        })
        it(`Then the new claim is not declared on Bangarang.`,()=>{
            expect(bangarangClaimInteractor.declaredClaims.length).equal(1)
        })
        it(`And the user has a '${declaringClaimNotificationType}' notification with '${claimAlreadyExistDeclaringClaimUserNotification(expectedClaim.title).status}' status and '${claimAlreadyExistDeclaringClaimUserNotification(expectedClaim.title).message.en}' message.`,()=> {
            expect(fakeDeclaringClaimUserNotificationInteractor.currentUserNotification?.message.en).equal(claimAlreadyExistDeclaringClaimUserNotification(expectedClaim.title).message.en)
            expect(fakeDeclaringClaimUserNotificationInteractor.currentUserNotification?.status).equal(claimAlreadyExistDeclaringClaimUserNotification(expectedClaim.title).status)
        })
        it(`And the user current view is the "${expectedClaimView}"`,()=> {
            expect(fakeBangarangUserInterfaceInteractor.currentView).equal(expectedClaimView)
        })
    })
    describe(`Scenario: Claim with same title uppercase already exist`,()=>{
        before(()=>initScenario([expectedClaim]))
        const upperCaseClaim:ClaimContract={title:expectedClaim.title.toUpperCase(),type:"Simple",peopleClaimed:0,peopleClaimedFor:0,peopleClaimedAgainst:0,id:"354sf6546sd464sdfsdf"}
        it(`Given the user current view is the "${declaringClaimMenuView}"`,()=> {
            expect(fakeBangarangUserInterfaceInteractor.currentView).equal(declaringClaimMenuView)
        })
        it(`And the claim with id '${expectedClaim.id}' is declared on Bangarang.`,()=>{
            return bangarangClaimInteractor.claimById(expectedClaim.id)
                .then(claim=>expect(claim).deep.equal(expectedClaim))
            
        })
        it(`When the user declare a new '${upperCaseClaim.type}' claim with title '${upperCaseClaim.title}'.`,(done)=>{
            declareClaim(upperCaseClaim).then(()=>done())
        })
        it(`Then the new claim is not declared on Bangarang.`,()=>{
            expect(bangarangClaimInteractor.declaredClaims.length).equal(1)
        })
        it(`And the user has a '${declaringClaimNotificationType}' notification with '${claimAlreadyExistDeclaringClaimUserNotification(upperCaseClaim.title).status}' status and '${claimAlreadyExistDeclaringClaimUserNotification(upperCaseClaim.title).message.en}' message.`,()=> {
            expect(fakeDeclaringClaimUserNotificationInteractor.currentUserNotification?.message.en).equal(claimAlreadyExistDeclaringClaimUserNotification(upperCaseClaim.title).message.en)
            expect(fakeDeclaringClaimUserNotificationInteractor.currentUserNotification?.status).equal(claimAlreadyExistDeclaringClaimUserNotification(upperCaseClaim.title).status)
        })
        it(`And the user current view is the "${expectedClaimView}"`,()=> {
            expect(fakeBangarangUserInterfaceInteractor.currentView).equal(expectedClaimView)
        })
    })
    describe(`Scenario: Claim with empty title`,()=>{
        before(()=>initScenario([]))
        const claimWithoutTitle:ClaimContract={title:'',type:"Simple",peopleClaimed:0,peopleClaimedFor:0,peopleClaimedAgainst:0,id:""}
        it(`Given the user current view is the "${declaringClaimMenuView}"`,()=> {
            expect(fakeBangarangUserInterfaceInteractor.currentView).equal(declaringClaimMenuView)
        })
        it(`When the user declare a new '${claimWithoutTitle.type}' claim with title '${claimWithoutTitle.title}'.`,(done)=>{
            declareClaim(claimWithoutTitle).then(()=>done())
        })
        it(`Then the new claim is not declared on Bangarang.`,()=>{
            expect(bangarangClaimInteractor.declaredClaims.length).equal(0)
        })
        it(`And the user has a '${declaringClaimNotificationType}' notification with '${claimWithoutTitleDeclaringClaimUserNotification.status}' status and '${claimWithoutTitleDeclaringClaimUserNotification.message.en}' message.`,()=> {
            expect(fakeDeclaringClaimUserNotificationInteractor.currentUserNotification?.message.en).equal(claimWithoutTitleDeclaringClaimUserNotification.message.en)
            expect(fakeDeclaringClaimUserNotificationInteractor.currentUserNotification?.status).equal(claimWithoutTitleDeclaringClaimUserNotification.status)
        })
        it(`And the user current view is the "${declaringClaimMenuView}"`,()=> {
            expect(fakeBangarangUserInterfaceInteractor.currentView).equal(declaringClaimMenuView)
        })
    })
    function initScenario(expectedClaims:ClaimContract[]) {
        bangarangClaimInteractor.removeAllClaims()
        expectedClaims.forEach(claim => bangarangClaimInteractor.saveClaim(claim))
        fakeDeclaringClaimUserNotificationInteractor.resetNotification();
        fakeBangarangUserInterfaceInteractor.goToClaim(declaringClaimMenuView);
    }
    function declareClaim( claimToDeclare: ClaimContract):Promise<void> {
        return new UserBuilder()
            .withBangarangClaimInteractor(bangarangClaimInteractor)
            .withBangarangUserInterfaceInteractor(fakeBangarangUserInterfaceInteractor)
            .withDeclaringClaimUserNotificationInteractor(fakeDeclaringClaimUserNotificationInteractor)
            .getUser()
            .declaringClaim(claimToDeclare.title,claimToDeclare.type,claimToDeclare.id);
    }
})




