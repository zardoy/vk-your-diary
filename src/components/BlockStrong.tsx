import React, { ComponentProps } from "react";

import { makeStyles } from "@material-ui/styles";

import { MyTheme } from "./MyThemeProvider";

// todo sass string templates
// https://material-ui.com/styles/advanced/#string-templates

interface Props {
    style?: ComponentProps<"div">["style"];
}

const useStyles = makeStyles((theme: MyTheme) => ({
    blockStrong: {
        padding: 16,
        margin: "36px 0",
        backgroundColor: theme.palette.type === "light" ? "white" : "rgb(28, 28, 29)"
    }
}));

let BlockStrong: React.FC<Props> = ({ children, style }) => {
    const classes = useStyles();

    return <div
        style={style}
        className={classes.blockStrong}
    >
        {children}
    </div>;
};

export default BlockStrong;