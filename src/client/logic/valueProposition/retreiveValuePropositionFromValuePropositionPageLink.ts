import {valuePropositionsDesignCanvas} from "./valuePropositions"
import type { ValuePropositionDesignCanvasContract } from "../../interfaces/ValuePropositionCanvasContract"
export const retreiveValuePropositionFromValuePropositionPageLink = (valuePropositionPageLink:string):ValuePropositionDesignCanvasContract => {
    const valueProposition = valuePropositionsDesignCanvas.find(valuePropositionDesignCanvas => valuePropositionPageLink.startsWith(valuePropositionDesignCanvas.pageLink))
    if (valueProposition) return valueProposition
    throw new Error(`No value proposition has a valid prefix for the page link '${valuePropositionPageLink}'`)
}