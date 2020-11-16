<template>
  <div>
    <router-view />
  </div>
</template>

<script>
export default {
  mounted() {
    // Cancel the starting loading animation
    const preLoader = document.querySelector('#pre-loader');
    preLoader.style.display = 'none';

    // fix: firefox under Drag Will punch a new tab
    // https://github.com/JakHuang/form-generator/issues/15
    document.body.ondrop = event => {
      event.preventDefault();
      event.stopPropagation();
    };
  }
};
</script>
