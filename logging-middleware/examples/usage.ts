import { Log } from '../src';

async function runExamples() {
    console.log("Running logging examples...");
    await Log("backend", "error", "handler", "received string, expected bool");
    await Log("backend", "fatal", "db", "Critical database connection failure.");
    await Log("frontend", "info", "component", "User profile component mounted successfully.");
    console.log("Logging examples complete.");
}

runExamples();