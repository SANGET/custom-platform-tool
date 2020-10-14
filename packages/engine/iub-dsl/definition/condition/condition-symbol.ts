export enum ConditionSymbol {
  OR = 'or',
  AND = 'and'
}

/** APB 的条件操作符 */
export enum ConditionOperator {
  EQU = 'equ', // =
  N_EQU = 'not_equ', // <>
  GERATER = 'gerater', // >
  LESS = 'less', // <
  GERATER_EQU = 'gerater_equ', // =>
  LESS_EQU = 'less_equ', // <=
  BETWEEN = 'between',
  N_BETTWEEN = 'not_between',
  LIKE = 'like',
  N_LIKE = 'not_like',
  IN = 'in',
  N_IN = 'not_in',
  EMPTY = 'empty',
  N_EMPTY = 'not_empty',
  S_WITH = 'start_with',
  S_N_WITH = 'start_not_with'
}

// case ConditionOperator.N_EMPTY:
// case ConditionOperator.EMPTY:
// case ConditionOperator.EQU:
// case ConditionOperator.BETWEEN:
// case ConditionOperator.GERATER:
// case ConditionOperator.GERATER_EQU:
// case ConditionOperator.IN:
// case ConditionOperator.LESS:
// case ConditionOperator.LESS_EQU:
// case ConditionOperator.LIKE:
// case ConditionOperator.N_BETTWEEN:
// case ConditionOperator.N_EQU:
// case ConditionOperator.N_IN:
// case ConditionOperator.N_LIKE:
// case ConditionOperator.S_N_WITH:
// case ConditionOperator.S_WITH:
