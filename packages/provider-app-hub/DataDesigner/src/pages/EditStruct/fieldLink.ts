/**
  * 字段类型与数据类型
  * 数据类型与长度 小数位 必填 唯一 字典 是否转拼音 编码规则联动关系
  */
export const fieldLinkObj = {
  STRING: {
    DataTypeEnum: [
      { value: "PK", text: "主键字段" },
      { value: "QUOTE", text: "引用字段" },
      { value: "DICT", text: "字典字段" },
      { value: "FK", text: "外键字段" },
      { value: "pic", text: "图片" },
      { value: "attach", text: "附件" },
      { value: "video", text: "视频" },
      { value: "audio", text: "音频" },
    ],
    Empty: {
      isDisabledFieldSize: true,
      isDisabledDeciSize: false,
      isDisabledRequired: true,
      isDisabledUni: true,
      isDisabledDict: false,
      isDisabledPY: true,
      isDisabledRule: true
    },
    PK: {
      isDisabledFieldSize: true,
      isDisabledRequired: true,
      isDisabledUni: true,
      isDisabledPY: true,
    },
    FK: {
      isDisabledFieldSize: true,
      isDisabledRequired: true,
    },
    QUOTE: {
      isDisabledFieldSize: true,
      isDisabledRequired: true,
    },
    DICT: {
      isDisabledFieldSize: true,
      isDisabledRequired: true,
      isDisabledDict: true,
    },
    pic: {
      isDisabledRequired: true,
    },
    attach: {
      isDisabledRequired: true,
    },
    video: {
      isDisabledRequired: true,
    },
    audio: {
      isDisabledRequired: true,
    },
  },
  INT: {
    DataTypeEnum: [
      { value: "PK", text: "主键字段" },
      { value: "QUOTE", text: "引用字段" },
      { value: "FK", text: "外键字段" },
    ],
    Empty: {
      isDisabledFieldSize: true,
      isDisabledDeciSize: true,
      isDisabledRequired: true,
      isDisabledUni: true,
      isDisabledRule: true
    },
    PK: {
      isDisabledFieldSize: true,
      isDisabledDeciSize: true,
      isDisabledRequired: true,
      isDisabledUni: true,
    },
    FK: {
      isDisabledFieldSize: true,
      isDisabledDeciSize: true,
      isDisabledRequired: true,
    },
    QUOTE: {
      isDisabledFieldSize: true,
      isDisabledDeciSize: true,
      isDisabledRequired: true,
    },
  },
  TIME: {
    DataTypeEnum: [
      { value: "PK", text: "主键字段" },
      { value: "QUOTE", text: "引用字段" },
      { value: "FK", text: "外键字段" },
    ],
    Empty: {
      isDisabledRequired: true,
      isDisabledUni: true,
      isDisabledRule: true
    },
    PK: {
      isDisabledRequired: true,
      isDisabledUni: true,
    },
    FK: {
      isDisabledRequired: true,
    },
    QUOTE: {
      isDisabledRequired: true,
    },
  },
  DATE: {
    DataTypeEnum: [
      { value: "PK", text: "主键字段" },
      { value: "QUOTE", text: "引用字段" },
      { value: "FK", text: "外键字段" },
    ],
    Empty: {
      isDisabledFieldSize: true,
      isDisabledRequired: true,
      isDisabledUni: true,
      isDisabledRule: true
    },
    PK: {
      isDisabledFieldSize: true,
      isDisabledRequired: true,
      isDisabledUni: true,
    },
    FK: {
      isDisabledFieldSize: true,
      isDisabledRequired: true,
    },
    QUOTE: {
      isDisabledRequired: true,
    },
  },
  TEXT: {
    DataTypeEnum: [],
    Empty: {
      isDisabledFieldSize: true,
      isDisabledRequired: true,
      isDisabledUni: true,
    },
  },
};
