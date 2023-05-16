<template>
  <div class="c-footer">
    Copyright @ 2021-2023 exsolo.cn. All Rights Reserved
  </div>
</template>
<script lang="ts" setup></script>
<style scoped>
.c-footer {
  height: 48px;
  position: relative;
  line-height: 32px;
  font-size: 0.8em;
  color: rgba(0, 0, 0, 0.6);
  text-align: center;
  background-color: #eee;
}

.c-footer::after {
  content: 'footer';
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
