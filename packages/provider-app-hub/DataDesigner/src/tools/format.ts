/*
 * @Author: wph
 * @Date: 2020-08-07 17:31:53
 * @LastEditTime: 2020-08-25 02:01:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\provider-app-hub\DataDesigner\src\tools\format.ts
 */

/** 日期类型约束 */
type TDate= number | string;

export const codeToText = (obj) => {
  const { arr, val } = obj;
  /** 将表类型代码转换为文字 */
  const showText = arr.find((item) => item.value === val);
  return showText ? showText.text : val;
};
/**
 * gmt时间格式化
 * @param times 日期
 * @param fmt  格式
 */
export const formatGMT = (times, fmt?) => {
  /** 将gmt时间转换成标准时间 */
  const dateTime = new Date(times);
  // 定义一个日期数组
  const dateArr:TDate[] = [
    // 获得系统年份;
    dateTime.getFullYear(),
    // 获得系统月份;
    dateTime.getMonth() + 1,
    // 获得系统当月分天数;
    dateTime.getDate(),
    // 获得系统小时;
    dateTime.getHours(),
    // 获得系统分钟;
    dateTime.getMinutes(),
    // 获得系统秒数;
    dateTime.getSeconds(),
  ];

  /** 不足两位补足两位 */
  const [year, month, day, hour, minute, second] = dateArr.map((item) => (item < 10 ? `0${item}` : item));
  /** 支持三种日期格式 */
  /** 默认是年月日时分秒 */
  return {
    'yyyy-MM-dd': `${year}-${month}-${day}`,
    'hh:mm:ss': `${hour}:${minute}:${second}`,
    'yyyy-MM-dd hh:mm:ss': `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }[fmt || 'yyyy-MM-dd hh:mm:ss'];
};
