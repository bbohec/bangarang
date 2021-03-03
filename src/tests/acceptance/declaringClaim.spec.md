Feature: Declaring Claim
    As a guest or a Bangarang Member
    In order to claim or share a claim
    I want to declare a claim

    Scenario: Declaring Simple Claim
        When the user declare a new 'simple' claim with title 'claim'.
        Then the claim with title 'claim' is declared on Bangarang.
        And the user has a 'Declared' success notification.
        The user go to the 'claim'.

    Scenario: Claim with same title already exist
        Given the claim with title 'claim' is declared on Bangarang.
        When the user declare a new 'simple' claim with title 'claim'.
        Then the new claim is not declared on Bangarang.
        And the user has a 'The claim 'claim' already exist' error notification.
        The user go to the 'claim'.

    Scenario: Claim with same title already exist
        Given the claim with title 'claim' is declared on Bangarang.
        When the user declare a new 'simple' claim with title 'CLAIM'.
        Then the new claim is not declared on Bangarang.
        And the user has a 'The claim 'claim' already exist' error notification.
        The user go to the 'claim'.

    Scenario: Claim with empty title
        When the user declare a new 'simple' claim with title ''.
        Then the new claim is not declared on Bangarang.
        And the user has a 'A claim must have a title.' error notification.

    Scenario: Claim with no type
        When the user declare a new '' claim with title 'claim'.
        Then the new claim is not declared on Bangarang.
        And the user has a 'A claim must have a type.' error notification.
