import {PactV3} from "@pact-foundation/pact";
import path from "path"
import process from "process";

export const consumerName = "MaintenanceApp";
export const providerName = "CoreApi";
export const consumerVersion =  "1.0.0";

export const pactFile = path.resolve(`./pacts/${consumerName}-${providerName}.json`);
// const Pact = pact.PactV3;


export const provider = new PactV3({
    dir: path.resolve(process.cwd(), "pacts"),
    logLevel: "info",
    host: "127.0.0.1",
    consumer: consumerName,
    provider: providerName,
});
