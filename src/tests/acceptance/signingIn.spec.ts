import 'mocha';
import {expect} from "chai";
import type { UserContract } from '../../client/port/UserContact';
import type { User } from '../../client/businessLogic/User';
import { UserBuilder } from '../../client/businessLogic/UserBuilder';
import { FakeBangarangMembersInteractor } from '../../client/adapters/FakeBangarangMembersInteractor';
import { FakeSigningInUserNotificationInteractor } from '../../client/adapters/FakeSigningInUserNotificationInteractor';
import { SigningInNotificationType, successSigningInNotification, alreadySignedInSigningInNotification, badCredentialsSigningInNotification } from '../../client/port/interactors/SigningInUserNotificationInteractorContract';
import { FakeBangarangClaimInteractor } from "../../client/adapters/FakeBangarangClaimInteractor";
import { bangarangMemberNotFoundError } from '../../client/port/interactors/BangarangMembersInteractorContract';
describe(`Feature: Signing In
    As a guest
    In order to claim
    I want to sign in Bangarang
    `,()=> {
    const fakeBangarangClaimInteractor = new FakeBangarangClaimInteractor()
    const fakeSigningInUserNotificationInteractor = new FakeSigningInUserNotificationInteractor()
    const expectedUserPassword = "Password";
    const expectedUser:UserContract= {username:"johndoe",fullname:"",email:""}
    const signingInNotificationType:SigningInNotificationType = "Signing In"
    describe(`Scenario: User Signing In`,()=> {
        const bangarangMembersInteractor = new FakeBangarangMembersInteractor();
        bangarangMembersInteractor.specificWithMembers([expectedUser])
        bangarangMembersInteractor.specificWithCredentials([{username:expectedUser.username,password:expectedUserPassword}])
        const user:User = new UserBuilder()
            .withUserContract(expectedUser)
            .withBangarangMembersInteractor(bangarangMembersInteractor)
            .withBangarangClaimInteractor(fakeBangarangClaimInteractor)
            .withSigningInUserNotificationInteractor(fakeSigningInUserNotificationInteractor)
            .getUser()
        it(`Given the user is not signed in`,()=> {
            return bangarangMembersInteractor.isSignedIn(expectedUser.username)
                .then(isSignedIn => expect(isSignedIn).is.false) 
        })
        it(`And there is '${expectedUser.username}' Bangarang member with password '${expectedUserPassword}'`,()=> {
            expect(bangarangMembersInteractor.specificFindMemberFromUsername(expectedUser.username)).deep.equal(expectedUser)
            expect(bangarangMembersInteractor.specificFindMemberPasswordFromUsername(expectedUser.username)).deep.equal(expectedUserPassword)
        })
        it(`When the user signin as '${expectedUser.username}' with password '${expectedUserPassword}'`,(done)=> {
            user.signingIn(expectedUserPassword).then(()=>done())
        })
        it(`Then the user is signed in as a Bangarang member with the following information:
            | username | user fullname |
            | ${expectedUser.username}  | ${expectedUser.fullname}      |`,()=> {
            expect(user.username).equal(expectedUser.username)
            expect(user.fullname).equal(expectedUser.fullname)
        })
        it(`And the user is Signed In`,()=> {
            return bangarangMembersInteractor.isSignedIn(expectedUser.username)
                .then(isSignedIn => expect(isSignedIn).is.true) 
        })
        it(`And the user has a '${signingInNotificationType}' notification with '${successSigningInNotification.status}' status and '${successSigningInNotification.message}' message.`,()=> {
            expect(fakeSigningInUserNotificationInteractor.currentUserNotification?.message).equal(successSigningInNotification.message)
            expect(fakeSigningInUserNotificationInteractor.currentUserNotification?.status).equal(successSigningInNotification.status)
        })
    })
    describe(`Scenario: User already signed in`,()=>{
        const bangarangMembersInteractor = new FakeBangarangMembersInteractor()
        bangarangMembersInteractor.specificWithMembers([expectedUser])
        bangarangMembersInteractor.specificWithCredentials([{username:expectedUser.username,password:expectedUserPassword}])
        const user:User = new UserBuilder()
            .withUserContract(expectedUser)
            .withBangarangMembersInteractor(bangarangMembersInteractor)
            .withBangarangClaimInteractor(fakeBangarangClaimInteractor)
            .withSigningInUserNotificationInteractor(fakeSigningInUserNotificationInteractor)
            .getUser()
        before(()=>user.signingIn(expectedUserPassword))
        it(`Given the user is already SignedIn`,()=>{
            return bangarangMembersInteractor.isSignedIn(expectedUser.username)
                .then(isSignedIn => expect(isSignedIn).is.true) 
        })
        it(`When the user signin as '${expectedUser.username}' with password '${expectedUserPassword}'`,(done)=> {
            user.signingIn(expectedUserPassword)
            done()
        })
        it(`Then the user has a '${signingInNotificationType}' notification with '${alreadySignedInSigningInNotification.status}' status and '${alreadySignedInSigningInNotification.message}' message.`,()=> {
            expect(fakeSigningInUserNotificationInteractor.currentUserNotification?.message).equal(alreadySignedInSigningInNotification.message)
            expect(fakeSigningInUserNotificationInteractor.currentUserNotification?.status).equal(alreadySignedInSigningInNotification.status)
        })
    })
    describe(`Scenario: User is not a Bangarang member`,()=>{
        const bangarangMembersInteractor = new FakeBangarangMembersInteractor()
        bangarangMembersInteractor.specificWithCredentials([{username:expectedUser.username,password:expectedUserPassword}])
        const user:User = new UserBuilder()
            .withUserContract(expectedUser)
            .withBangarangMembersInteractor(bangarangMembersInteractor)
            .withBangarangClaimInteractor(fakeBangarangClaimInteractor)
            .withSigningInUserNotificationInteractor(fakeSigningInUserNotificationInteractor)
            .getUser()
        it(`Given the user is not signed in`,()=>{
            return bangarangMembersInteractor.isSignedIn(expectedUser.username)
                .then(isSignedIn => expect(isSignedIn).is.false) 
        })
        it(`And there is no '${expectedUser.username}' Bangarang member'`,()=> {
            expect(()=>{bangarangMembersInteractor.specificFindMemberFromUsername(expectedUser.username)})
                .to.throw(bangarangMemberNotFoundError(expectedUser.username))
        })
        it(`When the user signin as '${expectedUser.username}' with password '${expectedUserPassword}'`,(done)=> {
            user.signingIn(expectedUserPassword)
            done()
        })
        it(`Then the user has a '${signingInNotificationType}' notification with '${badCredentialsSigningInNotification.status}' status and '${badCredentialsSigningInNotification.message}' message.`,()=> {
            expect(fakeSigningInUserNotificationInteractor.currentUserNotification?.message).equal(badCredentialsSigningInNotification.message)
            expect(fakeSigningInUserNotificationInteractor.currentUserNotification?.status).equal(badCredentialsSigningInNotification.status)
        })
    })
    describe(`Scenario: Bad credentials`,()=>{
        const bangarangMembersInteractor = new FakeBangarangMembersInteractor()
        bangarangMembersInteractor.specificWithMembers([expectedUser])
        bangarangMembersInteractor.specificWithCredentials([{username:expectedUser.username,password:expectedUserPassword}])
        const badPassword="baspassword"
        //const badPasswordUser:UserContract = {username:"johndoe",fullname:"",email:""}
        const user:User = new UserBuilder()
            .withUserContract(expectedUser)
            .withBangarangMembersInteractor(bangarangMembersInteractor)
            .withBangarangClaimInteractor(fakeBangarangClaimInteractor)
            .withSigningInUserNotificationInteractor(fakeSigningInUserNotificationInteractor)
            .getUser()
        it(`Given the user is not signed in`,()=>{
            return bangarangMembersInteractor.isSignedIn(expectedUser.username)
                .then(isSignedIn => expect(isSignedIn).is.false) 
        })
        it(`And there is '${expectedUser.username}' Bangarang member with password '${expectedUserPassword}'`,()=> {
            expect(bangarangMembersInteractor.specificFindMemberFromUsername(expectedUser.username)).deep.equal(expectedUser)
            expect(bangarangMembersInteractor.specificFindMemberPasswordFromUsername(expectedUser.username)).deep.equal(expectedUserPassword)
        })
        it(`When the user signin as '${expectedUser.username}' with password '${badPassword}'`,(done)=> {
            user.signingIn(badPassword)
            done()
        })
        it(`Then the user has a '${signingInNotificationType}' notification with '${badCredentialsSigningInNotification.status}' status and '${badCredentialsSigningInNotification.message}' message.`,()=> {
            expect(fakeSigningInUserNotificationInteractor.currentUserNotification?.status).equal(badCredentialsSigningInNotification.status)
            expect(fakeSigningInUserNotificationInteractor.currentUserNotification?.message).equal(badCredentialsSigningInNotification.message)
        })
    })
})