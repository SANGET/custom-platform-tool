import React from 'react';

type Renderer = () => JSX.Element

interface FrameLayoutProps {
  headerRender: Renderer
  leftPanel: Renderer
  rightPanel: Renderer
  centerPanel: Renderer
  footer: Renderer
}

export const FrameLayout: React.FC<FrameLayoutProps> = ({
  centerPanel, footer, headerRender, leftPanel, rightPanel
}) => {
  return (
    <div className="visual-app">
      <header className="app-header">
        {headerRender()}
      </header>
      <div className="app-content">
        <div
          className="comp-panel"
        >
          {leftPanel()}
        </div>
        <div
          className="canvas-container"
        >
          {centerPanel()}
        </div>
        <div
          className="prop-panel"
        >
          {rightPanel()}
        </div>
      </div>
      <div className="app-footer">
        {footer()}
      </div>
    </div>
  );
};
