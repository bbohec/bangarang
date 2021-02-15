import type { SignInStatus } from "./SignInStatus";
export interface SignInContract {
    signInStatus: SignInStatus;
    username?: string;
    password?: string;
}
