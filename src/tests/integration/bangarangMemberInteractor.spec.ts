import 'mocha';
import {expect} from "chai";
import type { UserContract } from '../../client/port/UserContact';
import { FakeBangarangMembersInteractor } from '../../client/adapters/FakeBangarangMembersInteractor';
describe(`Bangarang Member Interactor - Integration Test`,()=>{
    const userPassword = ""
    const expectedUser:UserContract={username:"test",fullname:"",email:""}
    const fakeBangarangMembersInteractor = new FakeBangarangMembersInteractor()
    fakeBangarangMembersInteractor.specificWithMembers([expectedUser])
    it(`user exist on interactor`,()=>{
        expect(fakeBangarangMembersInteractor.specificFindMemberFromUsername(expectedUser.username).username).equal(expectedUser.username)
    })
    it(`user is not signed in on interactor`,()=>{
        expect(fakeBangarangMembersInteractor.isSignedIn(expectedUser.username)).is.false
    })
    it(`user is signing in on interactor`,(done)=>{
        fakeBangarangMembersInteractor.signingIn({username:expectedUser.username,password:userPassword})
        done()
    })
    it(`user is signed in on interactor`,()=>{
        expect(fakeBangarangMembersInteractor.isSignedIn(expectedUser.username)).is.true
    })
})