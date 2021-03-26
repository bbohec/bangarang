export interface BangarangUserInterfaceInteractorContract {
    goToSigningInMenu():void;
    goToClaim(claimId: string):void;
}
export enum StaticView {
    SigningInMenu = "SigningInMenu"
}