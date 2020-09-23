/**
 * from组件公共的结构
 */

import { FullRenderStruct } from "../types/renderStruct";

/** TODO: 业务沉淀后再提取结构 */
export const fromCompCommonStruct: FullRenderStruct[] = [
  {
    compTag: 'markTip',
    canUseProps: [],
    canSkip: true,
    children: [
      {
        compTag: 'input',
        canUseProps: [],
        canSkip: false,
      }
    ]
  }
];
