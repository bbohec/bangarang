import type { IndividualContract } from "../ports/IndividualContract";
import type { UseCasesContract } from "../ports/UseCasesContract";
import type { UserContract } from "../ports/UserContract";
export class User implements UserContract {
    constructor(readonly individual: IndividualContract,readonly useCases: UseCasesContract){}
}