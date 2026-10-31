const PARTS = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", timeZone: "Asia/Ho_Chi_Minh" });

/** "31/10" theo giờ Việt Nam — server chạy UTC; ICU vi-VN lại in "31-10". */
export function formatDay(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const { day, month } = Object.fromEntries(PARTS.formatToParts(date).map((p) => [p.type, p.value]));
  return `${day}/${month}`;
}
