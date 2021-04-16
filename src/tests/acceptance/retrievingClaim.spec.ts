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
import { FakeSigningInUserNotificationInteractor } from '../../client/adapters/FakeSigningInUserNotificationInteractor';
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
    const userPassword="passwd"
    const bangarangClaimInteractor=new FakeBangarangClaimInteractor()
    const retrievingClaimUserNotificationInteractor = new FakeRetrievingClaimUserNotificationInteractor()
    const bangarangMembersInteractor= new FakeBangarangMembersInteractor()
    //bangarangMembersInteractor.specificWithCredentials([{username:expectedUser.username,password:userPassword}])
    const signingNotification = new FakeSigningInUserNotificationInteractor()
    const userBuilder= new UserBuilder()
        .withBangarangClaimInteractor(bangarangClaimInteractor)
        .withBangarangMembersInteractor(bangarangMembersInteractor)
        .withRetrievingClaimUserNotificationInteractor(retrievingClaimUserNotificationInteractor)
        .withSigningInUserNotificationInteractor(signingNotification)
    async function initScenario(claims:ClaimContract[],previousUserClaimChoice:ClaimChoice,expectedUsers:UserContract[],membersClaims: MemberClaim[],userSignedIn:boolean):Promise<void> {
        bangarangMembersInteractor.specificWithMembers(expectedUsers)
        bangarangMembersInteractor.specificWithCredentials([{username:expectedUser.username,password:userPassword}])
        bangarangMembersInteractor.specificWithMembersClaims(membersClaims)    
        userBuilder.resetUser()
        if(userSignedIn) await userBuilder.getUser().signingIn(expectedUser.username,userPassword)
        bangarangClaimInteractor.removeAllClaims()
        claims.forEach(claim=> {bangarangClaimInteractor.saveClaim(claim)}) 
        retrievingClaimUserNotificationInteractor.resetNotification()
        expectedClaimWithMemberPreviousClaimChoice.previousUserClaimChoice=previousUserClaimChoice
    }
    describe(`Scenario: Retrieve Claim as Guest`,()=>{
        const expectedClaimChoice:ClaimChoice=undefined
        before(()=>initScenario([expectedClaim],expectedClaimChoice,[],[],false))
        it(`Given the user is signed in`,()=>{
            expect(userBuilder.getUser().retrieveUserContract()).is.undefined
        })
        it(`And the claim '${expectedClaim.title}' with id '${expectedClaim.id}' is declared on Bangarang`,()=>{
            return bangarangClaimInteractor.claimById(expectedClaim.id )
                .then(claim=>expect(claim).deep.equal(expectedClaim))
        })
        it(`When the user retrieve the claim with title '${expectedClaim.title}'`,(done)=>{
            userBuilder.getUser().retrievingClaimById(expectedClaim.id).then(()=>done())
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
        before(()=>initScenario([expectedClaim],expectedClaimChoice,[expectedUser],[],true))
        it(`Given the user is signed in`,()=>{
            expect(userBuilder.getUser().retrieveUserContract()).deep.equal(expectedUser)
        })
        it(`And the user has not claimed on claim '${expectedClaim.title}'`, ()=>{
            return bangarangMembersInteractor.retrievePreviousMemberClaimChoiceOnClaim(expectedUser.username,expectedClaim.title)
                .then(previousMemberClaimChoiceOnClaim => expect(previousMemberClaimChoiceOnClaim).is.undefined)
        })
        it(`And the claim '${expectedClaim.title}' is declared on Bangarang`,()=>{
            return bangarangClaimInteractor.claimById(expectedClaim.id)
                .then(claim=>expect(claim).deep.equal(expectedClaim))
        })
        it(`When the user retrieve the claim with id '${expectedClaim.id}'`,(done)=>{
            userBuilder.getUser().retrievingClaimById(expectedClaim.id).then(()=>done())
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
        before(()=>initScenario([expectedClaim],expectedClaimChoice,[expectedUser],[{memberUsername:expectedUser.username,claimId:expectedClaim.id,claimChoice:expectedClaimChoice}],true))
        it(`Given the user is signed in`,()=>{
            expect(userBuilder.getUser().retrieveUserContract()).deep.equal(expectedUser)
        })
        it(`And the user has claimed '${expectedClaimChoice}' on claim '${expectedClaim.title}'`, ()=>{
            return bangarangMembersInteractor.retrievePreviousMemberClaimChoiceOnClaim(expectedUser.username,expectedClaim.id)
                .then(previousMemberClaimChoiceOnClaim => expect(previousMemberClaimChoiceOnClaim).equal(expectedClaimChoice))
        })
        it(`And the claim '${expectedClaim.title}' is declared on Bangarang`,()=>{
            return bangarangClaimInteractor.claimById(expectedClaim.id)
                .then(claim=> expect(claim).deep.equal(expectedClaim))
        })
        it(`When the user retrieve the claim with id '${expectedClaim.id}'`,(done)=>{
            userBuilder.getUser().retrievingClaimById(expectedClaim.id).then(()=>done())
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
        before(()=>initScenario([expectedClaim],expectedClaimChoice,[expectedUser],[{memberUsername:expectedUser.username,claimId:expectedClaim.id,claimChoice:expectedClaimChoice}],true))
        it(`Given the user is signed in`,()=>{
            expect(userBuilder.getUser().retrieveUserContract()).deep.equal(expectedUser)
        })
        it(`And the user has claimed '${expectedClaimChoice}' on claim '${expectedClaim.title}'`, ()=>{
            return bangarangMembersInteractor.retrievePreviousMemberClaimChoiceOnClaim(expectedUser.username,expectedClaim.id)
                .then(previousMemberClaimChoiceOnClaim => expect(previousMemberClaimChoiceOnClaim).equal(expectedClaimChoice))
        })
        it(`And the claim '${expectedClaim.title}' is declared on Bangarang`,()=>{
            bangarangClaimInteractor.claimById(expectedClaim.id)
                .then(claim=>expect(claim).deep.equal(expectedClaim))
            
        })
        it(`When the user retrieve the claim with id '${expectedClaim.id}'`,(done)=>{
            userBuilder.getUser().retrievingClaimById(expectedClaim.id).then(()=>done())
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
        before(()=>initScenario([],"Against",[expectedUser],[{memberUsername:"user",claimId:"claim",claimChoice:"Against"}],true))
        it(`Given the user is signed in`,()=>{
            expect(userBuilder.getUser().retrieveUserContract()).deep.equal(expectedUser)
        })
        it(`And the claim '${expectedClaim.title}' is not declared on Bangarang`,()=>{
            return bangarangClaimInteractor.claimById(expectedClaim.id)
                .then(claim=>expect(()=>{throw claim})
                    .to.throw(bangarangClaimNotFoundById(expectedClaim.id))
                )
        })
        it(`When the user retrieve the claim with title '${expectedClaim.id}'`,(done)=>{
            userBuilder.getUser().retrievingClaimById(expectedClaim.id).then(()=>done())
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

