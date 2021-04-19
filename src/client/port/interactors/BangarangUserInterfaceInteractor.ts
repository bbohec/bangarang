export interface BangarangUserInterfaceInteractorContract {
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