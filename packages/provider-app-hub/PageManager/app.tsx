import React, { useState, useRef, useCallback } from "react";
import { Row, Col } from "antd";
import PageList from "./pages/PageList";
import MenuTree from "./components/MenuTree";
import "./index.less";

const App: HY.SubApp = (props) => {
  const [moduleId, setModuleId] = useState<string | null>(null);
  const menuRef = useRef<{reload:() => void} | null>(null);
  const handleTreeSelect = useCallback((id) => {
    if (id === moduleId) return;
    setModuleId(id);
  }, [moduleId]);

  return (
    <Row className="data-design-layout">
      <Col xs={24} sm={8} md={7} lg={7} xl={5} className="sidebar-menu-tree">
        <MenuTree
          ref={menuRef}
          onSelect={handleTreeSelect}
        />
      </Col>
      <Col xs={24} sm={16} md={17} lg={17} xl={19} className="content-pro-table">
        <PageList
          moduleId={moduleId}
        />
      </Col>
    </Row>
  );
};

export default App;
