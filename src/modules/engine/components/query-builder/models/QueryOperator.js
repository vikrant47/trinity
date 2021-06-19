import { FIELD_TYPES } from '@/modules/engine/core/engine.field';

export const OPERATORS = {
  equal: {
    label: 'Equal',
    type: 'equal',
    nb_inputs: 1,
    multiple: false,
    apply_to: [FIELD_TYPES.REFERENCE, FIELD_TYPES.DATE, FIELD_TYPES.STRING, FIELD_TYPES.BIG_INTEGER, FIELD_TYPES.INTEGER, FIELD_TYPES.BOOLEAN, FIELD_TYPES.UUID]
  },
  not_equal: {
    label: 'Not Equal',
    type: 'not_equal',
    nb_inputs: 1,
    multiple: false,
    apply_to: [FIELD_TYPES.REFERENCE, FIELD_TYPES.DATE, FIELD_TYPES.STRING, FIELD_TYPES.BIG_INTEGER, FIELD_TYPES.INTEGER, FIELD_TYPES.BOOLEAN, FIELD_TYPES.UUID]
  },
  in: {
    label: 'In',
    type: 'in',
    nb_inputs: 1,
    multiple: true,
    apply_to: [FIELD_TYPES.REFERENCE, FIELD_TYPES.DATE, FIELD_TYPES.STRING, FIELD_TYPES.BIG_INTEGER, FIELD_TYPES.INTEGER, FIELD_TYPES.UUID]
  },
  not_in: {
    label: 'Not In',
    type: 'not_in',
    nb_inputs: 1,
    multiple: true,
    apply_to: [FIELD_TYPES.REFERENCE, FIELD_TYPES.DATE, FIELD_TYPES.STRING, FIELD_TYPES.BIG_INTEGER, FIELD_TYPES.INTEGER, FIELD_TYPES.UUID]
  },
  less: {
    label: 'Less Than',
    type: 'less',
    nb_inputs: 1,
    multiple: false,
    apply_to: [FIELD_TYPES.DATE, FIELD_TYPES.DATE_TIME, FIELD_TYPES.INTEGER]
  },
  less_or_equal: {
    label: 'LTE',
    type: 'less_or_equal',
    nb_inputs: 1,
    multiple: false,
    apply_to: [FIELD_TYPES.DATE, FIELD_TYPES.DATE_TIME, FIELD_TYPES.INTEGER]
  },
  greater: {
    label: 'GT',
    type: 'greater',
    nb_inputs: 1,
    multiple: false,
    apply_to: [FIELD_TYPES.DATE, FIELD_TYPES.DATE_TIME, FIELD_TYPES.INTEGER]
  },
  greater_or_equal: {
    label: 'GTE',
    type: 'greater_or_equal',
    nb_inputs: 1,
    multiple: false,
    apply_to: [FIELD_TYPES.DATE, FIELD_TYPES.DATE_TIME, FIELD_TYPES.INTEGER]
  },
  between: {
    label: 'Between',
    type: 'between',
    nb_inputs: 2,
    multiple: false,
    apply_to: [FIELD_TYPES.DATE, FIELD_TYPES.DATE_TIME, FIELD_TYPES.INTEGER]
  },
  not_between: {
    label: 'Not Between',
    type: 'not_between',
    nb_inputs: 2,
    multiple: false,
    apply_to: [FIELD_TYPES.DATE, FIELD_TYPES.DATE_TIME, FIELD_TYPES.INTEGER]
  },
  begins_with: {
    label: 'Begins With',
    type: 'begins_with', nb_inputs: 1, multiple: false, apply_to: [FIELD_TYPES.STRING, FIELD_TYPES.TEXT]
  },
  not_begins_with: {
    label: 'Not Begins With',
    type: 'not_begins_with',
    nb_inputs: 1,
    multiple: false,
    apply_to: [FIELD_TYPES.STRING, FIELD_TYPES.TEXT]
  },
  contains: {
    label: 'Contains',
    type: 'contains', nb_inputs: 1, multiple: false, apply_to: [FIELD_TYPES.STRING, FIELD_TYPES.TEXT]
  },
  not_contains: {
    label: 'Not Contains',
    type: 'not_contains',
    nb_inputs: 1,
    multiple: false,
    apply_to: [FIELD_TYPES.STRING, FIELD_TYPES.TEXT]
  },
  ends_with: {
    label: 'Ends With',
    type: 'ends_with', nb_inputs: 1, multiple: false, apply_to: [FIELD_TYPES.STRING, FIELD_TYPES.TEXT]
  },
  not_ends_with: {
    label: 'Not Ends With',
    type: 'not_ends_with',
    nb_inputs: 1,
    multiple: false,
    apply_to: [FIELD_TYPES.STRING, FIELD_TYPES.TEXT]
  },
  is_empty: {
    label: 'Empty',
    type: 'is_empty', nb_inputs: 0, multiple: false, apply_to: [FIELD_TYPES.STRING, FIELD_TYPES.TEXT]
  },
  is_not_empty: {
    label: 'Not Empty',
    type: 'is_not_empty',
    nb_inputs: 0,
    multiple: false,
    apply_to: [FIELD_TYPES.STRING, FIELD_TYPES.TEXT]
  },
  is_null: {
    label: 'Null',
    type: 'is_null',
    nb_inputs: 0,
    multiple: false,
    apply_to: [FIELD_TYPES.REFERENCE, FIELD_TYPES.DATE, FIELD_TYPES.STRING, FIELD_TYPES.BIG_INTEGER, FIELD_TYPES.INTEGER, FIELD_TYPES.UUID, FIELD_TYPES.BOOLEAN, FIELD_TYPES.CHOICE, FIELD_TYPES.ENUM, FIELD_TYPES.JSON]
  },
  is_not_null: {
    label: 'Not Null',
    type: 'is_not_null',
    nb_inputs: 0,
    multiple: false,
    apply_to: [FIELD_TYPES.REFERENCE, FIELD_TYPES.DATE, FIELD_TYPES.STRING, FIELD_TYPES.BIG_INTEGER, FIELD_TYPES.INTEGER, FIELD_TYPES.UUID, FIELD_TYPES.BOOLEAN, FIELD_TYPES.CHOICE, FIELD_TYPES.ENUM, FIELD_TYPES.JSON]
  }
};

export class QueryOperator {
  static getAvailableOperators(operators, fieldType) {
    return Object.keys(operators).filter((op) => {
      return operators[op].apply_to.indexOf(fieldType) >= 0;
    }).map(op => operators[op]);
  }
}
