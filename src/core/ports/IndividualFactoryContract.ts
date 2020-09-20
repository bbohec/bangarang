import { InteractWithIndividualRepository } from "./InteractWithIndividualRepository";
import { IndividualWithUseCases } from "./IndividualWithUseCases";
export interface IndividualFactoryContract {
    retreiveIndividual(individualName: string): IndividualWithUseCases
    //individualRepositoryInteractor:InteractWithIndividualRepository
}
