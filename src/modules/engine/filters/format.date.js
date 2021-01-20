import { DateTime } from 'luxon';
import Vue from 'vue';

export const FormatDate = Vue.filter('formatDate', function(value, format = DateTime.DATETIME_MED) {
  if (value) {
    return DateTime.fromSQL(String(value), { zone: 'utc' }).toLocaleString(format);
  }
});
