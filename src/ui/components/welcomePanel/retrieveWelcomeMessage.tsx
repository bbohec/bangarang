import { UserContract } from '../UserContract';
import { welcomeStangerMessage } from "./messages/welcomeStangerMessage";
import { welcomeUserMessage } from "./messages/welcomeUserMessage";

export const retrieveWelcomeMessage = (user: UserContract) => (user) ? welcomeUserMessage(user) : welcomeStangerMessage;
