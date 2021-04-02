import 'mocha';
import {expect} from "chai";
import type { UserContract } from '../../client/port/UserContact';
import { FakeBangarangMembersInteractor } from '../../client/adapters/FakeBangarangMembersInteractor';
import type { ClaimChoice } from '../../client/port/ClaimChoice';
import type { BangarangMembersInteractorContract } from '../../client/port/interactors/BangarangMembersInteractorContract';
import { RestBangarangMembersInteractor } from '../../client/adapters/RestBangarangMembersInteractor';
describe(`Bangarang Member Interactor - Integration Test`,()=>{
    const goodUserPassword = "password"
    const badUserPassword = "badpassword"
    const claimTitle="claim"
    const expectedExistingUser:UserContract={username:"test",fullname:"",email:""}
    const badUser:UserContract={username:"error",fullname:"",email:""}
    interface AdapterScenario {
        name:string,
        adapter:BangarangMembersInteractorContract
    }
    const adapterScenarios:AdapterScenario[] = [
        {name:"fake",adapter:new FakeBangarangMembersInteractor()},
        {name:"REST",adapter:new RestBangarangMembersInteractor()},
    ]
    adapterScenarios.forEach(adapterScenario => {
        describe(`Integration Test with '${adapterScenario.name}' adapter.`,()=> {
            it(`retrievePreviousMemberClaimChoiceOnClaim - error`,()=>{
                return adapterScenario.adapter.retrievePreviousMemberClaimChoiceOnClaim(badUser.username,claimTitle)
                    .then(previousMemberClaimChoiceOnClaim =>expect(previousMemberClaimChoiceOnClaim).instanceOf(Error))
                    .catch(error => {throw error})
            })
            it(`retrievePreviousMemberClaimChoiceOnClaim & saveMemberClaim - OK`,()=>{
                const claimChoice:ClaimChoice = "For"
                return adapterScenario.adapter.retrievePreviousMemberClaimChoiceOnClaim(expectedExistingUser.username,claimTitle)
                    .then(previousMemberClaimChoiceOnClaim =>{
                        expect(previousMemberClaimChoiceOnClaim).is.undefined
                        return adapterScenario.adapter.saveMemberClaim({memberUsername:expectedExistingUser.username,claimChoice:claimChoice, claimTitle})
                    })
                    .then(result => {
                        expect(result).not.instanceOf(Error)
                        return adapterScenario.adapter.retrievePreviousMemberClaimChoiceOnClaim(expectedExistingUser.username,claimTitle)
                    })
                    .then(previousMemberClaimChoiceOnClaim =>{expect(previousMemberClaimChoiceOnClaim).equal(claimChoice).and.is.not.undefined})
                    .catch(error => {throw error})
            })
            it(`saveMember - error - Member not saved`,()=>{
                return adapterScenario.adapter.saveMember(badUser)
                    .then(result => expect(result).instanceOf(Error))
                    .catch(error => {throw error})
                
            })
            it(`specificFindMemberFromUsername & saveMember - OK - Member saved and exist`,()=>{
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
            it(`isSignedIn & signingIn - OK - NotSignedIn & SigningIn with bad credentials`,()=>{
                return adapterScenario.adapter.isSignedIn(expectedExistingUser.username)
                    .then( isSignedIn => {
                        expect(isSignedIn).is.false
                        return adapterScenario.adapter.signingIn({username:expectedExistingUser.username,password:badUserPassword})
                    })
                    .then(result=>{
                        expect(result).instanceOf(Error)
                        return adapterScenario.adapter.isSignedIn(expectedExistingUser.username)
                    })
                    .then( isSignedIn => {expect(isSignedIn).is.false})
                    .catch(error => {throw error})
                
            })
            it(`isSignedIn & signingIn - OK - NotSignedIn & SigningIn with good credentials`,()=>{
                return adapterScenario.adapter.isSignedIn(expectedExistingUser.username)
                    .then( isSignedIn => {
                        expect(isSignedIn).is.false
                        return adapterScenario.adapter.signingIn({username:expectedExistingUser.username,password:goodUserPassword})
                    })
                    .then(result=> {
                        expect(result).not.instanceOf(Error)
                        return adapterScenario.adapter.isSignedIn(expectedExistingUser.username)
                    })
                    .then( isSignedIn => {
                        expect(isSignedIn).is.true
                    })
                    .catch(error => {throw error})
            })
        })
    })
})

