import { createContext, type ReactNode, useContext } from "react";
import type { I18nKey } from "./i18n";

type Translator = (key: I18nKey) => string;

const TranslatorContext = createContext<Translator>((key) => key);

export function TranslatorProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: Translator;
}) {
  return (
    <TranslatorContext.Provider value={value}>
      {children}
    </TranslatorContext.Provider>
  );
}

export function useTranslator() {
  return { t: useContext(TranslatorContext) };
}
