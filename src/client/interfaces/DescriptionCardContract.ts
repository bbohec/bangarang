import type { LinkContract } from "./LinkContract";
export interface DescriptionCardContract {
    title:string,
    description:string,
    bulletPoints?:string[]
    links?:LinkContract[]
}