<!--Pagination-->
<template>
  <el-pagination
    background
    :page-size.sync="page.limit"
    :total="page.total"
    :current-page.sync="page.page"
    :page-sizes="[15,30,46,60,100]"
    style="margin-top: 8px;"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="crud.sizeChangeHandler($event)"
    @current-change="crud.pageChangeHandler"
  />
</template>
<script>
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';

// configure language
locale.use(lang);
import { pagination } from '@crud/crud';

export default {
  mixins: [pagination()]
};
</script>
