import { AllComponentType } from "@iub-dsl/definition";

const inputC = {
  compType: AllComponentType.FormInput,
  label: '位置名称',
  value: '',
  unit: '位',
  suffix: '位',
  placeholder: '请输入位置名称',
  markTip: '详细真实的位置名称',
  tipContent: '详细真实的位置名称',
  compCode: 'compId1',
  compId: 'compId1',
  schemasQuote: '$(schemas).dId1'
};

const componentConf = {
  compId1: inputC
};

export default componentConf;
