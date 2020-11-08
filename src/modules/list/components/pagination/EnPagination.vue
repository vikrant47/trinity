<!--Pagination-->
<template>
  <el-pagination
    background
    :page-size.sync="paginationModel.limit"
    :total="paginationModel.total"
    :current-page.sync="paginationModel.page"
    :page-sizes="paginationModel.pageSizes"
    style="margin-top: 8px;"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="paginationModel.sizeChange"
    @current-change="paginationModel.currentChange"
  />
</template>
<script>
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
import { Pagination } from '@/modules/list/models/pagination';

// configure language
locale.use(lang);

export default {
  name: 'EnPagination',
  props: {
    paginationModel: {
      type: Pagination,
      require: true
    }
  }
};
</script>
