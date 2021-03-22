import 'mocha';
import {expect} from "chai";
import type { UserContract } from '../../client/port/UserContact';
import { UserBuilder } from '../../client/businessLogic/UserBuilder';
import { FakeBangarangMembersInteractor } from '../../client/adapters/FakeBangarangMembersInteractor';
import { bangarangMemberNotFoundError } from '../../client/port/interactors/BangarangMembersInteractorContract';
import { FakeRegisteringUserNotificationInteractor } from '../../client/adapters/FakeRegisteringUserNotificationInteractor';
import { alreadyMemberRegisteringUserNotification, badEmailRegisteringUserNotification, RegisteringNotificationType, RegisteringUserNotificationContract, RegisteringUserNotificationInteractorContract, successRegisteringUserNotification, unsecurePasswordRegisteringUserNotification } from '../../client/port/interactors/RegisteringUserNotificationInteractorContract';
describe(`Feature: Registering
    As a guest,
    In order to claim,
    I want to register on Bangarang.`,()=> {
    interface scenario {
        title:string
        withUserContract:UserContract
        withBangarangMemberInteractor:FakeBangarangMembersInteractor
        withRegisteringUserNotificationInteractor:FakeRegisteringUserNotificationInteractor
        expectedNotification:RegisteringUserNotificationContract
        thenUserShouldBeRegistered:boolean
        alreadyHaveBangarangMember?:UserContract
    }
    const registeringNotificationType:RegisteringNotificationType = "Registering."
    const scenarios:scenario[] = [
        {
            title:"Register on Bangarang.",
            withUserContract:{username:"johndoe",password:"\"(VRVdFrr4jF'Rx7",fullname:"John Doe",email:"john@doe.com"} ,
            withBangarangMemberInteractor:new FakeBangarangMembersInteractor(),
            withRegisteringUserNotificationInteractor:new FakeRegisteringUserNotificationInteractor(),
            thenUserShouldBeRegistered:true,
            expectedNotification:successRegisteringUserNotification
        },
        {
            title:"Invalid email.",
            withUserContract:{username:"johndoe",password:"\"(VRVdFrr4jF'Rx7",fullname:"John Doe",email:"johndoe.com"} ,
            withBangarangMemberInteractor:new FakeBangarangMembersInteractor(),
            withRegisteringUserNotificationInteractor:new FakeRegisteringUserNotificationInteractor(),
            thenUserShouldBeRegistered:false,
            expectedNotification:badEmailRegisteringUserNotification
        },
        {
            title:"Invalid email 2.",
            withUserContract:{username:"johndoe",password:"\"(VRVdFrr4jF'Rx7",fullname:"John Doe",email:"john@doe."} ,
            withBangarangMemberInteractor:new FakeBangarangMembersInteractor(),
            withRegisteringUserNotificationInteractor:new FakeRegisteringUserNotificationInteractor(),
            thenUserShouldBeRegistered:false,
            expectedNotification:badEmailRegisteringUserNotification
        },
        {
            title:"Unsecure Password.",
            withUserContract:{username:"johndoe",password:"password",fullname:"John Doe",email:"john@doe.com"} ,
            withBangarangMemberInteractor:new FakeBangarangMembersInteractor(),
            withRegisteringUserNotificationInteractor:new FakeRegisteringUserNotificationInteractor(),
            thenUserShouldBeRegistered:false,
            expectedNotification:unsecurePasswordRegisteringUserNotification
        },
        {
            title:"Already member of Bangarang.",
            withUserContract:{username:"johndoe",password:"\"(VRVsdfsdfdFrr4jF'Rx7",fullname:"Johnny Doe",email:"johnny@doe.com"} ,
            withBangarangMemberInteractor:new FakeBangarangMembersInteractor(),
            withRegisteringUserNotificationInteractor:new FakeRegisteringUserNotificationInteractor(),
            thenUserShouldBeRegistered:false,
            expectedNotification:alreadyMemberRegisteringUserNotification,
            alreadyHaveBangarangMember:{username:"johndoe",password:"\"(VRVdFrr4jF'Rx7",fullname:"John Doe",email:"john@doe.com"}
        }
    ]
    scenarios.forEach(scenario => {
        describe(`
    Scenario: ${scenario.title}`,()=>{
            if (scenario.alreadyHaveBangarangMember) scenario.withBangarangMemberInteractor.withBangarangMembersDatabase([scenario.alreadyHaveBangarangMember])
            const user =new UserBuilder()
                .withUserContract(scenario.withUserContract)
                .withBangarangMemberInteractor(scenario.withBangarangMemberInteractor)
                .withRegisteringUserNotificationInteractor(scenario.withRegisteringUserNotificationInteractor)
                .getUser()
            it(`Given the user is not signed in as '${user.username}'.`,()=>{
                expect(user.isSignedIn()).to.be.false
            })
            if (!scenario.alreadyHaveBangarangMember)it(`And there is no '${scenario.withUserContract.username}' Bangarang member'`,()=> {
                    expect(()=>{scenario.withBangarangMemberInteractor.findBangarangMemberFromUsername(scenario.withUserContract.username)})
                        .to.throw(bangarangMemberNotFoundError(scenario.withUserContract.username))
                }) 
            else {
                const bangarangMember = scenario.alreadyHaveBangarangMember
                it(`And '${bangarangMember.username}' is a Bangarang member with the following parameters:
            | username | password           | email         | fullname  |
            | ${bangarangMember.username}  | ${bangarangMember.password}   |  ${bangarangMember.email} | ${bangarangMember.fullname}  |`,()=> {
                    expect(scenario.withBangarangMemberInteractor.findBangarangMemberFromUsername(bangarangMember.username)).deep.equal(bangarangMember)
                })
            }
            it(`When the user register on Bangarang with the following parameters:
            | username | password           | email         | fullname  |
            | ${scenario.withUserContract.username}  | ${scenario.withUserContract.password}   |  ${scenario.withUserContract.email} | ${scenario.withUserContract.fullname}  |`,(done)=> {
                user.register()
                done()
            })
            if (scenario.alreadyHaveBangarangMember) {
                const bangarangMember = scenario.alreadyHaveBangarangMember
                it(`Then '${bangarangMember.username}' is a Bangarang member with the following parameters:
            | username | password           | email         | fullname  |
            | ${bangarangMember.username}  | ${bangarangMember.password}   |  ${bangarangMember.email} | ${bangarangMember.fullname}  |`,()=> {
                    expect(scenario.withBangarangMemberInteractor.findBangarangMemberFromUsername(bangarangMember.username)).deep.equal(bangarangMember)
                })
            }
            else if (scenario.thenUserShouldBeRegistered) it(`Then '${scenario.withUserContract.username}' is a Bangarang member with the following parameters:
            | username | password           | email         | fullname  |
            | ${scenario.withUserContract.username}  | ${scenario.withUserContract.password}   |  ${scenario.withUserContract.email} | ${scenario.withUserContract.fullname}  |`,()=> {
                    expect(scenario.withBangarangMemberInteractor.findBangarangMemberFromUsername(scenario.withUserContract.username)).deep.equal(scenario.withUserContract)
                })
            else it(`And there is no '${scenario.withUserContract.username}' Bangarang member'`,()=> {
                    expect(()=>{scenario.withBangarangMemberInteractor.findBangarangMemberFromUsername(scenario.withUserContract.username)})
                        .to.throw(bangarangMemberNotFoundError(scenario.withUserContract.username))
                })
            it(`And the user has a '${registeringNotificationType}' notification with '${scenario.expectedNotification.status}' status and '${scenario.expectedNotification.message}' message.`,()=> {
                expect(scenario.withRegisteringUserNotificationInteractor.currentUserNotification?.message).equal(scenario.expectedNotification.message)
                expect(scenario.withRegisteringUserNotificationInteractor.currentUserNotification?.status).equal(scenario.expectedNotification.status)
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