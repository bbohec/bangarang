import {valuePropositionsDesignCanvas} from "./valuePropositions"
import type { ValuePropositionDesignCanvasContract } from "../../interfaces/ValuePropositionCanvasContract"
export const retreiveValuePropositionFromValuePropositionPageLink = (valuePropositionPageLink:string):ValuePropositionDesignCanvasContract => {
    return valuePropositionsDesignCanvas.find(valuePropositionDesignCanvas => valuePropositionPageLink.startsWith(valuePropositionDesignCanvas.pageLink))
}