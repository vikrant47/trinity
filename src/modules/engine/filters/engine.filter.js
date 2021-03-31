import { DateTime } from 'luxon';
import Vue from 'vue';

export default {
  Media: Vue.filter('media', function(value) {
    if (value) {
      return process.env.VUE_APP_MEDIA_SERVER_URL + value;
    }
    return value;
  }),
  FormatDate: Vue.filter('formatDate', function(value, format = DateTime.DATETIME_MED) {
    if (value) {
      return DateTime.fromSQL(String(value), { zone: 'utc' }).toLocaleString(format);
    }
  })
};
