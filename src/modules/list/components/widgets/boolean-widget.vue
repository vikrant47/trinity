<template>
  <div class="cell-wrapper">
    <i
      :class="value===true?'el-icon-check':'el-icon-close'"
      style="margin-left: 10px"
    />
    {{ value }}
  </div>
</template>
<script>

export default {
  name: 'BooleanWidget',
  props: {
    href: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      required: true
    },
    column: {
      type: Object,
      required: true
    }
  },
  computed: {
    value() {
      return this.row[this.column.name];
    }
  },
  methods: {
    click() {
      this.$emit('click', this.row, this.column);
    }
  }
};
</script>

<style scoped>
  i{
    font-weight: bold;
  }
  i.el-icon-close{
    color: red;
  }
  i.el-icon-check{
    color: green;
  }
</style>
