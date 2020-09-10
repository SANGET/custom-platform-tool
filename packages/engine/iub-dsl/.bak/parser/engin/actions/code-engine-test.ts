/**
 * 1、校验的结果的储存?
 * 2、 open点击的, 校验的处理?
 */

export const locationNameChange = (val, context) => {
  const baseVal = { locationName: val };
  context.change(baseVal);

  if (!context.valid(baseVal)) {
    return context.feeckback({ msg: context.validMsg });
  }
  if (!context.remoteVaild(baseVal)) {
    // TODO:
    return context.feeckback({ msg: context.remoteMsg });
  }
};

const struct = {
  action: 'open',
  // 部分是结构描述数据、 部分是固定值
  // 输出需要按照通用结构描述进行输出,, 输出结构的键值对 如何标准,如何定位? 「通过元数据对应?」
  // TODO: 如何预期的按照规定, 输入和输出
};
export const open = async (context) => {
  const selRes = await context.open('url', { ref: ['@(schemas)selPid'] });
  context.change(selRes);

  // 标准应该是页面的唯一标示
  const inputStruct = {

  };
  // 输出的标准是元数据映射的标准
  const outStruct = {
    resultSchemasRf: {
      id: '',
      pid: '',
      locationName: '',
      locationType: ''
    },
    metadataMapping: {
    }
  };
  // TODO: 如何知道此处需不需要校验,
};

// 上级位置选中 有2种场景
// 1. 传入位置类型的条件, 过滤内部内容,
// 2. 上级位置pid, 过滤位置类型

const onLocationTypeSelect = async (
  context,
  selVal // 标准化后的值
) => {
  // 这一步是默认的
  context.dispatchVal({ selVal });

  // 有很多很多的系统默认规则 ?

  // 实际情况下, 配置了条件这一步默认加上,, 是关系集合描述? 因为选中框, 中的值被该文本框的值所影响. 这个可以监测到
  // 1. 收集记录表达式变量被使用的位置
  // 2. 生成规则处, 生成对应的流程的函数
  // 如何加上? 解析到数据变更的一些副作用?
  if (!context.vaild('@(schemas)selPid.type', selVal)) {
    context.dispatchVal({ '@(schemas)selPid': null });
  }
};
