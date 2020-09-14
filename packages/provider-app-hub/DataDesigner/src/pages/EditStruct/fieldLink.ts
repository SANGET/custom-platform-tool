/**
  * 字段类型与数据类型
  * 数据类型与长度 小数位 必填 唯一 字典 是否转拼音 编码规则联动关系
  */
export const fieldLinkObj = {
  STRING: {
    DataTypeEnum: [
      { value: "NORMAL", text: "空" },
      { value: "PK", text: "主键" },
      { value: "QUOTE", text: "引用" },
      { value: "DICT", text: "字典" },
      { value: "FK", text: "外键" },
      { value: "pic", text: "图片" },
      { value: "attach", text: "附件" },
      { value: "video", text: "视频" },
      { value: "audio", text: "音频" },
    ],
    NORMAL: {
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
      { value: "NORMAL", text: "空" },
      { value: "PK", text: "主键" },
      { value: "QUOTE", text: "引用" },
      { value: "FK", text: "外键" },
    ],
    NORMAL: {
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
  LONG: {
    DataTypeEnum: [
      { value: "NORMAL", text: "空" },
      { value: "PK", text: "主键" },
      { value: "QUOTE", text: "引用" },
      { value: "FK", text: "外键" },
    ],
    NORMAL: {
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
      { value: "NORMAL", text: "空" },
      { value: "PK", text: "主键" },
      { value: "QUOTE", text: "引用" },
      { value: "FK", text: "外键" },
    ],
    NORMAL: {
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
  DATE_TIME: {
    DataTypeEnum: [
      { value: "NORMAL", text: "空" },
      { value: "PK", text: "主键" },
      { value: "QUOTE", text: "引用" },
      { value: "FK", text: "外键" },
    ],
    NORMAL: {
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
      { value: "NORMAL", text: "空" },
      { value: "PK", text: "主键" },
      { value: "QUOTE", text: "引用" },
      { value: "FK", text: "外键" },
    ],
    NORMAL: {
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
    DataTypeEnum: [
      { value: "NORMAL", text: "空" }
    ],
    NORMAL: {
      isDisabledFieldSize: true,
      isDisabledRequired: true,
      isDisabledUni: true,
    },
  },
};
