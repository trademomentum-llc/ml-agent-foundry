/**
 * Strip CR/LF and other control characters so external data cannot inject
 * forged log lines. Callers must still pass a constant format string to
 * console.* (e.g. console.log("%s", sanitizeForLog(x))) and never use
 * external data as the format string itself.
 */
export function sanitizeForLog(value: unknown, maxLen = 200): string {
  if (value == null) return "";
  const raw = typeof value === "string" ? value : String(value);
  return raw.replace(/[\u0000-\u001F\u007F\u2028\u2029]/g, "").slice(0, maxLen);
}
