import React from "react";
import { ShowModal, Button } from "@deer-ui/core";

const AboutPage = props => {
  return (
    <div className="home-page">
      <div>
        <h2>React 工程脚手架</h2>
        <ul>
          <li>支持 SCSS</li>
          <li>支持 hot loader</li>
          <li>webpack 4</li>
          <li>typescript</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;
