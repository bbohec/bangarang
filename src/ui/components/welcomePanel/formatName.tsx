import { IndividualContract } from "../../../core/ports/IndividualContract";

export const formatName=(individual: IndividualContract):string => individual.firstName + ' ' + individual.lastName;