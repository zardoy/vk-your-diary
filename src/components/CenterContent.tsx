import React from "react";

interface Props {
}

let CenterContent: React.FC<Props> = ({ children }) => {
    return <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        {children}
    </div>;
};

export default CenterContent;