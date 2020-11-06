import { UserServiceProvider } from "../../core/serviceProviders/UserServiceProvider";
import { BallotServiceProvider } from "../../core/serviceProviders/BallotServiceProvider";
import { InteractWithBallotProvider } from "../../core/ports/InteractWithBallotProvider";
import { InteractWithIdentityProvider } from "../../core/ports/InteractWithIdentityProvider";
export class Bangarang {
    constructor(interactWithIdentityProvider: InteractWithIdentityProvider, interactWithBallotProvider: InteractWithBallotProvider) {
        this.ballotServiceProvider = new BallotServiceProvider(interactWithBallotProvider);
        this.userServiceProvider = new UserServiceProvider(interactWithIdentityProvider, this.ballotServiceProvider);
    }
    readonly userServiceProvider: UserServiceProvider;
    readonly ballotServiceProvider: BallotServiceProvider;
}