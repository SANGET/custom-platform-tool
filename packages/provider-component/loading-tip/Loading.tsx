import React from 'react';
import { LoadingOutlined } from "@ant-design/icons";

export const LoadingTip = () => (
  <div className="container mx-auto text-center py-10 text-gray-500">
    <LoadingOutlined className="text-6xl" />
    <div className="py-10">Loading</div>
  </div>
);
