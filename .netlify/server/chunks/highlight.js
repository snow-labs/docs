import { getHighlighter, bundledThemes, bundledLanguages } from "shiki";
const customMarkdownLangName = "cartamd";
const defaultLightThemeName = "carta-light";
const defaultDarkThemeName = "carta-dark";
const loadDefaultTheme = async () => ({
  light: structuredClone((await import("./theme-light.js")).default),
  dark: structuredClone((await import("./theme-dark.js")).default)
});
async function loadHighlighter({ grammarRules, highlightingRules, theme, shiki }) {
  const injectGrammarRules = (lang, rules) => {
    lang.repository = {
      ...langDefinition.repository,
      ...Object.fromEntries(rules.map(({ name, definition }) => [name, definition]))
    };
    for (const rule of rules) {
      if (rule.type === "block") {
        lang.repository.block.patterns.unshift({ include: `#${rule.name}` });
      } else {
        lang.repository.inline.patterns.unshift({ include: `#${rule.name}` });
      }
    }
  };
  const injectHighlightRules = (theme2, rules) => {
    if (theme2.type === "light") {
      theme2.tokenColors ||= [];
      theme2.tokenColors.unshift(...rules.map(({ light }) => light));
    } else {
      theme2.tokenColors ||= [];
      theme2.tokenColors.unshift(...rules.map(({ dark }) => dark));
    }
  };
  const themes = shiki?.themes ?? [];
  const langs = shiki?.langs ?? [];
  const highlighter = await getHighlighter({
    themes,
    langs
  });
  const langDefinition = (await import("./markdown.js")).default;
  injectGrammarRules(langDefinition, grammarRules);
  await highlighter.loadLanguage(langDefinition);
  if (isSingleTheme(theme)) {
    let registration;
    if (isThemeRegistration(theme)) {
      registration = theme;
    } else {
      registration = (await bundledThemes[theme]()).default;
    }
    injectHighlightRules(registration, highlightingRules);
    await highlighter.loadTheme(registration);
  } else {
    const { light, dark } = theme;
    let lightRegistration;
    let darkRegistration;
    if (isThemeRegistration(light)) {
      lightRegistration = light;
    } else {
      lightRegistration = (await bundledThemes[light]()).default;
    }
    if (isThemeRegistration(dark)) {
      darkRegistration = dark;
    } else {
      darkRegistration = (await bundledThemes[dark]()).default;
    }
    injectHighlightRules(lightRegistration, highlightingRules);
    injectHighlightRules(darkRegistration, highlightingRules);
    await highlighter.loadTheme(lightRegistration);
    await highlighter.loadTheme(darkRegistration);
  }
  return {
    theme,
    lang: customMarkdownLangName,
    ...highlighter
  };
}
const isBundleLanguage = (lang) => Object.keys(bundledLanguages).includes(lang);
const isBundleTheme = (theme) => Object.keys(bundledThemes).includes(theme);
const isDualTheme = (theme) => typeof theme == "object" && "light" in theme && "dark" in theme;
const isSingleTheme = (theme) => !isDualTheme(theme);
const isThemeRegistration = (theme) => typeof theme == "object";
const findNestedLanguages = (text) => {
  const languages = /* @__PURE__ */ new Set();
  const regex = /```(\w+)$/gm;
  let match;
  while (match = regex.exec(text)) {
    languages.add(match[1]);
  }
  return languages;
};
const loadNestedLanguages = async (highlighter, text) => {
  text = text.replaceAll("\r\n", "\n");
  const languages = findNestedLanguages(text);
  const loadedLanguages = highlighter.getLoadedLanguages();
  let updated = false;
  for (const lang of languages) {
    if (isBundleLanguage(lang) && !loadedLanguages.includes(lang)) {
      await highlighter.loadLanguage(lang);
      loadedLanguages.push(lang);
      updated = true;
    }
  }
  return {
    updated
  };
};
export {
  customMarkdownLangName,
  defaultDarkThemeName,
  defaultLightThemeName,
  isBundleLanguage,
  isBundleTheme,
  isDualTheme,
  isSingleTheme,
  isThemeRegistration,
  loadDefaultTheme,
  loadHighlighter,
  loadNestedLanguages
};
