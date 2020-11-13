import React = require("react");
import { showUserGif } from "./insertEmbededGiphy";
export const welcomeStangerMessage = (
    <div>
        <h1>Bonjour, Belle Inconnue.</h1>
        <p>Tu n'es pas inscrit 🥺</p>
        {showUserGif("https://giphy.com/embed/KrmJ3Q67GDMEUJImi1")}
    </div>
)
