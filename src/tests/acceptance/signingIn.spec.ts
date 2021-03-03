import 'mocha';
import {expect} from "chai";
import { FakeBangarangMembersInteractor } from '../../client/adapters/FakeBangarangMembersInteractor';
import { User } from '../../client/businessLogic/User';
import type { UserContact } from '../../client/port/UserContact';
describe(`Feature: User Sign In
    As a guest
    In order to claim
    I want to sign in Bangarang
    `,()=> {
    describe(`Scenario: User Sign In`,()=> {
        const expectedUser:UserContact= {username:"johndoe",fullname:"John Doe",password:"Password"}
        const user:User = new User({username:"",fullname:"",password:""},{bangarangMembersInteractor:new FakeBangarangMembersInteractor([expectedUser])})
        it(`Given the user is a guest`,()=> {
            expect(user.isGuest()).to.be.true
        })
        it(`And there is '${expectedUser.username}' Bangarang member with password '${expectedUser.password}'`,()=> {
            expect(expectedUser.password).equal(expectedUser.password)
        })
        it(`When the user signin as '${expectedUser.username}' with password '${expectedUser.password}'`,(done)=> {
            user.signingIn(expectedUser.username,expectedUser.password)
            done()
        })
        it(`Then the user is signed in as a Bangarang member with the following information:
            | username | user fullname |
            | ${expectedUser.username}  | ${expectedUser.fullname}      |`,()=> {
            expect(user.username).equal(expectedUser.username)
            expect(user.fullname).equal(expectedUser.fullname)
        })
        it(`And the user is not a guest`,()=> {
            expect(user.isGuest()).to.be.false
        })
        /*
        it(`And the user has a "Signed In" success notification.`,()=> {
            expect(user.SigningInNotification.status).equal("success")
            expect(user.SigningInNotification.message).equal("Signed In")
        })
        */
    })
})




/*
    Scenario: User Sign In
        Given the user is a guest
        And there is "johndoe" Bangarang member with password 'Password'
        When the user signin as "johndoe" with password "Password"
        Then the user is signed in as a Bangarang member with the following information:
        | username | user firstname | user lastname |
        | johndoe  | John           | Doe           |
        And the user is not a guest
        And the user has a "Signed In" success notification.

    Scenario: User already signed in
        Given the user has already signed in as a Bangarang member
        And there is "johndoe" Bangarang member with password 'Password'
        When the user signin as "johndoe" with password "Password"
        Then there is an error notification with message "The user is already connected. Please signout."

    Scenario: User is not a Bangarang member
        Given the user is a guest
        And there is no "johndoe" Bangarang member
        When the user signin as "johndoe" with password "Password"
        Then there is an error notification with message "Bad credentials. Please verify your credentials or register to Bangarang."

    Scenario: Bad credentials
        Given the user is a guest
        And there is "johndoe" Bangarang member with password 'Password'
        When the user signin as "johndoe" with password "badpassword"
        Then there is an error notification with message "Bad credentials. Please verify your credentials or register to Bangarang."
*/