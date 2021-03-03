Feature: Registering
    As a guest,
    In order to claim,
    I want to register on Bangarang.

    Scenario: Register on Bangarang.
        Given the user is a guest
        And 'johndoe' is not a Bangarang member
        When the user register on Bangarang
        Then 'johndoe' is a Bangarang member with the following parameters:
            | username | password           | email         | fullname  |
            | johndoe  | "(VRVdFrr4jF'Rx7   | john@doe.com  | John Doe  |
        And the user has a "Registered." success notification.

    Scenario: Invalid email.
        Given the user is a guest
        And 'johndoe' is not a Bangarang member
        When the user register on Bangarang
        Then 'johndoe' is not a Bangarang member with the following parameters:
            | username | password           | email         | fullname  |
            | johndoe  | "(VRVdFrr4jF'Rx7   | johndoe.com   | John Doe  |
        And the user has a "Bad email format." failed notification.

    Scenario: Invalid email 2
        Given the user is a guest
        And 'johndoe' is not a Bangarang member
        When the user register on Bangarang
        Then 'johndoe' is not a Bangarang member with the following parameters:
            | username | password           | email         | fullname  |
            | johndoe  | "(VRVdFrr4jF'Rx7   | john@doe.     | John Doe  |
        And the user has a "Bad email format." failed notification.

    Scenario: Unsecure Password.
        Given the user is a guest
        And 'johndoe' is not a Bangarang member
        When the user register on Bangarang
        Then 'johndoe' is not a Bangarang member with the following parameters:
            | username | password           | email         | fullname  |
            | johndoe  | password           | john@doe.     | John Doe  |
        And the user has a "Unsecure password." failed notification.
        
    Scenario: Already member of Bangarang.
        Given the user is a guest
        Then 'johndoe' is not a Bangarang member with the following parameters:
            | username | password           | email         | fullname  |
            | johndoe  | "(VRVdFrr4jF'Rx7   | john@doe.com  | John Doe  |
        When the user register on Bangarang with the following parameters:
            | username | password                   | email         | fullname  |
            | johndoe  | "(VRVsdfsdfdFrr4jF'Rx7     | johnny@doe.com  | Johnny Doe  |
        Then 'johndoe' is a Bangarang member with the following parameters:
            | username | password           | email         | fullname  |
            | johndoe  | "(VRVdFrr4jF'Rx7   | john@doe.com  | John Doe  |
        And the user has a "Already member of Bangarang." failed notification.

    Scenario: Already Signed-in as Bangarang user.
        Given the user is a Bagarang member
        And 'johndoe' is not a Bangarang member
        When the user register on Bangarang
        Then 'johndoe' is a Bangarang member with the following parameters:
            | username | password           | email         | fullname  |
            | johndoe  | "(VRVdFrr4jF'Rx7   | john@doe.com  | John Doe  |
        And the user has a "You are already Signed-in as Bangarang user." failed notification.


    >>> throttle max 5/min + blacklist 5/second