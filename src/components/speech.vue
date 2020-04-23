<style scoped>
.icon {
    background: none;
    border: 0;
    outline-width: 0;
    cursor:pointer;
    width:30px;

}
</style>

<template>
    <img  src="../static/speaker.png" class="image_middle icon" style=''  @click="speak()"   />



</template>

<script type="text/javascript">
export default {
    props: ['text', 'lang', 'rate', 'pitch', 'voice', 'settings', 'classes', 'styles'],

    methods: {
        speak() {

          let u = new SpeechSynthesisUtterance();
          u.text = this.text;
        //  u.lang=this.lang;
          speechSynthesis.speak(u);
        },

    },
    data() {
        return {

        }
    },
    mounted(){

    }
}
</script>
