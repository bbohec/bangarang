import type { IndividualContract } from "./IndividualContract";
import type  { UseCasesContract } from "./UseCasesContract";
export interface UserContract {
    individual: IndividualContract
    useCases:UseCasesContract
}
