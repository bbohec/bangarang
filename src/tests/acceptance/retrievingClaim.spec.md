Feature : Retrieve Claim
    As a guest or a Bangarang Member
    In order to share a claim or to claim
    I want to retrieve a claim

    Scenario: Retrieve Claim as Guest
        Given the user is a guest
        And the claim 'claim' is declared on Bangarang
        When the user retrieve the claim 'claim'
        Then the retrieved claim has the following information: 
            | title | people claimed    | people claimed for    | people claimed against    | previous user claim choice    |
            | claim | 10                |   9                   |   1                       |    unknown                    |
        And the user has a "Claim retreived." success notification.

    Scenario: Retrieve Claim as Bangarang member that has not claimed yet
        Given the user is a Bagarang member
        And the user has not claimed on claim 'claim'
        And the claim 'claim' is declared on Bangarang
        When the user retrieve the claim 'claim'
        Then the retrieved claim has the following information: 
            | title | people claimed    | people claimed for    | people claimed against    | previous user claim choice    |
            | claim | 10                |   9                   |   1                       |    unknown                    |
        And the user has a "Claim retreived." success notification.

    Scenario: Retrieve Claim as Bangarang member that has claimed For
        Given the user is a Bagarang member
        And the user has claimed For on claim 'claim'
        And the claim 'claim' is declared on Bangarang
        When the user retrieve the claim 'claim'
        Then the retrieved claim has the following information: 
            | title | people claimed    | people claimed for    | people claimed against    | previous user claim choice    |
            | claim | 10                |   9                   |   1                       |    For                        |
        And the user has a "Claim retreived." success notification.

    Scenario: Retrieve Claim as Bangarang member that has claimed Against
        Given the user is a Bagarang member
        And the user has claimed Against on claim 'claim'
        And the claim 'claim' is declared on Bangarang
        When the user retrieve the claim 'claim'
        Then the retrieved claim has the following information: 
            | title | people claimed    | people claimed for    | people claimed against    | previous user claim choice    |
            | claim | 10                |   9                   |   1                       |    Against                    |
        And the user has a "Claim retreived." success notification.

    Scenario: Claim not found
        Given the user is a guest
        And the claim 'claim' is not declared on Bangarang
        When the user retrieve the claim 'claim'
        Then the retrieved claim has the following information: 
            | title     | people claimed    | people claimed for    | people claimed against    | previous user claim choice    |
            | unknown   | unknown           |  unknown              |   unknown                 |      unknown                  |
        And the user has a "The claim is not declared on Bangarang" failed notification.

    
