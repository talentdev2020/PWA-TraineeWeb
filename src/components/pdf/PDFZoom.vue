<template>
  <div class="pdf-zoom">
    <a @click.prevent.stop="zoomIn" class="icon" :disabled="isDisabled"><img src='../../static/icon-zoom-in.svg' width='22px'></a>
    <a @click.prevent.stop="zoomOut" class="icon" :disabled="isDisabled"><img src='../../static/icon-zoom-out.svg' width='22px'></a>
    <a @click.prevent.stop="fitWidth" class="icon" :disabled="isDisabled"><img src='../../static/icon-expand.svg' width='22px'></a>
    <a @click.prevent.stop="fitAuto" class="icon" :disabled="isDisabled"><img src='../../static/icon-shrink.svg' width='22px'></a>
  </div>
</template>

<script>

export default {
  name: 'PDFZoom',

  components: {

  },

  props: {
    scale: {
      type: Number,
    },
    increment: {
      type: Number,
      default: 0.25,
    },
  },

  computed: {
    isDisabled() {
      return !this.scale;
    },
  },

  methods: {
    zoomIn() {
      this.updateScale(this.scale + this.increment);
    },

    zoomOut() {
      if (this.scale <= this.increment) return;
      this.updateScale(this.scale - this.increment);
    },

    updateScale(scale) {
      this.$emit('change', {scale});
    },

    fitWidth() {
      this.$emit('fit', 'width');
    },

    fitAuto() {
      this.$emit('fit', 'auto');
    },
  },
}
</script>

<style>
.pdf-zoom a {
  float: left;
  cursor: pointer;
  display: block;
  border: 1px #333 solid;
  background: white;
  color: #333;
  font-weight: bold;
  line-height: 1.5em;
  width: 1.5em;
  height: 1.5em;
  font-size: 1.5em;
}
 .pdf-zoom .icon{
   display: unset;
   width: 30px;
   height: 30px;
   padding:unset;
 }
</style>
