import ReactDOM from "react-dom";

export const gProto = Object.getPrototypeOf;

export const ReactDomProtp = gProto(ReactDOM);

export const isReactDOM = (dom: React.ReactNode) => ReactDomProtp === gProto(dom);

type RChildren = React.ReactNode | React.ReactNode[]

const addChildren = (orgChildren: React.ReactNode[], children: RChildren) => {
  if (Array.isArray(children)) {
    children.forEach((ch) => isReactDOM(ch) && orgChildren.push(ch));
  } else {
    isReactDOM(children) && orgChildren.push(children);
  }
};
export const mergeChildren = (children1: RChildren, children2: RChildren) => {
  if (children1 === undefined) return children2;
  if (children2 === undefined) return children1;

  const newChildren: React.ReactNode[] = [];

  addChildren(newChildren, children1);
  addChildren(newChildren, children2);

  return newChildren;
};
