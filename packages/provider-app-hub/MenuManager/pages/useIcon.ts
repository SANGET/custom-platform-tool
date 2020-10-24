import React, { useState, useEffect } from 'react';
// import * as AllIconsAI from "react-icons/ai";
// import * as AllIconsBI from "react-icons/bi";
// import * as AllIconsBS from "react-icons/bs";
// import * as AllIconsCG from "react-icons/cg";
// import * as AllIconsDI from "react-icons/di";
// import * as AllIconsFA from "react-icons/fa";
// import * as AllIconsFC from "react-icons/fc";
// import * as AllIconsFI from "react-icons/fi";
// import * as AllIconsGI from "react-icons/gi";
// import * as AllIconsGO from "react-icons/go";
// import * as AllIconsGR from "react-icons/gr";
// import * as AllIconsHI from "react-icons/hi";
// import * as AllIconsIM from "react-icons/im";
// import * as AllIconsIO from "react-icons/io";
// import * as AllIconsMD from "react-icons/md";
// import * as AllIconsRI from "react-icons/ri";
// import * as AllIconsWI from "react-icons/wi";
// import * as allIcons from "react-icons/all";

// TODO: 将 react icons 的名称填满
export type reactIconType = 'react-icons/all' |
'react-icons/ri' |
'react-icons/bi'

const allIconsCollection = {};

export const useIcon = (reactIconType: reactIconType) => {
  const iconsCache = allIconsCollection[reactIconType];
  const [ready, setReady] = useState(!!iconsCache);
  useEffect(() => {
    if (ready) return;
    import(reactIconType)
      .then((allIconsRes) => {
        allIconsCollection[reactIconType] = allIconsRes;
        setReady(true);
      });
  }, []);
  return [
    ready,
    allIconsCollection[reactIconType]
  ];
};
