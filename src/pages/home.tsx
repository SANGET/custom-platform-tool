import React, { useEffect, useState } from "react";
import { ShowModal, Button } from "@deer-ui/core";
import { getUsers } from "../auth/actions/apis";

const Popover = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    getUsers().then(res => {
      // console.log(res)
      setUsers(res.data);
    });
    return () => {};
  }, []);
  return (
    <div className="p20">
      <h3>Users</h3>
      {JSON.stringify(users)}
    </div>
  );
};

const HomePage = props => {
  return (
    <div className="home-page">
      <Button
        text="弹出层"
        onClick={e => {
          ShowModal({
            title: "欢迎",
            children: <Popover />
          });
        }}
      />
    </div>
  );
};

export default HomePage;
