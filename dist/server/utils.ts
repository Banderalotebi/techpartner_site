// Server utilities
export function log(message: string, source?: string) {
  const timestamp = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${timestamp} [${source || "express"}] ${message}`);
}

export function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

