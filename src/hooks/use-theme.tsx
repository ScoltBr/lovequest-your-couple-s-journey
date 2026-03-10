import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark" | "auto";

interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolved: "light" | "dark";
}

const ThemeContext = createContext<ThemeCtx>({ theme: "auto", setTheme: () => {}, resolved: "light" });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem("lovequest-theme") as Theme | null;
    return stored ?? "auto";
  });

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("lovequest-theme", t);
  };

  const [systemDark, setSystemDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const resolved: "light" | "dark" =
    theme === "auto" ? (systemDark ? "dark" : "light") : theme;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolved === "dark");
  }, [resolved]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolved }}>
      {children}
    </ThemeContext.Provider>
  );
};
