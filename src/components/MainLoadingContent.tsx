import "@webpunk/circular-text";

import React from "react";

import { motion } from "framer-motion";

import { createStyles, makeStyles } from "@material-ui/styles";

const CIRCULAR_TEXT = `ДОМАШКА БОТ • ТВОЙ ДНЕВНИК • `;

interface StyleProps {
    linesRadius: Record<"outer" | "inner", number>;
}

const lineStyles = ({ linesRadius }: StyleProps, type: keyof StyleProps["linesRadius"]) => ({
    width: linesRadius[type],
    height: linesRadius[type],
    border: "3px solid #0488ff",
    borderRadius: "50%",
    boxShadow: `0 0 25px deepskyblue ${type === "inner" ? "inset" : ""}`
});

const useStyles = makeStyles(() => createStyles(({
    flexContainer: {
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    mainAnimator: {
        "& > div": {
            position: "absolute",
            top: 0,
            left: 0,
            transform: "translate(-50%, -50%)",

        }
    },
    innerLine: (props: StyleProps) => lineStyles(props, "inner"),
    outerLine: (props) => lineStyles(props, "outer"),
})));

interface Props {
}

let MainLoadingContent: React.FC<Props> = () => {
    const classes = useStyles({
        linesRadius: {
            inner: 190,
            outer: 255
        }
    });

    return <div className={classes.flexContainer}>
        <motion.div
            whileHover={{
                scale: 1.05
            }}
            style={{
                position: "relative",
                opacity: 0
            }}
            animate={{
                opacity: 1
            }}
            transition={{
                opacity: {
                    delay: 0.3,
                    duration: 0.6
                }
            }}
            className={classes.mainAnimator}
        >
            {
                ["inner", "outer"].map((type) => (
                    <motion.div
                        key={type}
                        //@ts-ignore
                        className={classes[`${type}Line`]}
                    // animate={{
                    //     boxShadow: {}
                    // }}
                    />
                ))
            }
            {/* <div className={classes.innerLine} />
            <div className={classes.outerLine} /> */}
            {/* outer div, needed to avoid conflicts with transform property */}
            <div >
                {/* inner div used for rotation animation */}
                <motion.div
                    style={{
                        rotate: -64,
                        color: "var(--ion-text-color)"
                    }}
                    animate={{
                        rotate: 296
                    }}
                    transition={{
                        loop: Infinity,
                        duration: 10,
                        ease: "linear",
                    }}
                >
                    <CircularText text={CIRCULAR_TEXT} radius={120} />
                </motion.div>
            </div>
        </motion.div>
    </div>;
};

interface CircularTextProps {
    text: string,
    radius: number;
}

const CircularText: React.FC<CircularTextProps> = (props) => {
    return React.createElement("circular-text", props, null);
};

export default MainLoadingContent;