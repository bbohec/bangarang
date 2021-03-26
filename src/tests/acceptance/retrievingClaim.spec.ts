import 'mocha';
import {expect} from "chai";
import type { ClaimContract, ClaimContractWithMemberPreviousClaimChoice } from '../../client/port/ClaimContract';
import type { UserContract } from '../../client/port/UserContact';
import type { MemberClaim } from '../../client/port/MemberClaim';
import type { ClaimChoice } from '../../client/port/ClaimChoice';
import { UserBuilder } from '../../client/businessLogic/UserBuilder';
import { FakeBangarangClaimInteractor } from '../../client/adapters/FakeBangarangClaimInteractor';
import { FakeBangarangMembersInteractor } from '../../client/adapters/FakeBangarangMembersInteractor';
import { FakeRetrievingClaimUserNotificationInteractor } from "../../client/adapters/FakeRetrievingClaimUserNotificationInteractor";
import { claimNotDeclaredRetrievingClaimUserNotification, RetrievingClaimNotificationType, successRetrievingClaimUserNotification } from '../../client/port/interactors/RetrievingClaimUserNotificationInteractorContract';
import { bangarangClaimNotFoundById } from '../../client/port/interactors/BangarangClaimInteractorContract';
import { bangarangMemberNotFoundError } from '../../client/port/interactors/BangarangMembersInteractorContract';
describe(`Feature : Retrieving Claim
    As a guest or a Bangarang Member
    In order to share a claim or to claim
    I want to retrieve a claim
    `,
    ()=> {
    const retrievingClaimNotificationType:RetrievingClaimNotificationType="Retrieving claim."
    const expectedClaim:ClaimContract={
        title:"Claim Title",
        type:"Simple",
        peopleClaimed:10,
        peopleClaimedFor:9,
        peopleClaimedAgainst:1,
        id:"claimId"
    }
    const expectedClaimWithMemberPreviousClaimChoice:ClaimContractWithMemberPreviousClaimChoice={
        title:expectedClaim.title,
        type:expectedClaim.type,
        peopleClaimed:expectedClaim.peopleClaimed,
        peopleClaimedFor:expectedClaim.peopleClaimedFor,
        peopleClaimedAgainst:expectedClaim.peopleClaimedAgainst,
        previousUserClaimChoice:undefined,
        id:expectedClaim.id
    }
    const expectedUser:UserContract={fullname:"",username:"user",email:""}
    const bangarangClaimInteractor=new FakeBangarangClaimInteractor()
    const retrievingClaimUserNotificationInteractor = new FakeRetrievingClaimUserNotificationInteractor()
    const bangarangMembersInteractor= new FakeBangarangMembersInteractor()
    const user= new UserBuilder()
        .withUserContract(expectedUser)
        .withBangarangClaimInteractor(bangarangClaimInteractor)
        .withBangarangMembersInteractor(bangarangMembersInteractor)
        .withRetrievingClaimUserNotificationInteractor(retrievingClaimUserNotificationInteractor)
        .getUser()
    function initScenario(claims:ClaimContract[],previousUserClaimChoice:ClaimChoice,expectedUsers:UserContract[],membersClaims: MemberClaim[]) {
        bangarangClaimInteractor.removeAllClaims()
        claims.forEach(claim=> {bangarangClaimInteractor.saveClaim(claim)}) 
        retrievingClaimUserNotificationInteractor.resetNotification()
        expectedClaimWithMemberPreviousClaimChoice.previousUserClaimChoice=previousUserClaimChoice
        bangarangMembersInteractor.specificWithMembers(expectedUsers)
        bangarangMembersInteractor.specificWithMembersClaims(membersClaims)
    }
    describe(`Scenario: Retrieve Claim as Guest`,()=>{
        const expectedClaimChoice:ClaimChoice=undefined
        before(()=>initScenario([expectedClaim],expectedClaimChoice,[],[]))
        it(`Given the user is a Bangarang member`, ()=>{
            expect(()=>bangarangMembersInteractor.specificFindMemberFromUsername(expectedUser.username))
                .to.throw(bangarangMemberNotFoundError(expectedUser.username))
        })
        it(`And the claim '${expectedClaim.title}' with id '${expectedClaim.id}' is declared on Bangarang`,()=>{
            expect(bangarangClaimInteractor.claimById(expectedClaim.id )).deep.equal(expectedClaim)
        })
        it(`When the user retrieve the claim with title '${expectedClaim.title}'`,()=>{
            user.retrievingClaimById(expectedClaim.id)
        })
        it(`Then the retrieved claim in the claim user notification has the following information: 
        | title | people claimed    | people claimed for    | people claimed against    | previous user claim choice    |
        | ${expectedClaimWithMemberPreviousClaimChoice.title} | ${expectedClaimWithMemberPreviousClaimChoice.peopleClaimed}                |   ${expectedClaimWithMemberPreviousClaimChoice.peopleClaimedFor}                   |   ${expectedClaimWithMemberPreviousClaimChoice.peopleClaimedAgainst}                       |    ${expectedClaimChoice}                    |`,()=>{
            expect(retrievingClaimUserNotificationInteractor.currentUserNotification?.claimWithMemberPreviousClaimChoice).deep.equal(expectedClaimWithMemberPreviousClaimChoice)
            expect(retrievingClaimUserNotificationInteractor.currentUserNotification?.claimWithMemberPreviousClaimChoice?.previousUserClaimChoice).deep.equal(expectedClaimChoice)
        })
        it(`And the user has a '${retrievingClaimNotificationType}' notification with '${successRetrievingClaimUserNotification(expectedClaimWithMemberPreviousClaimChoice).status}' status and '${successRetrievingClaimUserNotification(expectedClaimWithMemberPreviousClaimChoice).message}' message.`,()=> {
            expect(retrievingClaimUserNotificationInteractor.currentUserNotification?.message).equal(successRetrievingClaimUserNotification(expectedClaimWithMemberPreviousClaimChoice).message)
            expect(retrievingClaimUserNotificationInteractor.currentUserNotification?.status).equal(successRetrievingClaimUserNotification(expectedClaimWithMemberPreviousClaimChoice).status)
        })
    })
    describe(`Scenario: Retrieve Claim as Bangarang member that has not claimed yet`,()=>{
        const expectedClaimChoice:ClaimChoice=undefined
        before(()=>initScenario([expectedClaim],expectedClaimChoice,[expectedUser],[]))
        it(`Given the user is a Bangarang member`, ()=>{
            expect(bangarangMembersInteractor.specificFindMemberFromUsername(expectedUser.username)).deep.equal(expectedUser)
        })
        it(`And the user has not claimed on claim '${expectedClaim.title}'`, ()=>{
            expect(bangarangMembersInteractor.retrievePreviousMemberClaimChoiceOnClaim(expectedUser.username,expectedClaim.title)).is.undefined
        })
        it(`And the claim '${expectedClaim.title}' is declared on Bangarang`,()=>{
            expect(bangarangClaimInteractor.claimById(expectedClaim.id)).deep.equal(expectedClaim)
        })
        it(`When the user retrieve the claim with id '${expectedClaim.id}'`,()=>{
            user.retrievingClaimById(expectedClaim.id)
        })
        it(`Then the retrieved claim in the claim user notification has the following information: 
        | title | people claimed    | people claimed for    | people claimed against    | previous user claim choice    |
        | ${expectedClaimWithMemberPreviousClaimChoice.title} | ${expectedClaimWithMemberPreviousClaimChoice.peopleClaimed}                |   ${expectedClaimWithMemberPreviousClaimChoice.peopleClaimedFor}                   |   ${expectedClaimWithMemberPreviousClaimChoice.peopleClaimedAgainst}                       |    ${expectedClaimChoice}                    |`,()=>{
            expect(retrievingClaimUserNotificationInteractor.currentUserNotification?.claimWithMemberPreviousClaimChoice).deep.equal(expectedClaimWithMemberPreviousClaimChoice)
            expect(retrievingClaimUserNotificationInteractor.currentUserNotification?.claimWithMemberPreviousClaimChoice?.previousUserClaimChoice).deep.equal(expectedClaimChoice)
        })
        it(`And the user has a '${retrievingClaimNotificationType}' notification with '${successRetrievingClaimUserNotification(expectedClaimWithMemberPreviousClaimChoice).status}' status and '${successRetrievingClaimUserNotification(expectedClaimWithMemberPreviousClaimChoice).message}' message.`,()=> {
            expect(retrievingClaimUserNotificationInteractor.currentUserNotification?.message).equal(successRetrievingClaimUserNotification(expectedClaimWithMemberPreviousClaimChoice).message)
            expect(retrievingClaimUserNotificationInteractor.currentUserNotification?.status).equal(successRetrievingClaimUserNotification(expectedClaimWithMemberPreviousClaimChoice).status)
        })
    })
    describe(`Scenario: Retrieve Claim as Bangarang member that has claimed For`,()=>{
        const expectedClaimChoice:ClaimChoice="For"
        before(()=>initScenario([expectedClaim],expectedClaimChoice,[expectedUser],[{memberUsername:expectedUser.username,claimTitle:expectedClaim.title,claimChoice:expectedClaimChoice}]))
        it(`Given the user is a Bangarang member`, ()=>{
            expect(bangarangMembersInteractor.specificFindMemberFromUsername(expectedUser.username)).deep.equal(expectedUser)
        })
        it(`And the user has claimed '${expectedClaimChoice}' on claim '${expectedClaim.title}'`, ()=>{
            expect(bangarangMembersInteractor.retrievePreviousMemberClaimChoiceOnClaim(expectedUser.username,expectedClaim.title)).equal(expectedClaimChoice)
        })
        it(`And the claim '${expectedClaim.title}' is declared on Bangarang`,()=>{
            expect(bangarangClaimInteractor.claimById(expectedClaim.id)).deep.equal(expectedClaim)
        })
        it(`When the user retrieve the claim with id '${expectedClaim.id}'`,()=>{
            user.retrievingClaimById(expectedClaim.id)
        })
        it(`Then the retrieved claim in the claim user notification has the following information: 
        | title | people claimed    | people claimed for    | people claimed against    | previous user claim choice    |
        | ${expectedClaimWithMemberPreviousClaimChoice.title} | ${expectedClaimWithMemberPreviousClaimChoice.peopleClaimed}                |   ${expectedClaimWithMemberPreviousClaimChoice.peopleClaimedFor}                   |   ${expectedClaimWithMemberPreviousClaimChoice.peopleClaimedAgainst}                       |    ${expectedClaimChoice}                    |`,()=>{
            expect(retrievingClaimUserNotificationInteractor.currentUserNotification?.claimWithMemberPreviousClaimChoice).deep.equal(expectedClaimWithMemberPreviousClaimChoice)
            expect(retrievingClaimUserNotificationInteractor.currentUserNotification?.claimWithMemberPreviousClaimChoice?.previousUserClaimChoice).deep.equal(expectedClaimChoice)
        })
        it(`And the user has a '${retrievingClaimNotificationType}' notification with '${successRetrievingClaimUserNotification(expectedClaimWithMemberPreviousClaimChoice).status}' status and '${successRetrievingClaimUserNotification(expectedClaimWithMemberPreviousClaimChoice).message}' message.`,()=> {
            expect(retrievingClaimUserNotificationInteractor.currentUserNotification?.message).equal(successRetrievingClaimUserNotification(expectedClaimWithMemberPreviousClaimChoice).message)
            expect(retrievingClaimUserNotificationInteractor.currentUserNotification?.status).equal(successRetrievingClaimUserNotification(expectedClaimWithMemberPreviousClaimChoice).status)
        })
    })
    describe(`Scenario: Retrieve Claim as Bangarang member that has claimed Against`,()=>{
        const expectedClaimChoice:ClaimChoice="Against"
        before(()=>initScenario([expectedClaim],expectedClaimChoice,[expectedUser],[{memberUsername:expectedUser.username,claimTitle:expectedClaim.title,claimChoice:expectedClaimChoice}]))
        it(`Given the user is a Bangarang member`, ()=>{
            expect(bangarangMembersInteractor.specificFindMemberFromUsername(expectedUser.username)).deep.equal(expectedUser)
        })
        it(`And the user has claimed '${expectedClaimChoice}' on claim '${expectedClaim.title}'`, ()=>{
            expect(bangarangMembersInteractor.retrievePreviousMemberClaimChoiceOnClaim(expectedUser.username,expectedClaim.title)).equal(expectedClaimChoice)
        })
        it(`And the claim '${expectedClaim.title}' is declared on Bangarang`,()=>{
            expect(bangarangClaimInteractor.claimById(expectedClaim.id)).deep.equal(expectedClaim)
        })
        it(`When the user retrieve the claim with id '${expectedClaim.id}'`,()=>{
            user.retrievingClaimById(expectedClaim.id)
        })
        it(`Then the retrieved claim in the claim user notification has the following information: 
        | title | people claimed    | people claimed for    | people claimed against    | previous user claim choice    |
        | ${expectedClaimWithMemberPreviousClaimChoice.title} | ${expectedClaimWithMemberPreviousClaimChoice.peopleClaimed}                |   ${expectedClaimWithMemberPreviousClaimChoice.peopleClaimedFor}                   |   ${expectedClaimWithMemberPreviousClaimChoice.peopleClaimedAgainst}                       |    ${expectedClaimChoice}                    |`,()=>{
            expect(retrievingClaimUserNotificationInteractor.currentUserNotification?.claimWithMemberPreviousClaimChoice).deep.equal(expectedClaimWithMemberPreviousClaimChoice)
            expect(retrievingClaimUserNotificationInteractor.currentUserNotification?.claimWithMemberPreviousClaimChoice?.previousUserClaimChoice).deep.equal(expectedClaimChoice)
        })
        it(`And the user has a '${retrievingClaimNotificationType}' notification with '${successRetrievingClaimUserNotification(expectedClaimWithMemberPreviousClaimChoice).status}' status and '${successRetrievingClaimUserNotification(expectedClaimWithMemberPreviousClaimChoice).message}' message.`,()=> {
            expect(retrievingClaimUserNotificationInteractor.currentUserNotification?.message).equal(successRetrievingClaimUserNotification(expectedClaimWithMemberPreviousClaimChoice).message)
            expect(retrievingClaimUserNotificationInteractor.currentUserNotification?.status).equal(successRetrievingClaimUserNotification(expectedClaimWithMemberPreviousClaimChoice).status)
        })
    })
    describe(`Scenario: Claim not found`,()=>{
        before(()=>initScenario([],"Against",[],[{memberUsername:"user",claimTitle:"claim",claimChoice:"Against"}]))
        it(`Given the user is a Bangarang member`, ()=>{
            expect(()=>bangarangMembersInteractor.specificFindMemberFromUsername(expectedUser.username))
                .to.throw(bangarangMemberNotFoundError(expectedUser.username))
        })
        it(`And the claim '${expectedClaim.title}' is not declared on Bangarang`,()=>{
            expect(()=>{throw bangarangClaimInteractor.claimById(expectedClaim.id)})
                .to.throw(bangarangClaimNotFoundById(expectedClaim.id))
        })
        it(`When the user retrieve the claim with title '${expectedClaim.id}'`,()=>{
            user.retrievingClaimById(expectedClaim.id)
        })
        it(`Then the retrieved claim is undefined`,()=>{
            expect(retrievingClaimUserNotificationInteractor.currentUserNotification?.claimWithMemberPreviousClaimChoice).is.undefined
        })
        it(`And the user has a '${retrievingClaimNotificationType}' notification with '${claimNotDeclaredRetrievingClaimUserNotification.status}' status and '${claimNotDeclaredRetrievingClaimUserNotification.message}' message.`,()=> {
            expect(retrievingClaimUserNotificationInteractor.currentUserNotification?.message).equal(claimNotDeclaredRetrievingClaimUserNotification.message)
            expect(retrievingClaimUserNotificationInteractor.currentUserNotification?.status).equal(claimNotDeclaredRetrievingClaimUserNotification.status)
        })

    })
})

