import type { UserContract } from "../UserContact";
export interface BangarangUserInterfaceInteractorContract {
    applySignedInUserContract(userContract: UserContract | undefined):void;
    retrieveSignedInUserContract(): UserContract | undefined;
    goToSigningInMenu():void;
    goToClaim(claimId: string):void;
}
export enum StaticView {
SigningInMenu="SigningInMenu",
LanguageSelect="LanguageSelect",
MainMenu="MainMenu",
DeclareClaim="DeclareClaim",
BusinessModel="BusinessModel",
LeanCanvas="LeanCanvas",
Register="Register"
}