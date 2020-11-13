import React = require("react");
import { formatName } from "../../formatName";
import { showUserGif } from "./insertEmbededGiphy";
import { UserContract } from '../../UserContract';

export const welcomeUserMessage = (user: UserContract) => (
    <div>
        <h1>Bonjour, {formatName(user)} !</h1>
        {showUserGif(user.gifLink)}
    </div>
);
