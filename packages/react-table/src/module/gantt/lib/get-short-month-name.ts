const MONTH_FORMATTERS = new Map<string, Intl.DateTimeFormat>();

export function getShortMonthName(monthIndex: number, locale = "ru-RU") {
  if (!MONTH_FORMATTERS.has(locale)) {
    MONTH_FORMATTERS.set(locale, new Intl.DateTimeFormat(locale, { month: "short" }));
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const formatter = MONTH_FORMATTERS.get(locale)!;
  const date = new Date(2023, monthIndex, 1);

  if (locale === "ru-RU") {
    let monthName = formatter.format(date).replace(".", "").trim();
    monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    return monthName;
  }

  return formatter.format(date);
}
