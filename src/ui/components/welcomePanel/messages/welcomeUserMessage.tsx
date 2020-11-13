import React = require("react");
import { IndividualContract } from "../../../../core/ports/IndividualContract";
import { formatName } from "../../formatName";
import { showUserGif } from "./insertEmbededGiphy";

export const welcomeUserMessage = (individual: IndividualContract) => (
    <div>
        <h1>Bonjour, {formatName(individual)} !</h1>
        {showUserGif(individual.gifLink)}
    </div>
);
