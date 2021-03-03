Feature: Claiming
    As a Bangarang Member
    In order to claim
    I want to claim on claim

    Scenario: Claiming For
        Given the user is a Bagarang member
        And the claim with title 'claim' is declared on Bangarang
        And the claim claimed people is 10
        And the claim claimed for people is 10
        And the claim claimed against people is 0
        When the user claim 'For' on the claim with title 'claim'
        Then the claimed people is 11
        And the claim claimed for people is 11
        And the claim claimed against people is 0
        And the user has a "Claimed" success notification.

    Scenario: Claiming Against
        Given the user is a Bagarang member
        And the claim with title 'claim' is declared on Bangarang
        And the claim claimed people is 20
        And the claim claimed for people is 0
        And the claim claimed against people is 20
        When the user claim 'Against' on the claim with title 'claim'
        Then the claimed people is 21
        And the claim claimed for people is 0
        And the claim claimed against people is 21
        And the user has a "Claimed" success notification.

    Scenario: Claim not declared on Bangarang
        Given the user is a Bagarang member
        And the claim with title 'claim' is not declared on Bangarang
        And the claim claimed people is 20
        And the claim claimed for people is 0
        And the claim claimed against people is 20
        When the user claim 'For' on the claim with title 'claim'
        Then the claim claimed people is 20
        And the claim claimed for people is 0
        And the claim claimed against people is 20
        And the user has a "The claim 'claim' is not declared on Bangarang" failed notification.

    Scenario: User not Bangarang member
        Given the user is not a Bagarang member
        And the claim with title 'claim' is not declared on Bangarang
        And the claim claimed people is 20
        And the claim claimed for people is 0
        And the claim claimed against people is 20
        When the user claim 'For' on the claim with title 'claim'
        Then the claim claimed people is 20
        And the claim claimed for people is 0
        And the claim claimed against people is 20
        And the user has a "You must be a Bangarang member in order to claim." failed notification.
        The user go to the Sign In menu.

    Scenario: Can't claim For multiple times
        Given the user is a Bagarang member
        And the user has claimed For on claim 'claim'
        And the claim with title 'claim' is declared on Bangarang
        And the claim claimed people is 10
        And the claim claimed for people is 10
        And the claim claimed against people is 0
        When the user claim 'For' on the claim with title 'claim'
        Then the claimed people is 10
        And the claim claimed for people is 10
        And the claim claimed against people is 0
        And the user has a "Claiming 'For' multiple times on a claim is forbidden." failed notification.

    Scenario: Can't claim Against multiple times
        Given the user is a Bagarang member
        And the user has claimed Against on claim 'claim'
        And the claim with title 'claim' is declared on Bangarang
        And the claim claimed people is 10
        And the claim claimed for people is 10
        And the claim claimed against people is 0
        When the user claim 'Against' on the claim with title 'claim'
        Then the claimed people is 10
        And the claim claimed for people is 10
        And the claim claimed against people is 0
        And the user has a "Claiming 'Against' multiple times on a claim is forbidden." failed notification.

    Scenario: user change claim choice For > Against
        Given the user is a Bagarang member
        And the user has claimed For on claim 'claim'
        And the claim with title 'claim' is declared on Bangarang
        And the claim claimed people is 10
        And the claim claimed for people is 10
        And the claim claimed against people is 0
        When the user claim 'Against' on the claim with title 'claim'
        Then the user has claimed Against on claim 'claim'
        And the claimed people is 10
        And the claim claimed for people is 9
        And the claim claimed against people is 1
        And the user has a "Claimed" success notification.

    Scenario: user change claim choice Against > For
        Given the user is a Bagarang member
        And the user has claimed Against on claim 'claim'
        And the claim with title 'claim' is declared on Bangarang
        And the claim claimed people is 10
        And the claim claimed for people is 0
        And the claim claimed against people is 10
        When the user claim 'For' on the claim with title 'claim'
        Then the user has claimed For on claim 'claim'
        And the claimed people is 10
        And the claim claimed for people is 1
        And the claim claimed against people is 9
        And the user has a "Claimed" success notification.
