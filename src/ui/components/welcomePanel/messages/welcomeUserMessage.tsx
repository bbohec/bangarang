import * as React from "react";
import { IndividualContract } from "../../../../core/ports/IndividualContract";
import { formatName } from "../formatName";
import { showUserGif } from "./insertEmbededGiphy";
export const welcomeUserMessage = (individual: IndividualContract) => (
        <div className="bg-gray-700 rounded-lg items-center text-center place-items-center">
            <div className="text-xl font-medium text-gray-400">Bonjour, {formatName(individual)} !</div>
            {showUserGif(individual.gifLink)}
            <p className="text-gray-500 text-center">You have a new message!</p>
        </div>
);
