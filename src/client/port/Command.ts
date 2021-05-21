export type CommandName = "Registering" |"Claiming" | "Searching Claims" | "Retrieving Claim By Id" | "Declaring Claim" | "Signing In"
export interface Command {
    execute():Promise<void>
    readonly name:CommandName
}