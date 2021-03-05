export interface BangarangMembersInteractorContract {
    signingIn(username: string, password: string):void|Error;
    isSignedIn(username: string): Boolean;
}