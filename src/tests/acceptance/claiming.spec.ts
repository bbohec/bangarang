import 'mocha';
import {expect} from "chai";
import type { ClaimChoice } from '../../client/port/ClaimChoice';
import type { ClaimContract } from '../../client/port/ClaimContract';
import { UserBuilder } from '../../client/businessLogic/UserBuilder';
import { FakeBangarangMembersInteractor } from '../../client/adapters/FakeBangarangMembersInteractor';
import { FakeBangarangClaimInteractor } from '../../client/adapters/FakeBangarangClaimInteractor';
import { FakeBangarangUserInterfaceInteractor } from '../../client/adapters/FakeBangarangUserInterfaceInteractor';
import { FakeClaimingUserNotificationInteractor } from '../../client/adapters/FakeClaimingUserNotificationInteractor';
import { ClaimingNotificationType, ClaimingUserNotificationContract, claimNotDeclaredClaimingUserNotification, multipleTimesClaimingUserNotification, mustBeSignedInClaimingUserNotification, successClaimingUserNotification } from '../../client/port/interactors/ClaimingUserNotificationInteractorContract';
import { StaticView } from '../../client/port/interactors/BangarangUserInterfaceInteractor';
import type { UserContract } from '../../client/port/UserContact';
describe(`Feature: Claiming
    As a Bangarang Member
    In order to claim
    I want to claim on claim`,()=> {
    const notificationType:ClaimingNotificationType = "Claiming."
    const userContract:UserContract = { username: "", fullname: "",email:"" }
    const userPassword = ""
    const bangarangClaimInteractor = new FakeBangarangClaimInteractor();
    const bangarangMembersInteractor = new FakeBangarangMembersInteractor();
    const bangarangUserInterfaceInteractor = new FakeBangarangUserInterfaceInteractor();
    const claimingUserNotificationInteractor = new FakeClaimingUserNotificationInteractor()
    const user = new UserBuilder()
        .withUserContract(userContract)
        .withBangarangClaimInteractor(bangarangClaimInteractor)
        .withBangarangMembersInteractor(bangarangMembersInteractor)
        .withBangarangUserInterfaceInteractor(bangarangUserInterfaceInteractor)
        .withClaimingUserNotificationInteractor(claimingUserNotificationInteractor)
        .getUser()
    interface Scenario {
        userSignedIn: boolean;
        description:string
        expectedClaim:ClaimContract,
        claimDeclared:boolean
        previousClaimChoice: ClaimChoice;
        userChoice:ClaimChoice
        claimChecks:{propertyName:"peopleClaimed"|"peopleClaimedFor"|"peopleClaimedAgainst",increased:boolean}[]
        expectedNotification:ClaimingUserNotificationContract,
        currentView:string,
        expectedView:string
    }
    const scenarios:Scenario[] = [
        {
            description:"Scenario: Claiming For",
            userSignedIn:true,
            expectedClaim: {type:"Simple", title:"claim title", peopleClaimed:10, peopleClaimedFor:10, peopleClaimedAgainst:0,id:"claim"},
            claimDeclared:true,
            userChoice: 'For',
            previousClaimChoice:undefined,
            claimChecks:[
                {propertyName:"peopleClaimed",increased:true},
                {propertyName:"peopleClaimedFor",increased:true},
                {propertyName:"peopleClaimedAgainst",increased:false},
            ],
            expectedNotification:successClaimingUserNotification,
            currentView:"claim",
            expectedView:"claim"
        },
        {
            description:"Scenario: Claiming Against",
            userSignedIn:true,
            expectedClaim:{type:"Simple", title:"claim title", peopleClaimed:20, peopleClaimedFor:0, peopleClaimedAgainst:20,id:"claim"},
            claimDeclared:true,
            userChoice:'Against',
            previousClaimChoice:undefined,
            claimChecks:[
                {propertyName:"peopleClaimed",increased:true},
                {propertyName:"peopleClaimedFor",increased:false},
                {propertyName:"peopleClaimedAgainst",increased:true},
            ],
            expectedNotification:successClaimingUserNotification,
            currentView:"claim",
            expectedView:"claim"
        },
        {
            description:"Scenario: Claim not declared on Bangarang",
            userSignedIn:true,
            expectedClaim:{type:"Simple", title:"claim title", peopleClaimed:20, peopleClaimedFor:0, peopleClaimedAgainst:20,id:"claim"},
            claimDeclared:false,
            userChoice:'Against',
            previousClaimChoice:undefined,
            claimChecks:[],
            expectedNotification:claimNotDeclaredClaimingUserNotification("claim"),
            currentView:"claim",
            expectedView:"claim"
        },
        {
            description:"Scenario: User not Signed In",
            userSignedIn:false,
            expectedClaim:{type:"Simple", title:"claim title", peopleClaimed:20, peopleClaimedFor:0, peopleClaimedAgainst:20,id:"claim"},
            claimDeclared:true,
            userChoice:'Against',
            previousClaimChoice:undefined,
            claimChecks:[
                {propertyName:"peopleClaimed",increased:false},
                {propertyName:"peopleClaimedFor",increased:false},
                {propertyName:"peopleClaimedAgainst",increased:false},
            ],
            expectedNotification:mustBeSignedInClaimingUserNotification,
            currentView:"claim",
            expectedView:StaticView.SigningInMenu
        },
        {
            description:"Scenario: Can't claim For multiple times",
            userSignedIn:true,
            expectedClaim:{type:"Simple", title:"claim title", peopleClaimed:9, peopleClaimedFor:9, peopleClaimedAgainst:0,id:"claim"},
            claimDeclared:true,
            userChoice:'For',
            previousClaimChoice:"For",
            claimChecks:[
                {propertyName:"peopleClaimed",increased:true},
                {propertyName:"peopleClaimedFor",increased:true},
                {propertyName:"peopleClaimedAgainst",increased:false},
            ],
            expectedNotification:multipleTimesClaimingUserNotification("For"),
            currentView:"claim",
            expectedView:"claim"
        },
        {
            description:"Scenario: Can't claim Against multiple times",
            userSignedIn:true,
            expectedClaim:{type:"Simple", title:"claim title", peopleClaimed:9, peopleClaimedFor:9, peopleClaimedAgainst:0,id:"claim"},
            claimDeclared:true,
            userChoice:"Against",
            previousClaimChoice:"Against",
            claimChecks:[
                {propertyName:"peopleClaimed",increased:true},
                {propertyName:"peopleClaimedFor",increased:false},
                {propertyName:"peopleClaimedAgainst",increased:true},
            ],
            expectedNotification:multipleTimesClaimingUserNotification("Against"),
            currentView:"claim",
            expectedView:"claim"
        },
        {
            description:"Scenario: user change claim choice For > Against",
            userSignedIn:true,
            expectedClaim:{type:"Simple", title:"claim title", peopleClaimed:9, peopleClaimedFor:9, peopleClaimedAgainst:0,id:"claim"},
            claimDeclared:true,
            userChoice:"Against",
            previousClaimChoice:"For",
            claimChecks:[
                {propertyName:"peopleClaimed",increased:true},
                {propertyName:"peopleClaimedFor",increased:false},
                {propertyName:"peopleClaimedAgainst",increased:true},
            ],
            expectedNotification:successClaimingUserNotification,
            currentView:"claim",
            expectedView:"claim"
        },
        {
            description:"Scenario: user change claim choice Against > For",
            userSignedIn:true,
            expectedClaim:{type:"Simple", title:"claim title", peopleClaimed:9, peopleClaimedFor:0, peopleClaimedAgainst:9,id:"claim"},
            claimDeclared:true,
            userChoice:"For",
            previousClaimChoice:"Against",
            claimChecks:[
                {propertyName:"peopleClaimed",increased:true},
                {propertyName:"peopleClaimedFor",increased:true},
                {propertyName:"peopleClaimedAgainst",increased:false},
            ],
            expectedNotification:successClaimingUserNotification,
            currentView:"claim",
            expectedView:"claim"
        }
    ]
    function initScenario (scenario:Scenario){
        bangarangMembersInteractor.specificWithMembers([userContract]);
        bangarangMembersInteractor.specificWithSignedInMembers([]);
        bangarangMembersInteractor.specificWithMembersClaims([]);
        bangarangMembersInteractor.specificWithCredentials([{username:userContract.username,password:userPassword}])
        if(scenario.userSignedIn)user.signingIn("")
        bangarangClaimInteractor.removeAllClaims();
        if(scenario.claimDeclared)bangarangClaimInteractor.saveClaim(scenario.expectedClaim)
        claimingUserNotificationInteractor.currentUserNotification = undefined
        bangarangUserInterfaceInteractor.currentView=scenario.currentView
        if(scenario.previousClaimChoice)user.claiming(scenario.expectedClaim.id,scenario.previousClaimChoice)
    }
    scenarios.forEach(scenario => {
        describe(`
        ${scenario.description}`,()=> {
            before(()=>initScenario(scenario))
            it(`Given the user is ${(!scenario.userSignedIn)?"not ":""}signed in`,()=>{
                expect(bangarangMembersInteractor.isSignedIn(userContract.username)).equal(scenario.userSignedIn)
            })
            if (scenario.claimDeclared){ 
                if(scenario.previousClaimChoice)it(`And the claim with id '${scenario.expectedClaim.id}' is declared on Bangarang with the following values:
                | claim title |claimed people| claimed For people | claimed Against people|
                | ${scenario.expectedClaim.title} | ${scenario.expectedClaim.peopleClaimed+1}           | ${scenario.expectedClaim.peopleClaimedFor+((scenario.previousClaimChoice=== "For")?1:0)}                 | ${scenario.expectedClaim.peopleClaimedAgainst+((scenario.previousClaimChoice=== "Against")?1:0)}                     |`,()=>{
                    const previouslyClaimedClaim:ClaimContract= {
                        title:scenario.expectedClaim.title,
                        type:scenario.expectedClaim.type,
                        peopleClaimed:scenario.expectedClaim.peopleClaimed+1,
                        peopleClaimedFor:scenario.expectedClaim.peopleClaimedFor+((scenario.previousClaimChoice=== "For")?1:0),
                        peopleClaimedAgainst:scenario.expectedClaim.peopleClaimedAgainst+((scenario.previousClaimChoice=== "Against")?1:0),
                        id:scenario.expectedClaim.id
                    }
                    expect(bangarangClaimInteractor.claimById(scenario.expectedClaim.id)).deep.equal(previouslyClaimedClaim)
                })
                else it(`And the claim with id '${scenario.expectedClaim.id}' is declared on Bangarang with the following values:
                | claim title |claimed people| claimed For people | claimed Against people|
                | ${scenario.expectedClaim.title} | ${scenario.expectedClaim.peopleClaimed}           | ${scenario.expectedClaim.peopleClaimedFor}                 | ${scenario.expectedClaim.peopleClaimedAgainst}                     |`,()=>{
                    expect(bangarangClaimInteractor.claimById(scenario.expectedClaim.id)).deep.equal(scenario.expectedClaim)
                })
            } else it(`And there is no declared claims on Bangarang`,()=>{
                expect(bangarangClaimInteractor.declaredClaims.length).equal(0)
            })
            if (scenario.previousClaimChoice) it(`And the user has previously claimed '${scenario.previousClaimChoice}' on claim '${scenario.expectedClaim.title}'`,()=>{
                expect(bangarangMembersInteractor.retrievePreviousMemberClaimChoiceOnClaim(userContract.username,scenario.expectedClaim.title)).equal(scenario.previousClaimChoice)
            })
            it(`When the user claim '${scenario.userChoice}' on the claim with title '${scenario.expectedClaim.title}'`,(done)=>{
                user.claiming(scenario.expectedClaim.id,scenario.userChoice)
                done()
            })
            it(`Then the user has a '${notificationType}' notification with '${scenario.expectedNotification.status}' status and '${scenario.expectedNotification.message}' message.`,()=> {
                expect(claimingUserNotificationInteractor.currentUserNotification?.message).equal(scenario.expectedNotification.message)
                expect(claimingUserNotificationInteractor.currentUserNotification?.status).equal(scenario.expectedNotification.status)
            })
            scenario.claimChecks.forEach(claimCheck => checkClaimValue(bangarangClaimInteractor, scenario.expectedClaim,claimCheck.propertyName,claimCheck.increased))
            function checkClaimValue(bangarangClaimInteractor: FakeBangarangClaimInteractor, expectedClaim: ClaimContract,claimPropertyToCheck:"peopleClaimedAgainst"|"peopleClaimedFor"|"peopleClaimed",isIncreased:boolean) {
                it(`And the '${claimPropertyToCheck}' quantity on claim '${expectedClaim.title}' is ${expectedClaim[claimPropertyToCheck]+((isIncreased)?1:0)}`,()=>{
                    const claim = bangarangClaimInteractor.claimById(expectedClaim.id);
                    if (claim instanceof Error)throw claim;
                    expect(claim[claimPropertyToCheck]).equal(expectedClaim[claimPropertyToCheck]+((isIncreased)?1:0));
                })  
            }
            it(`The user view is "${scenario.expectedView}".`,()=>{
                expect(bangarangUserInterfaceInteractor.currentView).equal(scenario.expectedView)
            })
        })
    })
})



/*
Feature: Claiming
    As a Bangarang Member
    In order to claim
    I want to claim on claim

    Scenario: user change claim choice Against > For
        Given the user is a Bagarang member
        And the user has claimed Against on claim 'claim'
        And the claim with title 'claim' is declared on Bangarang
        And the claim claimed people is 10
        And the claim claimed for people is 0
        And the claim claimed against people is 10
        When the user claim 'For' on the claim with title 'claim'
        Then the user has claimed For on claim 'claim'
        And the claimed people is 10
        And the claim claimed for people is 1
        And the claim claimed against people is 9
        And the user has a "Claimed" success notification.
*/