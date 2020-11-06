import { IndividualContract } from "./IndividualContract";
import { UseCasesContract } from "./UseCasesContract";
export interface UserContract {
    individual: IndividualContract
    useCases:UseCasesContract
}
