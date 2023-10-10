export function logError(...data: any[]) {
  if (process.env.NODE_ENV !== "production") {
    console.error(...data);
  }
}
