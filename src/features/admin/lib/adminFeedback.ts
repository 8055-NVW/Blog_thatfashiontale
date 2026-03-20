export function extractApiMessage(payload: unknown, fallbackMessage: string) {
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = payload.message;

    if (typeof message === "string" && message.trim()) {
      return message.trim();
    }
  }

  if (typeof payload === "string" && payload.trim()) {
    return payload.replace(/^Error:\s*/i, "").trim();
  }

  return fallbackMessage;
}
