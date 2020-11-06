import { UserServiceProvider } from "../../core/serviceProviders/UserServiceProvider";
import { BallotServiceProvider } from "../../core/serviceProviders/BallotServiceProvider";
import { InteractWithBallotProvider } from "../../core/ports/InteractWithBallotProvider";
import { InteractWithIdentityProvider } from "../../core/ports/InteractWithIdentityProvider";
export class Bangarang {
    constructor(interactWithIdentityProvider: InteractWithIdentityProvider, interactWithBallotProvider: InteractWithBallotProvider) {
        this.userServiceProvider = new UserServiceProvider(interactWithIdentityProvider, new BallotServiceProvider(interactWithBallotProvider));
    }
    readonly userServiceProvider: UserServiceProvider;
}
