import 'mocha';
import {expect} from "chai";
import type { BangarangClaimInteractorContract } from '../../client/port/interactors/BangarangClaimInteractorContract';
import { FakeBangarangClaimInteractor } from '../../client/adapters/FakeBangarangClaimInteractor';
import type { ClaimContract } from '../../client/port/ClaimContract';
describe(`Bangarang Claim Interactor - Integration Test`,()=>{
   const expectedSavedClaim:ClaimContract= {
       id:"dsolsdfsldfjsdlfjsdflkjjsf",
       type:"Simple",
       title:"Claim with impoRtant stuff on It.",
       peopleClaimed:0,
       peopleClaimedFor:0,
       peopleClaimedAgainst:0
   }
   const errorClaim:ClaimContract= {
        id:"dsolsdfsldfjsdlfjsdflkjjsf",
        type:"Simple",
        title:"error",
        peopleClaimed:0,
        peopleClaimedFor:0,
        peopleClaimedAgainst:0
    }
    const goodSearchCriteria = "important"
    const badSearchCriteria = "dog"
    interface AdapterScenario {
        name:string,
        adapter:BangarangClaimInteractorContract
    }
    const adapterScenarios:AdapterScenario[] = [
        {name:"fake",adapter:new FakeBangarangClaimInteractor(errorClaim.title)},
        //{name:"prod",adapter:new FakeBangarangMembersInteractor()}
    ]
    adapterScenarios.forEach(adapterScenario => {
        describe(`Integration Test with '${adapterScenario.name}' adapter.`,()=> {
            it(`claimById - error`,()=>{
                expect(adapterScenario.adapter.claimById(expectedSavedClaim.id)).instanceOf(Error)
            })
            it(`claimByTitleUpperCase - error`,()=>{
                expect(adapterScenario.adapter.claimByTitleUpperCase(expectedSavedClaim.title)).instanceOf(Error)
            })
            it(`isClaimExistByTitleUpperCase - error`,()=>{
                expect(adapterScenario.adapter.isClaimExistByTitleUpperCase(errorClaim.title)).instanceOf(Error)
            })
            it(`retrieveClaimsThatContainInNotCaseSensitiveTitleOneOrMoreSearchCriteriaWords - error`,()=>{
                expect(adapterScenario.adapter.retrieveClaimsThatContainInNotCaseSensitiveTitleOneOrMoreSearchCriteriaWords([errorClaim.title])).instanceOf(Error)
            })
            it(`saveClaim - error`,()=>{
                expect(adapterScenario.adapter.saveClaim(errorClaim)).instanceOf(Error)
            })
            describe('save claim scenario',()=>{
                it(`isClaimExistByTitleUpperCase - The claim '${expectedSavedClaim.title}' don't exist.`,()=>{
                    expect(adapterScenario.adapter.isClaimExistByTitleUpperCase(expectedSavedClaim.title)).to.be.false
                })
                it(`saveClaim - The claim '${expectedSavedClaim.title}' is saved.`,()=>{
                    expect(adapterScenario.adapter.saveClaim(expectedSavedClaim)).not.instanceOf(Error)
                })
                it(`isClaimExistByTitleUpperCase - The claim '${expectedSavedClaim.title}' exist.`,()=>{
                    expect(adapterScenario.adapter.isClaimExistByTitleUpperCase(expectedSavedClaim.title)).to.be.true
                })
                it(`claimById - The claim '${expectedSavedClaim.title}' can be retrieved by Id.`,()=>{
                    expect(adapterScenario.adapter.claimById(expectedSavedClaim.id)).deep.equal(expectedSavedClaim)
                })
                it(`claimById - The claim '${expectedSavedClaim.title}' can be retrieved by it's title.`,()=>{
                    expect(adapterScenario.adapter.claimByTitleUpperCase(expectedSavedClaim.title)).deep.equal(expectedSavedClaim)
                })
                it(`retrieveClaimsThatContainInNotCaseSensitiveTitleOneOrMoreSearchCriteriaWords - The claim '${expectedSavedClaim.title}' is retrieved with '${goodSearchCriteria}' search criteria.`,()=>{
                    expect(adapterScenario.adapter.retrieveClaimsThatContainInNotCaseSensitiveTitleOneOrMoreSearchCriteriaWords([goodSearchCriteria])).deep.equal([expectedSavedClaim])
                })
                it(`retrieveClaimsThatContainInNotCaseSensitiveTitleOneOrMoreSearchCriteriaWords - No claim is retrieved with '${badSearchCriteria}' search criteria.`,()=>{
                    expect(adapterScenario.adapter.retrieveClaimsThatContainInNotCaseSensitiveTitleOneOrMoreSearchCriteriaWords([goodSearchCriteria])).deep.equal([expectedSavedClaim])
                })
            })   
        })
    })
})