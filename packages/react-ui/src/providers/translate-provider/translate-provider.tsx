import { I18nextProvider } from "react-i18next";
import i18nConfig from "./config";

export function TranslateProvider(props: React.PropsWithChildren) {
  const { children } = props;

  return <I18nextProvider i18n={i18nConfig}>{children}</I18nextProvider>;
}
