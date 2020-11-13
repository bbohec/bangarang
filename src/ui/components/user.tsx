import { UserContract } from "./UserContract";
export const retreiveRandomUser =(users:UserContract[]):UserContract=> users[Math.floor(Math.random()*users.length)]