Feature: Searching Claims
    As a guest or a Bangarang Member,
    In order to claim or share a claim,
    I want to find a claim

    Scenario: Searching Claims with one word
        Given there is the following declared claims:
            [claim,claim2,claim3,Claim4,CLAIME5,Cloum]
        When the user search claims with search criteria 'claim'
        Then the searched claims is the following:
            [claim,claim2,claim3,Claim4,CLAIME5]
        And the user has a "5 claims found." success notification.

    Scenario: Searching Claims with multiple words
        Given there is the following declared claims:
            [good people,good people1,good people 2,good 3 people,GOOD 4 PEOPLE,PEOPLE GOOD,Cloum]
        When the user search claims with search criteria 'good people'
        Then the searched claims is the following:
            [good people,good people1,good people 2,PEOPLE GOOD,good 3 people,GOOD 4 PEOPLE]
        And the user has a "6 claims found." success notification.

    Scenario: Searching Claims with one or multiple words
        Given there is the following declared claims:
            [good ,people,good people,good 2 people,GOOD 4 PEOPLE,PEOPLE GOOD,Cloum]
        When the user search claims with search criteria 'good people'
        Then the searched claims is the following:
            [good people,PEOPLE GOOD,good 2 people,GOOD 4 PEOPLE,good ,people]
        And the user has a "6 claims found." success notification.

    Scenario: No claims
        Given there is the following declared claims:
            [cloum,cloum2,cloum3,Cloum4,CLOUME5]
        When the user search claims with search criteria 'claim'
        Then the searched claims is the following:
            []
        And the user has a "0 claims found." success notification.