import 'mocha';
import {expect} from "chai";
import type { UserContract } from '../../client/port/UserContact';
import type { ClaimChoice } from '../../client/port/ClaimChoice';
import type { BangarangMembersInteractorContract } from '../../client/port/interactors/BangarangMembersInteractorContract';
import { FakeBangarangMembersInteractor } from '../../client/adapters/FakeBangarangMembersInteractor';
import { RestBangarangMembersInteractor } from '../../client/adapters/RestBangarangMembersInteractor';
import { RestInteractor } from '../../client/adapters/RestInteractor';
describe(`Bangarang Member Interactor - Integration Test`,()=>{
    const goodUserPassword = "password"
    const badUserPassword = "badpassword"
    const claimId="claimId"
    const expectedExistingUser:UserContract={username:"test",fullname:"",email:""}
    const expectedUnexistingUser:UserContract={username:"idontexist",fullname:"",email:""}
    const badUser:UserContract={username:"error",fullname:"",email:""}
    interface AdapterScenario {
        name:string,
        adapter:BangarangMembersInteractorContract
    }
    const restFakeAdapter =new RestBangarangMembersInteractor(new RestInteractor({endpointFullyQualifiedDomainName:"localhost",port:"3000",apiPrefix:"restFakeMemberInteractor",scheme:"http"}))
    const restGcpAdapter =new RestBangarangMembersInteractor(new RestInteractor({endpointFullyQualifiedDomainName:"localhost",port:"3000",apiPrefix:"restGcpDatastoreMemberInteractor",scheme:"http"}))
    const adapterScenarios:AdapterScenario[] = [
        {name:"fake",adapter:new FakeBangarangMembersInteractor()},
        {name:"RESTfake",adapter:restFakeAdapter},
        {name:"RESTGCPDatastore",adapter:restGcpAdapter},
    ]
    adapterScenarios.forEach(adapterScenario => {
        describe(`Integration Test with '${adapterScenario.name}' adapter.`,()=> {
            before((done)=>{
                console.log(`   🛠  Reset adapter call : ${adapterScenario.name}`)
                if(adapterScenario.name === "RESTfake") {
                    restFakeAdapter.specificReset()
                        .then(()=>{
                            console.log(`   ✅ Reset adapter OK`)
                            done()
                        })
                        .catch(error=>{done(error)})
                } 
                else if (adapterScenario.name === "RESTGCPDatastore") {
                    restGcpAdapter.specificReset()
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
            it(`retrievePreviousMemberClaimChoiceOnClaim - error`,()=>{
                return adapterScenario.adapter.retrievePreviousMemberClaimChoiceOnClaim(badUser.username,claimId)
                    .then(previousMemberClaimChoiceOnClaim =>expect(previousMemberClaimChoiceOnClaim).instanceOf(Error))
                    .catch(error => {throw error})
            })
            it(`retrievePreviousMemberClaimChoiceOnClaim & saveMemberClaim - ${expectedExistingUser.username+claimId} - OK`,()=>{
                const claimChoice:ClaimChoice = "For"
                return adapterScenario.adapter.retrievePreviousMemberClaimChoiceOnClaim(expectedExistingUser.username,claimId)
                    .then(previousMemberClaimChoiceOnClaim =>{
                        expect(previousMemberClaimChoiceOnClaim).is.undefined
                        return adapterScenario.adapter.saveMemberClaim({memberUsername:expectedExistingUser.username,claimChoice, claimId})
                    })
                    .then(result => {
                        expect(result).not.instanceOf(Error)
                        return adapterScenario.adapter.retrievePreviousMemberClaimChoiceOnClaim(expectedExistingUser.username,claimId)
                    })
                    .then(previousMemberClaimChoiceOnClaim =>{
                        expect(previousMemberClaimChoiceOnClaim).equal(claimChoice).and.is.not.undefined
                    })
                    .catch(error => {throw error})
            })
            it(`saveMember - error - Member not saved`,()=>{
                return adapterScenario.adapter.saveMember(badUser)
                    .then(result => expect(result).instanceOf(Error))
                    .catch(error => {throw error})
                
            })
            it(`isMemberExistWithUsername & saveMember - OK - Member '${expectedExistingUser.username}' saved and exist`,()=>{
                return adapterScenario.adapter.isMemberExistWithUsername(expectedExistingUser.username)
                    .then(memberExist => {
                        expect(memberExist).to.be.false
                        return adapterScenario.adapter.saveMember(expectedExistingUser)
                    })
                    .then(result => {
                        expect(result).not.instanceOf(Error)
                        return adapterScenario.adapter.isMemberExistWithUsername(expectedExistingUser.username)
                    })
                    .then(memberExist => {expect(memberExist).to.be.true})
                    .catch(error => {throw error})
                
            })
            it(`saveCredentials - OK - Credentials saved`,()=>{
                return adapterScenario.adapter.saveCredentials({username:expectedExistingUser.username,password:goodUserPassword})
                    .then(result => expect(result).not.instanceOf(Error))
                    .catch(error => {throw error})
                
            })
            it(`saveCredentials - error - Credentials not saved`,()=>{
                return adapterScenario.adapter.saveCredentials({username:badUser.username,password:goodUserPassword})
                    .then(result=> expect(result).instanceOf(Error))
                    .catch(error => {throw error})
            })
            it(`isCredentialsValid - OK - isCredentialsValid with bad password`,()=>{
                return adapterScenario.adapter.isCredentialsValid({username:expectedExistingUser.username,password:badUserPassword})
                    .then(result=> {expect(result).is.false})
                    .catch(error => {throw error})
            })
            it(`isCredentialsValid - OK - isCredentialsValid with unexisting credentials`,()=>{
                return adapterScenario.adapter.isCredentialsValid({username:expectedUnexistingUser.username,password:goodUserPassword})
                    .then(result=> {expect(result).is.false})
                    .catch(error => {throw error})
            })
            it(`isCredentialsValid - OK - isCredentialsValid with good credentials`,()=>{
                return adapterScenario.adapter.isCredentialsValid({username:expectedExistingUser.username,password:goodUserPassword})
                    .then(result=> {expect(result).is.true})
                    .catch(error => {throw error})
            })
            it(`retrieveUserContract - Error`,()=>{
                return adapterScenario.adapter.retrieveUserContract(badUser.username)
                    .then(result => expect(result).instanceOf(Error))
                    .catch(error => {throw error})
            })
            it(`retrieveUserContract - OK - UserExist`,()=>{
                return adapterScenario.adapter.retrieveUserContract(expectedExistingUser.username)
                    .then(result => {
                        expect(result).deep.equal(expectedExistingUser)
                    })
                    .catch(error => {throw error})
            })
            it(`retrieveUserContract - OK - User don't exist`,()=>{
                return adapterScenario.adapter.retrieveUserContract(expectedUnexistingUser.username)
                    .then(result => {
                        expect(result).is.undefined
                    })
                    .catch(error => {throw error})
            })
        })
    })
})

function retrieveScheme(restEndpointScheme: string): "http" | "https" {
    throw new Error('Function not implemented.');
}

