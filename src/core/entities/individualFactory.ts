import { IndividualFactoryContract } from "../ports/IndividualFactoryContract";
import { retreiveBallotBySubject } from "../usecases/retreiveBallotBySubject";
import { InteractWithIndividualRepository } from "../ports/InteractWithIndividualRepository";
export class individualFactory implements IndividualFactoryContract {
    constructor(individualRepositoryInteractor: InteractWithIndividualRepository) {
        this.individualRepositoryInteractor = individualRepositoryInteractor;
    }
    public retreiveIndividual(individualName: string) {
        return {
            identifier: this.individualRepositoryInteractor.retreiveIndividual(individualName).identifier,
            individualUseCases: { retreiveBallotBySubject },
        };
    }
    private individualRepositoryInteractor: InteractWithIndividualRepository;
}
