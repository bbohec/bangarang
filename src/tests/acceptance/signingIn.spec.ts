import 'mocha';
import {expect} from "chai";
import { FakeBangarangMembersInteractor } from '../../client/adapters/FakeBangarangMembersInteractor';
import { FakeSigningInUserNotificationInteractor } from '../../client/adapters/FakeSigningInUserNotificationInteractor';
import { User } from '../../client/businessLogic/User';
import type { UserContract } from '../../client/port/UserContact';
import { SigningInNotificationType, successSigningInNotification, alreadySignedInSigningInNotification, badCredentialsSigningInNotification } from '../../client/port/interactors/SigningInUserNotificationInteractorContract';
import { FakeBangarangClaimInteractor } from "../../client/adapters/FakeBangarangClaimInteractor";
import { FakeDeclaringClaimUserNotificationInteractor } from "../../client/adapters/FakeDeclaringClaimUserNotificationInteractor";
import { FakeRetrievingClaimUserNotificationInteractor } from "../../client/adapters/FakeRetrievingClaimUserNotificationInteractor";
import { FakeBangarangUserInterfaceInteractor } from '../../client/adapters/FakeBangarangUserInterfaceInteractor';
import { bangarangMemberNotFoundError } from '../../client/port/interactors/BangarangMembersInteractorContract';
import { FakeSearchingClaimsUserNotificationInteractor } from '../../client/adapters/FakeSearchingClaimsUserNotificationInteractorContract';
describe(`Feature: User Sign In
    As a guest
    In order to claim
    I want to sign in Bangarang
    `,()=> {
    const fakeBangarangClaimInteractor = new FakeBangarangClaimInteractor()
    const fakeSigningInUserNotificationInteractor = new FakeSigningInUserNotificationInteractor()
    const expectedUser:UserContract= {username:"johndoe",fullname:"",password:"Password"}
    const signingInNotificationType:SigningInNotificationType = "Signing In"
    describe(`Scenario: User Signing In`,()=> {
        const fakeBangarangMembersInteractor = new FakeBangarangMembersInteractor();
        fakeBangarangMembersInteractor.withBangarangMembersDatabase([expectedUser])
        const user:User = new User(expectedUser,{
            bangarangMembersInteractor:fakeBangarangMembersInteractor,
            signingInUserNotificationInteractor:fakeSigningInUserNotificationInteractor,
            declaringClaimUserNotificationInteractor:new FakeDeclaringClaimUserNotificationInteractor(),
            bangarangClaimInteractor:fakeBangarangClaimInteractor,
            bangarangUserInterfaceInteractor: new FakeBangarangUserInterfaceInteractor(),
            retrievingClaimUserNotificationInteractor:new FakeRetrievingClaimUserNotificationInteractor(),
            searchingClaimsUserNotificationInteractor:new FakeSearchingClaimsUserNotificationInteractor()
        })
        it(`Given the user is not signed in`,()=> {
            expect(user.isSignedIn()).to.be.false
        })
        it(`And there is '${expectedUser.username}' Bangarang member with password '${expectedUser.password}'`,()=> {
            expect(fakeBangarangMembersInteractor.findBangarangMemberFromUsername(expectedUser.username).password).equal(expectedUser.password)
        })
        it(`When the user signin as '${expectedUser.username}' with password '${expectedUser.password}'`,(done)=> {
            user.signingIn()
            done()
        })
        it(`Then the user is signed in as a Bangarang member with the following information:
            | username | user fullname |
            | ${expectedUser.username}  | ${expectedUser.fullname}      |`,()=> {
            expect(user.username).equal(expectedUser.username)
            expect(user.fullname).equal(expectedUser.fullname)
        })
        it(`And the user is Signed In`,()=> {
            expect(user.isSignedIn()).to.be.true
        })
        it(`And the user has a '${signingInNotificationType}' notification with '${successSigningInNotification.status}' status and '${successSigningInNotification.message}' message.`,()=> {
            expect(fakeSigningInUserNotificationInteractor.currentUserNotification?.status).equal(successSigningInNotification.status)
            expect(fakeSigningInUserNotificationInteractor.currentUserNotification?.message).equal(successSigningInNotification.message)
        })
    })
    describe(`Scenario: User already signed in`,()=>{
        const fakeBangarangMembersInteractor = new FakeBangarangMembersInteractor()
        fakeBangarangMembersInteractor.withBangarangMembersDatabase([expectedUser])
        const user:User = new User(expectedUser,{
            bangarangMembersInteractor:fakeBangarangMembersInteractor,
            declaringClaimUserNotificationInteractor:new FakeDeclaringClaimUserNotificationInteractor(),
            signingInUserNotificationInteractor:fakeSigningInUserNotificationInteractor,
            bangarangClaimInteractor:fakeBangarangClaimInteractor,
            bangarangUserInterfaceInteractor: new FakeBangarangUserInterfaceInteractor(),
            retrievingClaimUserNotificationInteractor:new FakeRetrievingClaimUserNotificationInteractor(),
            searchingClaimsUserNotificationInteractor:new FakeSearchingClaimsUserNotificationInteractor()
        })
        before(()=>user.signingIn())
        it(`Given the user is already SignedIn`,()=>{
            expect(user.isSignedIn()).is.true
        })
        it(`When the user signin as '${expectedUser.username}' with password '${expectedUser.password}'`,(done)=> {
            user.signingIn()
            done()
        })
        it(`Then the user has a '${signingInNotificationType}' notification with '${alreadySignedInSigningInNotification.status}' status and '${alreadySignedInSigningInNotification.message}' message.`,()=> {
            expect(fakeSigningInUserNotificationInteractor.currentUserNotification?.status).equal(alreadySignedInSigningInNotification.status)
            expect(fakeSigningInUserNotificationInteractor.currentUserNotification?.message).equal(alreadySignedInSigningInNotification.message)
        })
    })
    describe(`Scenario: User is not a Bangarang member`,()=>{
        const fakeBangarangMembersInteractor = new FakeBangarangMembersInteractor()
        const user:User = new User(expectedUser,{
            bangarangMembersInteractor:fakeBangarangMembersInteractor,
            declaringClaimUserNotificationInteractor:new FakeDeclaringClaimUserNotificationInteractor(),
            signingInUserNotificationInteractor:fakeSigningInUserNotificationInteractor,
            bangarangClaimInteractor:fakeBangarangClaimInteractor,
            bangarangUserInterfaceInteractor: new FakeBangarangUserInterfaceInteractor(),
            retrievingClaimUserNotificationInteractor:new FakeRetrievingClaimUserNotificationInteractor(),
            searchingClaimsUserNotificationInteractor:new FakeSearchingClaimsUserNotificationInteractor()
        })
        it(`Given the user is not signed in`,()=>{
            expect(user.isSignedIn()).is.false
        })
        it(`And there is no '${expectedUser.username}' Bangarang member'`,()=> {
            expect(()=>{fakeBangarangMembersInteractor.findBangarangMemberFromUsername(expectedUser.username)})
                .to.throw(bangarangMemberNotFoundError(expectedUser.username))
        })
        it(`When the user signin as '${expectedUser.username}' with password '${expectedUser.password}'`,(done)=> {
            user.signingIn()
            done()
        })
        it(`Then the user has a '${signingInNotificationType}' notification with '${badCredentialsSigningInNotification.status}' status and '${badCredentialsSigningInNotification.message}' message.`,()=> {
            expect(fakeSigningInUserNotificationInteractor.currentUserNotification?.status).equal(badCredentialsSigningInNotification.status)
            expect(fakeSigningInUserNotificationInteractor.currentUserNotification?.message).equal(badCredentialsSigningInNotification.message)
        })
    })
    describe(`Scenario: Bad credentials`,()=>{
        const fakeBangarangMembersInteractor = new FakeBangarangMembersInteractor()
        fakeBangarangMembersInteractor.withBangarangMembersDatabase([expectedUser])
        const badPasswordUser:UserContract = {username:"johndoe",fullname:"",password:"badpassword"}
        const user:User = new User(badPasswordUser,{
            bangarangMembersInteractor:fakeBangarangMembersInteractor,
            declaringClaimUserNotificationInteractor:new FakeDeclaringClaimUserNotificationInteractor(),
            signingInUserNotificationInteractor:fakeSigningInUserNotificationInteractor,
            bangarangClaimInteractor:fakeBangarangClaimInteractor,
            bangarangUserInterfaceInteractor: new FakeBangarangUserInterfaceInteractor(),
            retrievingClaimUserNotificationInteractor:new FakeRetrievingClaimUserNotificationInteractor(),
            searchingClaimsUserNotificationInteractor:new FakeSearchingClaimsUserNotificationInteractor()
        })
        it(`Given the user is not signed in`,()=>{
            expect(user.isSignedIn()).is.false
        })
        it(`And there is '${expectedUser.username}' Bangarang member with password '${expectedUser.password}'`,()=> {
            expect(fakeBangarangMembersInteractor.findBangarangMemberFromUsername(expectedUser.username).password).equal(expectedUser.password)
        })
        it(`When the user signin as '${badPasswordUser.username}' with password '${badPasswordUser.password}'`,(done)=> {
            user.signingIn()
            done()
        })
        it(`Then the user has a '${signingInNotificationType}' notification with '${badCredentialsSigningInNotification.status}' status and '${badCredentialsSigningInNotification.message}' message.`,()=> {
            expect(fakeSigningInUserNotificationInteractor.currentUserNotification?.status).equal(badCredentialsSigningInNotification.status)
            expect(fakeSigningInUserNotificationInteractor.currentUserNotification?.message).equal(badCredentialsSigningInNotification.message)
        })
    })
})