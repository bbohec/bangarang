import 'mocha';
import {expect} from "chai";
import type { UserContract } from '../../client/port/UserContact';
import { UserBuilder } from '../../client/businessLogic/UserBuilder';
import { FakeBangarangMembersInteractor } from '../../client/adapters/FakeBangarangMembersInteractor';
import { bangarangMemberNotFoundError } from '../../client/port/interactors/BangarangMembersInteractorContract';
import { FakeRegisteringUserNotificationInteractor } from '../../client/adapters/FakeRegisteringUserNotificationInteractor';
import { alreadyMemberRegisteringUserNotification, badEmailRegisteringUserNotification, RegisteringNotificationType, RegisteringUserNotificationContract, RegisteringUserNotificationInteractorContract, successRegisteringUserNotification, unsecurePasswordRegisteringUserNotification } from '../../client/port/interactors/RegisteringUserNotificationInteractorContract';
import { credentialsMissing } from '../../client/port/bangarangMemberCredential';
describe(`Feature: Registering
    As a guest,
    In order to claim,
    I want to register on Bangarang.`,()=> {
    interface scenario {
        title:string
        userContract:UserContract
        userPassword:string
        bangarangMemberInteractor:FakeBangarangMembersInteractor
        registeringUserNotificationInteractor:FakeRegisteringUserNotificationInteractor
        expectedNotification:RegisteringUserNotificationContract
        thenUserShouldBeRegistered:boolean
        alreadyHaveBangarangMember?:{user:UserContract,password:string}
    }
    const registeringNotificationType:RegisteringNotificationType = "Registering."
    const scenarios:scenario[] = [
        {
            title:"Register on Bangarang.",
            userContract:{username:"johndoe",fullname:"John Doe",email:"john@doe.com"} ,
            userPassword:"\"(VRVdFrr4jF'Rx7",
            bangarangMemberInteractor:new FakeBangarangMembersInteractor(),
            registeringUserNotificationInteractor:new FakeRegisteringUserNotificationInteractor(),
            thenUserShouldBeRegistered:true,
            expectedNotification:successRegisteringUserNotification
        },
        {
            title:"Invalid email.",
            userContract:{username:"johndoe",fullname:"John Doe",email:"johndoe.com"} ,
            userPassword:"\"(VRVdFrr4jF'Rx7",
            bangarangMemberInteractor:new FakeBangarangMembersInteractor(),
            registeringUserNotificationInteractor:new FakeRegisteringUserNotificationInteractor(),
            thenUserShouldBeRegistered:false,
            expectedNotification:badEmailRegisteringUserNotification
        },
        {
            title:"Invalid email 2.",
            userContract:{username:"johndoe",fullname:"John Doe",email:"john@doe."} ,
            userPassword:"\"(VRVdFrr4jF'Rx7",
            bangarangMemberInteractor:new FakeBangarangMembersInteractor(),
            registeringUserNotificationInteractor:new FakeRegisteringUserNotificationInteractor(),
            thenUserShouldBeRegistered:false,
            expectedNotification:badEmailRegisteringUserNotification
        },
        {
            title:"Unsecure Password.",
            userContract:{username:"johndoe",fullname:"John Doe",email:"john@doe.com"} ,
            userPassword:"password",
            bangarangMemberInteractor:new FakeBangarangMembersInteractor(),
            registeringUserNotificationInteractor:new FakeRegisteringUserNotificationInteractor(),
            thenUserShouldBeRegistered:false,
            expectedNotification:unsecurePasswordRegisteringUserNotification
        },
        {
            title:"Already member of Bangarang.",
            userContract:{username:"johndoe",fullname:"Johnny Doe",email:"johnny@doe.com"} ,
            userPassword:"\"(VRVsdfsdfdFrr4jF'Rx7",
            bangarangMemberInteractor:new FakeBangarangMembersInteractor(),
            registeringUserNotificationInteractor:new FakeRegisteringUserNotificationInteractor(),
            thenUserShouldBeRegistered:false,
            expectedNotification:alreadyMemberRegisteringUserNotification,
            alreadyHaveBangarangMember:{
                user:{username:"johndoe",fullname:"John Doe",email:"john@doe.com"},
                password:"\"(VRVdFrr4jF'Rx7"
            }
        }
    ]
    scenarios.forEach(scenario => {
        describe(`
    Scenario: ${scenario.title}`,()=>{
            
            const user =new UserBuilder()
                .withUserContract(scenario.userContract)
                .withBangarangMembersInteractor(scenario.bangarangMemberInteractor)
                .withRegisteringUserNotificationInteractor(scenario.registeringUserNotificationInteractor)
                .getUser()
            before(()=>{
                if (scenario.alreadyHaveBangarangMember) {
                    scenario.bangarangMemberInteractor.specificWithMembers([scenario.alreadyHaveBangarangMember.user])
                    scenario.bangarangMemberInteractor.specificWithCredentials([{username:scenario.alreadyHaveBangarangMember.user.username,password:scenario.alreadyHaveBangarangMember.password}])
                }
            })
            
            it(`Given the user is not signed in as '${user.username}'.`,()=>{
                expect(scenario.bangarangMemberInteractor.isSignedIn(scenario.userContract.username)).to.be.false
            })
            if (!scenario.alreadyHaveBangarangMember)it(`And there is no '${scenario.userContract.username}' Bangarang member'`,()=> {
                    expect(()=>{scenario.bangarangMemberInteractor.specificFindMemberFromUsername(scenario.userContract.username)})
                        .to.throw(bangarangMemberNotFoundError(scenario.userContract.username))
                    expect(()=>{scenario.bangarangMemberInteractor.specificFindMemberPasswordFromUsername(scenario.userContract.username)})
                        .to.throw(credentialsMissing(scenario.userContract.username))
                }) 
            else {
                const bangarangMember = scenario.alreadyHaveBangarangMember
                it(`And '${bangarangMember.user.username}' is a Bangarang member with the following parameters:
            | username | password           | email         | fullname  |
            | ${bangarangMember.user.username}  | ${bangarangMember.password}   |  ${bangarangMember.user.email} | ${bangarangMember.user.fullname}  |`,()=> {
                    expect(scenario.bangarangMemberInteractor.specificFindMemberFromUsername(bangarangMember.user.username)).deep.equal(bangarangMember.user)
                    expect(scenario.bangarangMemberInteractor.specificFindMemberPasswordFromUsername(bangarangMember.user.username)).equal(bangarangMember.password)
                })
            }
            it(`When the user register on Bangarang with the following parameters:
            | username | password           | email         | fullname  |
            | ${scenario.userContract.username}  | ${scenario.userPassword}   |  ${scenario.userContract.email} | ${scenario.userContract.fullname}  |`,(done)=> {
                user.registering(scenario.userPassword)
                done()
            })
            if (scenario.alreadyHaveBangarangMember) {
                const bangarangMember = scenario.alreadyHaveBangarangMember
                it(`Then '${bangarangMember.user.username}' is a Bangarang member with the following parameters:
            | username | password           | email         | fullname  |
            | ${bangarangMember.user.username}  | ${bangarangMember.password}   |  ${bangarangMember.user.email} | ${bangarangMember.user.fullname}  |`,()=> {
                    expect(scenario.bangarangMemberInteractor.specificFindMemberFromUsername(bangarangMember.user.username)).deep.equal(bangarangMember.user)
                    expect(scenario.bangarangMemberInteractor.specificFindMemberPasswordFromUsername(bangarangMember.user.username)).equal(bangarangMember.password)
                })
            }
            else if (scenario.thenUserShouldBeRegistered) it(`Then '${scenario.userContract.username}' is a Bangarang member with the following parameters:
            | username | password           | email         | fullname  |
            | ${scenario.userContract.username}  | ${scenario.userPassword}   |  ${scenario.userContract.email} | ${scenario.userContract.fullname}  |`,()=> {
                    expect(scenario.bangarangMemberInteractor.specificFindMemberFromUsername(scenario.userContract.username)).deep.equal(scenario.userContract)
                    expect(scenario.bangarangMemberInteractor.specificFindMemberPasswordFromUsername(scenario.userContract.username)).equal(scenario.userPassword)
                })
            else it(`And there is no '${scenario.userContract.username}' Bangarang member'`,()=> {
                    expect(()=>{scenario.bangarangMemberInteractor.specificFindMemberFromUsername(scenario.userContract.username)})
                        .to.throw(bangarangMemberNotFoundError(scenario.userContract.username))
                    expect(()=>{scenario.bangarangMemberInteractor.specificFindMemberPasswordFromUsername(scenario.userContract.username)})
                        .to.throw(credentialsMissing(scenario.userContract.username))
                })
            it(`And the user has a '${registeringNotificationType}' notification with '${scenario.expectedNotification.status}' status and '${scenario.expectedNotification.message}' message.`,()=> {
                expect(scenario.registeringUserNotificationInteractor.currentUserNotification?.message).equal(scenario.expectedNotification.message)
                expect(scenario.registeringUserNotificationInteractor.currentUserNotification?.status).equal(scenario.expectedNotification.status)
            })
        })
    })
})

/*
Feature: Registering
    As a guest,
    In order to claim,
    I want to register on Bangarang.

    Scenario: Already Signed-in as Bangarang user.
        Given the user is a Bagarang member
        And 'newuser' is not a Bangarang member
        When the user register on Bangarang
        Then 'newuser' is not a Bangarang member with the following parameters:
            | username | password           | email         | fullname  |
            | newuser  | "(VRVdFrr4jF'Rx7dsfsdf   | john2@doe.com  | John Doe 2  |
        And the user has a "You are already Signed-in as Bangarang user." failed notification.


    >>> throttle max 5/min + blacklist 5/second
*/