import * as React from "react";
import { IndividualContract } from "../../core/ports/IndividualContract";
import { retrieveWelcomeMessage } from "./welcomePanel/retrieveWelcomeMessage";
export const main = (individual:IndividualContract|undefined):JSX.Element => (
    //<div className="">
     //   <div className="">
            //{
                retrieveWelcomeMessage(individual)
            //}
    //    </div>
    //</div>
);