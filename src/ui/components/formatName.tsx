import { UserContract } from "./UserContract";
export const formatName=(user: UserContract):string => user.firstName + ' ' + user.lastName;