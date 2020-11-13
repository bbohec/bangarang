import { IndividualContract } from "../../core/ports/IndividualContract";
export const retreiveRandomIndividual = (users: Array<IndividualContract|undefined>): IndividualContract|undefined => users[Math.floor(Math.random() * users.length)];
