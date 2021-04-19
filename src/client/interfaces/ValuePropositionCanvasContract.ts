import type { MessageContract } from "../logic/language";

export interface ValuePropositionDesignCanvasContract {
    title:MessageContract,
    audience:MessageContract
    customerJobs:MessageContract[],
    pains: MessageContract[],
    painRelievers: MessageContract[],
    productAndServices:MessageContract[],
    gainCreators:MessageContract[],
    gains: MessageContract[],
    linkName:MessageContract,
    pageLink:string
}