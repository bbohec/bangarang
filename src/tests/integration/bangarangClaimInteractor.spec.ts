import 'mocha';
import {expect} from "chai";
import type { BangarangClaimInteractorContract } from '../../client/port/interactors/BangarangClaimInteractorContract';
import type { ClaimContract } from '../../client/port/ClaimContract';
import { FakeBangarangClaimInteractor } from '../../client/adapters/FakeBangarangClaimInteractor';
import { RestBangarangClaimInteractor } from '../../client/adapters/RestBangarangClaimInteractor';
import { RestInteractor } from '../../client/adapters/RestInteractor';
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
    const goodSearchCriteria = "imporTant dog toto important"
    const badSearchCriteria = "dog"
    interface AdapterScenario {
        name:string,
        adapter:BangarangClaimInteractorContract
    }
    const restFakeAdapter = new RestBangarangClaimInteractor(new RestInteractor({endpointFullyQualifiedDomainName:"localhost",port:"3000",apiPrefix:"restFakeClaimInteractor",scheme:"http"}))
    const restGcpDatastoreAdapter = new RestBangarangClaimInteractor(new RestInteractor({endpointFullyQualifiedDomainName:"localhost",port:"3000",apiPrefix:"restGcpDatastoreClaimInteractor",scheme:"http"}))
    const adapterScenarios:AdapterScenario[] = [
        {name:"fake",adapter:new FakeBangarangClaimInteractor(errorClaim.title)},
        {name:"restFake",adapter:restFakeAdapter},
        {name:"restGcp",adapter:restGcpDatastoreAdapter}
    ]
    adapterScenarios.forEach(adapterScenario => {
        describe(`Integration Test with '${adapterScenario.name}' adapter.`,()=> {
            before((done)=>{
                console.log(`   🛠  Reset adapter call : ${adapterScenario.name}`)
                if(adapterScenario.name === "restFake") {
                    restFakeAdapter.specificReset()
                        .then(()=>{
                            console.log(`   ✅ Reset adapter OK`)
                            done()
                        })
                        .catch(error=>{done(error)})
                } 
                else if(adapterScenario.name === "restGcp") {
                    restGcpDatastoreAdapter.specificReset()
                        .then(()=>{
                            console.log(`   ✅ Reset adapter OK`)
                            done()
                        })
                        .catch(error=>{done(error)})
                } 
                else {
                    console.log(`   ✅  Nothing to perform on adapter ${adapterScenario.name}`)
                    done()
                }
            })
            it(`claimById - error`,()=>{
                return adapterScenario.adapter.claimById(expectedSavedClaim.id)
                    .then(result=> expect(result).instanceOf(Error))
            })
            it(`claimByTitleUpperCase - error`,()=>{
                return adapterScenario.adapter.claimByTitleUpperCase(expectedSavedClaim.title)
                    .then(result=> expect(result).instanceOf(Error))
            })
            it(`isClaimExistByTitleUpperCase - error`,()=>{
                return adapterScenario.adapter.isClaimExistByTitleUpperCase(errorClaim.title)
                    .then(result=> expect(result).instanceOf(Error))
            })
            it(`retrieveClaimsThatContainInNotCaseSensitiveTitleOneOrMoreSearchCriteriaWords - error`,()=>{
                return adapterScenario.adapter.retrieveClaimsThatContainInNotCaseSensitiveTitleOneOrMoreSearchCriteriaWords([errorClaim.title])
                    .then(result=> expect(result).instanceOf(Error))
            })
            it(`saveClaim - error`,()=>{
                return adapterScenario.adapter.saveClaim(errorClaim)
                    .then(result=> expect(result).instanceOf(Error))
            })
            describe('save claim scenario',()=>{
                it(`isClaimExistByTitleUpperCase - The claim '${expectedSavedClaim.title}' don't exist.`,()=>{
                    return adapterScenario.adapter.isClaimExistByTitleUpperCase(expectedSavedClaim.title)
                        .then(result => expect(result).to.be.false)
                })
                it(`saveClaim - The claim '${expectedSavedClaim.title}' is saved.`,()=>{
                    return adapterScenario.adapter.saveClaim(expectedSavedClaim)
                        .then(result =>expect(result).not.instanceOf(Error))
                })
                it(`isClaimExistByTitleUpperCase - The claim '${expectedSavedClaim.title}' exist.`,()=>{
                    return adapterScenario.adapter.isClaimExistByTitleUpperCase(expectedSavedClaim.title)
                        .then(result =>expect(result).to.be.true)
                })
                it(`claimById - The claim '${expectedSavedClaim.title}' can be retrieved by Id.`,()=>{
                    return adapterScenario.adapter.claimById(expectedSavedClaim.id)
                        .then(result =>expect(result).deep.equal(expectedSavedClaim))
                })
                it(`claimByTitleUpperCase - The claim '${expectedSavedClaim.title}' can be retrieved by it's title.`,()=>{
                    return adapterScenario.adapter.claimByTitleUpperCase(expectedSavedClaim.title)
                        .then(result =>expect(result).deep.equal(expectedSavedClaim))
                })
                it(`retrieveClaimsThatContainInNotCaseSensitiveTitleOneOrMoreSearchCriteriaWords - The claim '${expectedSavedClaim.title}' is retrieved with '${goodSearchCriteria}' search criteria.`,()=>{
                    return adapterScenario.adapter.retrieveClaimsThatContainInNotCaseSensitiveTitleOneOrMoreSearchCriteriaWords(goodSearchCriteria.split(" "))
                        .then(result =>expect(result).deep.equal([expectedSavedClaim]))
                })
                it(`retrieveClaimsThatContainInNotCaseSensitiveTitleOneOrMoreSearchCriteriaWords - No claim is retrieved with '${badSearchCriteria}' search criteria.`,()=>{
                    return adapterScenario.adapter.retrieveClaimsThatContainInNotCaseSensitiveTitleOneOrMoreSearchCriteriaWords(badSearchCriteria.split(" "))
                        .then(result =>{
                            if (result instanceof Error) throw result
                            expect(result.length).equal(0)
                        })
                })
            })   
        })
    })
})

function retrieveScheme(restEndpointScheme: any): "http" | "https" {
    throw new Error('Function not implemented.');
}
