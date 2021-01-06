import React, { useMemo, useState } from "react";

import { ThemeProvider } from "@material-ui/styles";

import { useVKBridge } from "../lib/vk-bridge-react-bindings";

export interface MyTheme {
    palette: {
        type: "light" | "dark";
    };
}

interface Props {
}

let MyThemeProvider: React.FC<Props> = ({ children }) => {
    const [darkTheme, setDarkTheme] = useState(false);

    useVKBridge({
        onUpdatePalette(newTheme) {
            const BODY_DARK_THEME_CLASS = "theme-dark";
            let { body } = document;
            if (newTheme === "dark") body.classList.add(BODY_DARK_THEME_CLASS);
            else body.classList.remove(BODY_DARK_THEME_CLASS);
            setDarkTheme(newTheme === "dark");
        }
    });

    const theme = useMemo((): MyTheme => {
        return {
            palette: {
                type: darkTheme ? "dark" : "light"
            }
        };
    }, [darkTheme]);

    return <ThemeProvider theme={theme}>
        {children}
    </ThemeProvider>;
};

export default MyThemeProvider;