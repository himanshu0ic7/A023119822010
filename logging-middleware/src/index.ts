import { LogStack, LogLevel, LogPackage, LogPayload, LogResponse } from "./types";

const API_ENDPOINT = "http://20.244.56.144/evaluation-service/logs";


export async function Log(
  stack: LogStack,
  level: LogLevel,
  pkg: LogPackage,
  message: string
): Promise<void> {

  const apiToken = process.env.LOGGING_API_TOKEN;
  if (!apiToken) {
    console.error("Logging Error: LOGGING_API_TOKEN is not set in environment variables. Log was not sent.");
    return;
  }

  const payload: LogPayload = {
    stack,
    level,
    package: pkg,
    message,
  };

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const result: LogResponse = await response.json();
      console.log(`Log sent successfully. LogID: ${result.logID}`);
    } else {
      const errorText = await response.text();
      console.error(
        `Failed to send log. Status: ${response.status}. Response: ${errorText}`
      );
    }
  } catch (error) {
    console.error("An unexpected error occurred while sending the log:", error);
  }
}