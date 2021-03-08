import 'mocha';
import {expect} from "chai";
import { User } from '../../client/businessLogic/User';
import { FakeBangarangClaimInteractor } from '../../client/adapters/FakeBangarangClaimInteractor';
import { FakeBangarangMembersInteractor } from '../../client/adapters/FakeBangarangMembersInteractor';
import { FakeDeclaringClaimUserNotificationInteractor } from '../../client/adapters/FakeDeclaringClaimUserNotificationInteractor';
import { FakeRetrievingClaimUserNotificationInteractor } from "../../client/adapters/FakeRetrievingClaimUserNotificationInteractor";
import { FakeSigningInUserNotificationInteractor } from '../../client/adapters/FakeSigningInUserNotificationInteractor';
import { FakeBangarangUserInterfaceInteractor } from '../../client/adapters/FakeBangarangUserInterfaceInteractor';
import type { ClaimContract, ClaimContractWithMemberPreviousClaimChoice } from '../../client/port/ClaimContract';
import type { UserContract } from '../../client/port/UserContact';
import type { MemberClaim } from '../../client/port/MemberClaim';
import type { ClaimChoice } from '../../client/port/ClaimChoice';
import { claimNotDeclaredRetrievingClaimUserNotification, RetrievingClaimNotificationType, successRetrievingClaimUserNotification } from '../../client/port/interactors/RetrievingClaimUserNotificationInteractorContract';
import { bangarangClaimNotFound } from '../../client/port/interactors/BangarangClaimInteractor';
import { bangarangMemberNotFoundError } from '../../client/port/interactors/BangarangMembersInteractorContract';
describe(`Feature : Retrieving Claim
    As a guest or a Bangarang Member
    In order to share a claim or to claim
    I want to retrieve a claim
    `,
    ()=> {
    const retrievingClaimNotificationType:RetrievingClaimNotificationType="Retrieving claim."
    const expectedClaim:ClaimContract={
        title:"claim",
        type:"simple",
        peopleClaimed:10,
        peopleClaimedFor:9,
        peopleClaimedAgainst:1
    }
    const expectedClaimWithMemberPreviousClaimChoice:ClaimContractWithMemberPreviousClaimChoice={
        title:expectedClaim.title,
        type:expectedClaim.type,
        peopleClaimed:expectedClaim.peopleClaimed,
        peopleClaimedFor:expectedClaim.peopleClaimedFor,
        peopleClaimedAgainst:expectedClaim.peopleClaimedAgainst,
        previousUserClaimChoice:undefined
    }
    const expectedUser:UserContract={fullname:"",username:"user",password:""}
    const bangarangClaimInteractor=new FakeBangarangClaimInteractor()
    const retrievingClaimUserNotificationInteractor = new FakeRetrievingClaimUserNotificationInteractor()
    const bangarangMembersInteractor= new FakeBangarangMembersInteractor()
    const user:User = new User(expectedUser,{
        bangarangClaimInteractor,
        bangarangMembersInteractor,
        declaringClaimUserNotificationInteractor: new FakeDeclaringClaimUserNotificationInteractor(),
        signingInUserNotificationInteractor: new FakeSigningInUserNotificationInteractor(),
        bangarangUserInterfaceInteractor: new FakeBangarangUserInterfaceInteractor(),
        retrievingClaimUserNotificationInteractor
    })
    function initScenario(claims:ClaimContract[],previousUserClaimChoice:ClaimChoice,expectedUsers:UserContract[],membersClaims: MemberClaim[]) {
        bangarangClaimInteractor.withClaims(claims)
        retrievingClaimUserNotificationInteractor.resetNotification()
        expectedClaimWithMemberPreviousClaimChoice.previousUserClaimChoice=previousUserClaimChoice
        bangarangMembersInteractor.withBangarangMembersDatabase(expectedUsers)
        bangarangMembersInteractor.withMembersClaims(membersClaims)
    }
    describe(`Scenario: Retrieve Claim as Guest`,()=>{
        const expectedClaimChoice:ClaimChoice=undefined
        before(()=>initScenario([expectedClaim],expectedClaimChoice,[],[]))
        it(`Given the user is a Bangarang member`, ()=>{
            expect(()=>bangarangMembersInteractor.findBangarangMemberFromUsername(expectedUser.username))
                .to.throw(bangarangMemberNotFoundError(expectedUser.username))
        })
        it(`And the claim '${expectedClaim.title}' is declared on Bangarang`,()=>{
            expect(bangarangClaimInteractor.claimByTitle(expectedClaim.title)).deep.equal(expectedClaim)
        })
        it(`When the user retrieve the claim with title '${expectedClaim.title}'`,()=>{
            user.claimByTitle(expectedClaim.title)
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
            expect(bangarangMembersInteractor.findBangarangMemberFromUsername(expectedUser.username)).deep.equal(expectedUser)
        })
        it(`And the user has not claimed on claim '${expectedClaim.title}'`, ()=>{
            expect(bangarangMembersInteractor.memberHasClaimedOnClaim(expectedUser.username,expectedClaim.title)).is.undefined
        })
        it(`And the claim '${expectedClaim.title}' is declared on Bangarang`,()=>{
            expect(bangarangClaimInteractor.claimByTitle(expectedClaim.title)).deep.equal(expectedClaim)
        })
        it(`When the user retrieve the claim with title '${expectedClaim.title}'`,()=>{
            user.claimByTitle(expectedClaim.title)
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
        before(()=>initScenario([expectedClaim],expectedClaimChoice,[expectedUser],[{memberUsername:"user",claimTitle:"claim",claimChoice:expectedClaimChoice}]))
        it(`Given the user is a Bangarang member`, ()=>{
            expect(bangarangMembersInteractor.findBangarangMemberFromUsername(expectedUser.username)).deep.equal(expectedUser)
        })
        it(`And the user has claimed '${expectedClaimChoice}' on claim '${expectedClaim.title}'`, ()=>{
            expect(bangarangMembersInteractor.memberHasClaimedOnClaim(expectedUser.username,expectedClaim.title)).equal(expectedClaimChoice)
        })
        it(`And the claim '${expectedClaim.title}' is declared on Bangarang`,()=>{
            expect(bangarangClaimInteractor.claimByTitle(expectedClaim.title)).deep.equal(expectedClaim)
        })
        it(`When the user retrieve the claim with title '${expectedClaim.title}'`,()=>{
            user.claimByTitle(expectedClaim.title)
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
        before(()=>initScenario([expectedClaim],expectedClaimChoice,[expectedUser],[{memberUsername:"user",claimTitle:"claim",claimChoice:expectedClaimChoice}]))
        it(`Given the user is a Bangarang member`, ()=>{
            expect(bangarangMembersInteractor.findBangarangMemberFromUsername(expectedUser.username)).deep.equal(expectedUser)
        })
        it(`And the user has claimed '${expectedClaimChoice}' on claim '${expectedClaim.title}'`, ()=>{
            expect(bangarangMembersInteractor.memberHasClaimedOnClaim(expectedUser.username,expectedClaim.title)).equal(expectedClaimChoice)
        })
        it(`And the claim '${expectedClaim.title}' is declared on Bangarang`,()=>{
            expect(bangarangClaimInteractor.claimByTitle(expectedClaim.title)).deep.equal(expectedClaim)
        })
        it(`When the user retrieve the claim with title '${expectedClaim.title}'`,()=>{
            user.claimByTitle(expectedClaim.title)
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
            expect(()=>bangarangMembersInteractor.findBangarangMemberFromUsername(expectedUser.username))
                .to.throw(bangarangMemberNotFoundError(expectedUser.username))
        })
        it(`And the claim '${expectedClaim.title}' is not declared on Bangarang`,()=>{
            expect(()=>{throw bangarangClaimInteractor.claimByTitle(expectedClaim.title)})
                .to.throw(bangarangClaimNotFound(expectedClaim.title))
        })
        it(`When the user retrieve the claim with title '${expectedClaim.title}'`,()=>{
            user.claimByTitle(expectedClaim.title)
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

