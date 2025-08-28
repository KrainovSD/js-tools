export function getMonthName(
  index: number,
  locale: string = "ru-RU",
  month: "long" | "short" = "short",
  formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat(locale, { month }),
) {
  const date = new Date();
  date.setMonth(index);

  return formatter.format(date);
}
