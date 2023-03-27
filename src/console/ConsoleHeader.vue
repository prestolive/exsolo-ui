<template>
  <div class="c-header"></div>
</template>
<script lang="ts" setup></script>
<style scoped>
.c-header {
  height: 48px;
  /* position: sticky; */
  top: 0;
  left: 0;
  width: auto;
  box-sizing: border-box;
  background-color: #fff;
  border-bottom: 1px dashed #ccc;
  z-index: 10;
}

.c-header::after {
  content: 'header';
  position: absolute;
  top: 12px;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  font-size: 0.8em;
  color: rgba(0, 0, 0, 0.45);
  width: 100%;
  text-align: center;
}
</style>
