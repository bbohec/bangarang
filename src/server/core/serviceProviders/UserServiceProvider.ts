import type { InteractWithIdentityProvider } from "../ports/InteractWithIdentityProvider";
import type { UserContract } from "../ports/UserContract";
import type { BallotServiceProvider } from "./BallotServiceProvider";
import type { IndividualContract } from "../ports/IndividualContract";
import { User } from "../entities/User";
import { UseCaseServiceProvider } from "./UseCaseServiceProvider";
import { individualAlreadySubscribed } from "../ports/individualAlreadySubscribed";

export class UserServiceProvider {
    constructor(private interactWithIdentityProvider: InteractWithIdentityProvider,private ballotServiceProvider:BallotServiceProvider) {}
    public suscribeIndividual(individual: IndividualContract):void {
        if(this.interactWithIdentityProvider.isIndividualSubscribed(individual.identifier)) throw individualAlreadySubscribed
        return this.interactWithIdentityProvider.subscribeIndividual(individual)
    }
    public retreiveUserByIdentifer(individualIdentifier: string):UserContract {
        return new User(
            this.interactWithIdentityProvider.retreiveIndividual(individualIdentifier),
            new UseCaseServiceProvider(this.ballotServiceProvider)
        )
    }
}