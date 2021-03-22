import 'mocha';
import {expect} from "chai";
import type { ClaimContract } from '../../client/port/ClaimContract';
import { FakeBangarangClaimInteractor } from '../../client/adapters/FakeBangarangClaimInteractor';
import { FakeSearchingClaimsUserNotificationInteractor } from '../../client/adapters/FakeSearchingClaimsUserNotificationInteractor';
import { SearchingClaimsUserNotificationContract, successSearchingClaimsUserNotification } from '../../client/port/interactors/SearchingClaimsUserNotificationInteractorContract';
import { UserBuilder } from '../../client/businessLogic/UserBuilder';
import type { User } from '../../client/businessLogic/User';
describe(`Feature: Searching Claims
    As a guest or a Bangarang Member,
    In order to claim or share a claim,
    I want to find claims
    `,()=> {
    interface SearchingClaimsScenarioInterface {
        scenarioTitle:string,
        expectedDeclaredClaims:ClaimContract[],
        retreivedClaims:ClaimContract[],
        searchCriteria:string
    }
    const scenarios:SearchingClaimsScenarioInterface[] = [
        {
            scenarioTitle:"order engine unit 1",
            expectedDeclaredClaims:[
                {type:"", title:"good people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"good people1", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"good people 2", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"good 3 people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"PEOPLE GOOD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
            ],
            retreivedClaims:[
                {type:"", title:"good people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"good people 2", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"PEOPLE GOOD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"good 3 people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"good people1", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
            ],
            searchCriteria:"good people"
        },
        {
            scenarioTitle:"order engine unit 2",
            expectedDeclaredClaims:[
                {type:"", title:"good 4 people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"PEOPLE GOOD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
            ],
            retreivedClaims:[
                {type:"", title:"PEOPLE GOOD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"good 4 people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
            ],
            searchCriteria:"good people"
        },
        {
            scenarioTitle:"order engine unit 3",
            expectedDeclaredClaims:[
                {type:"", title:"good NOPE people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"PEOPLE GOOD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
            ],
            retreivedClaims:[
                {type:"", title:"PEOPLE GOOD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"good NOPE people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
            ],
            searchCriteria:"good people"
        },
        {
            scenarioTitle:"order engine unit 4",
            expectedDeclaredClaims:[
                {type:"", title:"Bad NOPE Cookie", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"COOKIE BAD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
            ],
            retreivedClaims:[
                {type:"", title:"COOKIE BAD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"Bad NOPE Cookie", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
            ],
            searchCriteria:"Bad Cookie"
        },
        {
            scenarioTitle:"order engine unit 5",
            expectedDeclaredClaims:[
                {type:"", title:"Third NOPE Thing", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"THING THIRD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
            ],
            retreivedClaims:[
                {type:"", title:"THING THIRD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"Third NOPE Thing", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
            ],
            searchCriteria:"Thing Third"
        },
        {
            scenarioTitle:"order engine unit 6",
            expectedDeclaredClaims:[
                {type:"", title:"good 3 people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"GOOD 4 PEOPLE", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
            ],
            retreivedClaims:[
                {type:"", title:"good 3 people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"GOOD 4 PEOPLE", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
            ],
            searchCriteria:"good people"
        },
        {
            scenarioTitle:"order engine unit 7",
            expectedDeclaredClaims:[
                {type:"", title:"third NOPE thing", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"THIRD LOREM THING", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
            ],
            retreivedClaims:[
                {type:"", title:"third NOPE thing", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"THIRD LOREM THING", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
            ],
            searchCriteria:"third thing"
        },
        {
            scenarioTitle:"order engine unit 8",
            expectedDeclaredClaims:[
                {type:"", title:"third 3 thing", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"THIRD 4 THING", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
            ],
            retreivedClaims:[
                {type:"", title:"third 3 thing", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"THIRD 4 THING", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
            ],
            searchCriteria:"third thing"
        },
        {
            scenarioTitle:"order engine unit 9",
            expectedDeclaredClaims:[
                {type:"", title:"third thing", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"THIRD THING", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
            ],
            retreivedClaims:[
                {type:"", title:"third thing", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"THIRD THING", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
            ],
            searchCriteria:"THIRD THING"
        },
        {
            scenarioTitle:"Searching Claims with one word",
            expectedDeclaredClaims:[
                {type:"", title:"claim", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"claim2", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"claim3", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"Claim4", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"CLAIME5", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"Cloum", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
            ],
            retreivedClaims:[
                {type:"", title:"claim", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"claim2", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"claim3", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"Claim4", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"CLAIME5", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""}
            ],
            searchCriteria:"claim"
        },
        {
            scenarioTitle:"Searching Claims with multiple words",
            expectedDeclaredClaims:[
                {type:"", title:"good people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"good people1", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"good people 2", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"good 3 people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"GOOD 4 PEOPLE", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"PEOPLE GOOD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"Cloum", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
            ],
            retreivedClaims:[
                {type:"", title:"good people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"good people 2", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"PEOPLE GOOD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"good 3 people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"GOOD 4 PEOPLE", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"good people1", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
            ],
            searchCriteria:"good people"
        },
        {
            scenarioTitle:"Searching Claims with one or multiple words",
            expectedDeclaredClaims:[
                {type:"", title:"good", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"good people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"good 2 people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"GOOD 4 PEOPLE", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"PEOPLE GOOD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"Cloum", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
            ],
            retreivedClaims:[
                {type:"", title:"good people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"PEOPLE GOOD", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"good 2 people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"GOOD 4 PEOPLE", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"good", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"people", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
            ],
            searchCriteria:"good people"
        },
        {
            scenarioTitle:"No claims match search criteria",
            expectedDeclaredClaims:[
                {type:"", title:"cloum", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"cloum2", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"cloum3", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"Cloum4", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"CLOUME5", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
            ],
            retreivedClaims:[],
            searchCriteria:"claim"
        },
        {
            scenarioTitle:"Claims found with bad lower/upper case search criteria",
            expectedDeclaredClaims:[
                {type:"", title:"cloum2", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"cloum3", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"Cloum4", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"CLOUME5", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"cloum", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""}
            ],
            retreivedClaims:[
                {type:"", title:"cloum", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"cloum2", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"cloum3", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"Cloum4", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""},
                {type:"", title:"CLOUME5", peopleClaimed:0, peopleClaimedFor:0, peopleClaimedAgainst:0,id:""}
            ],
            searchCriteria:"clOUm"
        }
    ]
    const bangarangClaimInteractor = new FakeBangarangClaimInteractor()
    const searchingClaimsUserNotificationInteractor = new FakeSearchingClaimsUserNotificationInteractor()
    const user:User = new UserBuilder()
        .withBangarangClaimInteractor(bangarangClaimInteractor)
        .withSearchingClaimsUserNotificationInteractor(searchingClaimsUserNotificationInteractor)
        .getUser()
    function initScenario(claims:ClaimContract[]) {
        bangarangClaimInteractor.removeAllClaims()
        claims.forEach(claim =>bangarangClaimInteractor.saveClaim(claim) ) 
        searchingClaimsUserNotificationInteractor.currentNotification=undefined
    }
    scenarios.forEach((scenario,index)=> {
        describe(`Scenario ${index+1}: ${scenario.scenarioTitle}`,()=>{
            const scenarioExpectedNotification = successSearchingClaimsUserNotification(scenario.retreivedClaims)
            const expectedDeclaredClaimsTitles = scenario.expectedDeclaredClaims.map(claim => claim.title);
            before(()=>initScenario(scenario.expectedDeclaredClaims))
            it(`Given there is the following declared claims:
                [${expectedDeclaredClaimsTitles}]`,()=>{
                scenario.expectedDeclaredClaims.forEach(claim => bangarangClaimInteractor.saveClaim(claim)) 
                expect(bangarangClaimInteractor.declaredClaims.map(claim => claim.title)).to.deep.equal(expectedDeclaredClaimsTitles)
            })
            it(`When the user search claims with search criteria '${scenario.searchCriteria}'`,(done)=>{
                user.searchingClaims(scenario.searchCriteria)
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
    })
})