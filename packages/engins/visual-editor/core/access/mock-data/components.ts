import { ComponentItemBindPropsConfig } from "../component/item-bind-props";

const componentAccess: ComponentItemBindPropsConfig[] = [
  {
    type: 'Input',
    id: '111',
    propsCatagroyGroup: [
      {
        title: '基本',
        id: '2',
        propsListGroup: [
          {
            title: '基本属性',
            items: [
              {
                id: 'propID-1',
              },
              {
                id: 'propID-2',
              },
              {
                id: 'propID-3',
              },
            ]
          }
        ]
      }
    ],
  }
];

export default componentAccess;
