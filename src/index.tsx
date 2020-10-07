import React from "react";
import ReactDOM from "react-dom";

import GolCanvas from "./features/gol_canvas/GolCanvas";

const App = () => {
  return <GolCanvas />;
};

ReactDOM.render(<App />, document.getElementById("react-root"));
