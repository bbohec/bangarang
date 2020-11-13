import { IndividualContract } from "../../core/ports/IndividualContract";
import { retrieveWelcomeMessage } from "./welcomePanel/retrieveWelcomeMessage";
export const main = (individual:IndividualContract|undefined):JSX.Element => (retrieveWelcomeMessage(individual));