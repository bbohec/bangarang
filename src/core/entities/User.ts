import { IndividualContract } from "../ports/IndividualContract";
import { UseCasesContract } from "../ports/UseCasesContract";
import { UserContract } from "../ports/UserContract";
export class User implements UserContract {
    constructor(readonly individual: IndividualContract,readonly useCases: UseCasesContract){}
}