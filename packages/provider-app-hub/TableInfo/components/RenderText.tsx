import React from 'react';

interface IRenderTextProps {
  text: string
}
/** 通用文本渲染 */
const RenderText: React.FC<IRenderTextProps> = (props: IRenderTextProps) => {
  const { text } = props;
  return <span title = {text ? text.toString() : undefined}>{text}</span>;
};
export default React.memo(RenderText);
