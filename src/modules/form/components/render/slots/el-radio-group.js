export default {
  options(h, conf, key) {
    const list = [];
    conf.slot.options.forEach(item => {
      if (conf.widgetSettings.optionType === 'button') {
        list.push(<el-radio-button label={item.value}>{item.label}</el-radio-button>);
      } else {
        list.push(<el-radio label={item.value} border={conf.border}>{item.label}</el-radio>);
      }
    });
    return list;
  }
};
