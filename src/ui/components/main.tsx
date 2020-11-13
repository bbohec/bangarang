import { retrieveWelcomeMessage } from "./welcomePanel/retrieveWelcomeMessage";
import { UserContract } from './UserContract';
export const main = (user:UserContract):JSX.Element => (retrieveWelcomeMessage(user));