import { createContext, useState } from "react";

export const Context = createContext();

const ContextProvider = (props) => {

    const [previousPrompt, setPreviousPrompt] = useState("");

 const contextValue = {
        previousPrompt
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
