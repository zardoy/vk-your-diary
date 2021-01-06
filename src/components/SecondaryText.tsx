import React from "react";

interface Props extends React.ComponentProps<"p"> {
}

let SecondaryText: React.FC<Props> = ({ children, ...props }) => {
    return <p
        {...props}
        className={"color-secondary-text ion-padding-horizontal ion-padding-bottom " + (props.className || "")}
    >
        {children}
    </p>;
};

export default SecondaryText;