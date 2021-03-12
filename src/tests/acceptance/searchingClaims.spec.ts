import 'mocha';
import {expect} from "chai";
import type { ClaimContract } from '../../client/port/ClaimContract';
import { FakeBangarangClaimInteractor } from '../../client/adapters/FakeBangarangClaimInteractor';
import { FakeBangarangMembersInteractor } from '../../client/adapters/FakeBangarangMembersInteractor';
import { FakeBangarangUserInterfaceInteractor } from '../../client/adapters/FakeBangarangUserInterfaceInteractor';
import { FakeDeclaringClaimUserNotificationInteractor } from '../../client/adapters/FakeDeclaringClaimUserNotificationInteractor';
import { FakeSigningInUserNotificationInteractor } from '../../client/adapters/FakeSigningInUserNotificationInteractor';
import { FakeRetrievingClaimUserNotificationInteractor } from '../../client/adapters/FakeRetrievingClaimUserNotificationInteractor';
import { FakeSearchingClaimsUserNotificationInteractor } from '../../client/adapters/FakeSearchingClaimsUserNotificationInteractorContract';
import { SearchingClaimsUserNotificationContract, successSearchingClaimsUserNotification } from '../../client/port/interactors/SearchingClaimsUserNotificationInteractorContract';
import { User } from '../../client/businessLogic/User';



