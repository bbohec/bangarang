import { IndividualContract } from "../../../core/ports/IndividualContract";
import { welcomeStangerMessage } from "./messages/welcomeStangerMessage";
import { welcomeUserMessage } from "./messages/welcomeUserMessage";

export const retrieveWelcomeMessage = (individual: IndividualContract|undefined) => (individual) ? welcomeUserMessage(individual) : welcomeStangerMessage;
