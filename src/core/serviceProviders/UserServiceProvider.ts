import { InteractWithIdentityProvider } from "../ports/InteractWithIdentityProvider";
import { UserContract } from "../ports/UserContract";
import { BallotServiceProvider } from "./BallotServiceProvider";
import { User } from "../entities/User";
import { UseCaseServiceProvider } from "./UseCaseServiceProvider";
import { individualAlreadySubscribed } from "../ports/individualAlreadySubscribed";
import { IndividualContract } from "../ports/IndividualContract";
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