describe(`Feature: Searching Claims
    As a guest or a Bangarang Member,
    In order to claim or share a claim,
    I want to find claims
    `,()=> {
    const bangarangClaimInteractor = new FakeBangarangClaimInteractor()
    const searchingClaimsUserNotificationInteractor = new FakeSearchingClaimsUserNotificationInteractor()
    const user = new User({username:"",fullname:"",password:""},{
        bangarangClaimInteractor:bangarangClaimInteractor,
        bangarangMembersInteractor:new FakeBangarangMembersInteractor(),
        bangarangUserInterfaceInteractor:new FakeBangarangUserInterfaceInteractor(),
        declaringClaimUserNotificationInteractor:new FakeDeclaringClaimUserNotificationInteractor(),
        signingInUserNotificationInteractor:new FakeSigningInUserNotificationInteractor(), 
        retrievingClaimUserNotificationInteractor:new FakeRetrievingClaimUserNotificationInteractor(),
        searchingClaimsUserNotificationInteractor:searchingClaimsUserNotificationInteractor
    })
    let expectedNotification:SearchingClaimsUserNotificationContract;
    function initScenario(claims:ClaimContract[],scenarioExpectedNotification:SearchingClaimsUserNotificationContract) {
        bangarangClaimInteractor.withClaims(claims)
        searchingClaimsUserNotificationInteractor.currentNotification=undefined
        expectedNotification=scenarioExpectedNotification
    }
    describe(`Scenario: Searching Claims with one word`,()=>{
        const searchCriteria = "claim";
        const expectedDeclaredClaims:ClaimContract[]=[
            {type:"", title:"claim", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
            {type:"", title:"claim2", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
            {type:"", title:"claim3", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
            {type:"", title:"Claim4", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
            {type:"", title:"CLAIME5", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
            {type:"", title:"Cloum", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
        ]
        const retreivedClaims:ClaimContract[]=expectedDeclaredClaims.filter(claim=> claim.title !== "Cloum")
        const scenarioExpectedNotification = successSearchingClaimsUserNotification(retreivedClaims)
        before(()=>initScenario(expectedDeclaredClaims,scenarioExpectedNotification))
        const expectedDeclaredClaimsTitles = expectedDeclaredClaims.map(claim => claim.title);
        it(`Given there is the following declared claims:
            [${expectedDeclaredClaimsTitles}]`,()=>{
            bangarangClaimInteractor.withClaims(expectedDeclaredClaims)
            expect(bangarangClaimInteractor.declaredClaims.map(claim => claim.title)).to.deep.equal(expectedDeclaredClaimsTitles)
        })
        it(`When the user search claims with search criteria '${searchCriteria}'`,(done)=>{
            user.searchClaims(searchCriteria)
            done()
        })
        it(`Then the retreived claims is the following:
            [${scenarioExpectedNotification.retreivedClaims?.map(claim=>claim.title)}]`,()=>{
            expect(searchingClaimsUserNotificationInteractor.currentNotification?.retreivedClaims).to.deep.equal(scenarioExpectedNotification.retreivedClaims)
        })
        it(`And the user has a '${scenarioExpectedNotification.type}' notification with '${scenarioExpectedNotification.status}' status and '${scenarioExpectedNotification.message}' message.`,()=>{
            expect(searchingClaimsUserNotificationInteractor.currentNotification?.status).equal(scenarioExpectedNotification.status)
            expect(searchingClaimsUserNotificationInteractor.currentNotification?.message).equal(scenarioExpectedNotification.message)
            expect(searchingClaimsUserNotificationInteractor.currentNotification?.type).equal(scenarioExpectedNotification.type)
        })
    })
    describe(`Unit Test`,()=>{
        
        const searchCriteria = "good people";
        const orderTitles=(titles:string[],searchCriteria:string):string[]=> {
            //const sortedSearchCriteria = searchCriteria.split(" ").sort()
            return titles.sort((nextTitle,currentTitle)=>{
                const unexpectedValues = ["3", "4", "NOPE"];
                function findUnexpectedValues(unexpectedValue: string) {
                        return currentTitle.includes(unexpectedValue);
                    }
                function shouldReorder(currentTitle: string, unexpectedValues: string[], nextTitle: string, toReorderBefore: string):boolean {
                    return unexpectedValues.map(unexpectedValue => findUnexpectedValues(unexpectedValue) && nextTitle === toReorderBefore).some(value => value)

                    
                }
                return (shouldReorder(currentTitle, unexpectedValues, nextTitle, nextTitle))?-1:0
            })
        }
        const scenarios:{expectedDeclaredClaims:ClaimContract[],retreivedClaims:ClaimContract[]}[] = [
            {
                expectedDeclaredClaims:[
                    {type:"", title:"good people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                    {type:"", title:"good people1", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                    {type:"", title:"good people 2", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                    {type:"", title:"good 3 people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                    {type:"", title:"PEOPLE GOOD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                ],
                retreivedClaims:[
                    {type:"", title:"good people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                    {type:"", title:"good people1", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                    {type:"", title:"good people 2", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                    {type:"", title:"PEOPLE GOOD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                    {type:"", title:"good 3 people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                ]
            },
            {
                expectedDeclaredClaims:[
                    {type:"", title:"good 4 people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                    {type:"", title:"PEOPLE GOOD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                ],
                retreivedClaims:[
                    {type:"", title:"PEOPLE GOOD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                    {type:"", title:"good 4 people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                ]
            },
            {
                expectedDeclaredClaims:[
                    {type:"", title:"good NOPE people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                    {type:"", title:"PEOPLE GOOD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                ],
                retreivedClaims:[
                    {type:"", title:"PEOPLE GOOD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                    {type:"", title:"good NOPE people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                ]
            },
            {
                expectedDeclaredClaims:[
                    {type:"", title:"Bad NOPE Cookie", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                    {type:"", title:"COOKIE BAD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                ],
                retreivedClaims:[
                    {type:"", title:"COOKIE BAD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                    {type:"", title:"Bad NOPE Cookie", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                ]
            },
            {
                expectedDeclaredClaims:[
                    {type:"", title:"Third NOPE Thing", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                    {type:"", title:"THING THIRD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                ],
                retreivedClaims:[
                    {type:"", title:"THING THIRD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                    {type:"", title:"Third NOPE Thing", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
                ]
            }
        ]
        scenarios.forEach(scenario=> {
            it(`The claim title order of 
            [${scenario.expectedDeclaredClaims.map(claim => claim.title)}]
        must be:
            [${scenario.retreivedClaims.map(claim => claim.title)}]`,()=>{
            expect(orderTitles(scenario.expectedDeclaredClaims.map(claim => claim.title),searchCriteria)).to.deep.equal(scenario.retreivedClaims.map(claim => claim.title))
        })
        })
    })
    /*
    describe(`Scenario: Searching Claims with one word`,()=>{
        const searchCriteria = "good people";
        const expectedDeclaredClaims:ClaimContract[]=[
            {type:"", title:"good people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
            {type:"", title:"good people1", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
            {type:"", title:"good people 2", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
            {type:"", title:"good 3 people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
            {type:"", title:"GOOD 4 PEOPLE", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
            {type:"", title:"PEOPLE GOOD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
            {type:"", title:"Cloum", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
        ]
        const retreivedClaims:ClaimContract[]=[
            {type:"", title:"good people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
            {type:"", title:"good people1", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
            {type:"", title:"good people 2", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
            {type:"", title:"PEOPLE GOOD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
            {type:"", title:"good 3 people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
            {type:"", title:"GOOD 4 PEOPLE", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0},
        ]
        const scenarioExpectedNotification = successSearchingClaimsUserNotification(retreivedClaims)
        const expectedDeclaredClaimsTitles = expectedDeclaredClaims.map(claim => claim.title);
        before(()=>initScenario(expectedDeclaredClaims,scenarioExpectedNotification))
        it(`Given there is the following declared claims:
            [${expectedDeclaredClaimsTitles}]`,()=>{
            bangarangClaimInteractor.withClaims(expectedDeclaredClaims)
            expect(bangarangClaimInteractor.declaredClaims.map(claim => claim.title)).to.deep.equal(expectedDeclaredClaimsTitles)
        })
        it(`When the user search claims with search criteria '${searchCriteria}'`,(done)=>{
            user.searchClaims(searchCriteria)
            done()
        })
        
        it(`Then the retreived claims is the following:
            [${scenarioExpectedNotification.retreivedClaims?.map(claim=>claim.title)}]`,()=>{
            expect(searchingClaimsUserNotificationInteractor.currentNotification?.retreivedClaims).to.deep.equal(scenarioExpectedNotification.retreivedClaims)
        })
        it(`And the user has a '${scenarioExpectedNotification.type}' notification with '${scenarioExpectedNotification.status}' status and '${scenarioExpectedNotification.message}' message.`,()=>{
            expect(searchingClaimsUserNotificationInteractor.currentNotification?.status).equal(scenarioExpectedNotification.status)
            expect(searchingClaimsUserNotificationInteractor.currentNotification?.message).equal(scenarioExpectedNotification.message)
            expect(searchingClaimsUserNotificationInteractor.currentNotification?.type).equal(scenarioExpectedNotification.type)
        })
    })
    */
})






/*

Feature: Searching Claims
    As a guest or a Bangarang Member,
    In order to claim or share a claim,
    I want to find a claim
   

    Scenario: Searching Claims with multiple words
        Given there is the following declared claims:
            [good people,good people1,good people 2,good 3 people,GOOD 4 PEOPLE,PEOPLE GOOD,Cloum]
        When the user search claims with search criteria 'good people'
        Then the searched claims is the following:
            [good people,good people1,good people 2,PEOPLE GOOD,good 3 people,GOOD 4 PEOPLE]
        And the user has a "6 claims found." success notification.

    Scenario: Searching Claims with one or multiple words
        Given there is the following declared claims:
            [good ,people,good people,good 2 people,GOOD 4 PEOPLE,PEOPLE GOOD,Cloum]
        When the user search claims with search criteria 'good people'
        Then the searched claims is the following:
            [good people,PEOPLE GOOD,good 2 people,GOOD 4 PEOPLE,good ,people]
        And the user has a "6 claims found." success notification.

    Scenario: No claims
        Given there is the following declared claims:
            [cloum,cloum2,cloum3,Cloum4,CLOUME5]
        When the user search claims with search criteria 'claim'
        Then the searched claims is the following:
            []
        And the user has a "0 claims found." success notification.

*/