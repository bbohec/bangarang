import 'mocha';
import {expect} from "chai";
import type { UserContact } from '../../client/port/UserContact';
import { FakeBangarangMembersInteractor } from '../../client/adapters/FakeBangarangMembersInteractor';
describe(`Bangarang Member Interactor - Integration Test`,()=>{
    const expectedUser:UserContact={username:"test",password:"",fullname:""}
    const fakeBangarangMembersInteractor = new FakeBangarangMembersInteractor([expectedUser])
    it(`user exist on interactor`,()=>{
        expect(fakeBangarangMembersInteractor.findBangarangMemberFromUsername(expectedUser.username).username).equal(expectedUser.username)
    })
    it(`user is not signed in on interactor`,()=>{
        expect(fakeBangarangMembersInteractor.isSignedIn(expectedUser.username)).is.false
    })
    it(`user is signing in on interactor`,(done)=>{
        fakeBangarangMembersInteractor.signingIn(expectedUser.username,expectedUser.password)
        done()
    })
    it(`user is signed in on interactor`,()=>{
        expect(fakeBangarangMembersInteractor.isSignedIn(expectedUser.username)).is.true
    })
})