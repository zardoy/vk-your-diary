import React from "react";

interface Props {
}

let SecondaryText: React.FC<Props> = ({ children }) => {
    return <p className="color-secondary-text ion-padding-horizontal ion-padding-bottom">{children}</p>;
};

export default SecondaryText;