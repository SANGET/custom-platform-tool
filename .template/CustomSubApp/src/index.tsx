/**
 * 此入口仅用于启动独立应用，需要应用该应用，请通过 ./src/app.tsx
 */
import React from "react";
import ReactDOM from "react-dom";

import { CustomSubApp } from "./app";

ReactDOM.render(<CustomSubApp />, document.querySelector("#Main"));
