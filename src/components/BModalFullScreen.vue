<template>
    <!-- The overlay -->
  <div id="myNav" :style="modalControl ? 'width:100%' : 'width:0'" class="overlay">

    <!-- Button to close the overlay navigation -->
    <span class="closebtn" @click="closeModal"><i class="fas fa-times-circle"></i></span>

    <!-- Overlay content -->
    <div class="overlay-content">
      <slot name="content"></slot>
    </div>

  </div>
</template>

<script>
export default {
  name: 'BModalFullScreen',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    modalControl: {
      get () {
        return this.show
      },
      set (value) {
        this.$emit('update:show', value)
      }
    }
  },
  methods: {
    closeModal () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
/* The Overlay (background) */
.overlay {
  /* Height & width depends on how you want to reveal the overlay (see JS below) */    
  height: 100%;
  width: 0;
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  background-color: rgb(255, 255, 255); /* Black fallback color */
  /* background-color: rgba(0,0,0, 0.1); Black w/opacity */
  overflow-x: hidden; /* Disable horizontal scroll */
  transition: 0.5s; /* 0.5 second transition effect to slide in or slide down the overlay (height or width, depending on reveal) */
}

/* Position the content inside the overlay */
.overlay-content {
  position: relative;
  top: 7%; /* 25% from the top */
  width: 100%; /* 100% width */
  text-align: center; /* Centered text/links */
  margin-top: 30px; /* 30px top margin to avoid conflict with the close button on smaller screens */
}

/* The navigation links inside the overlay */
.overlay a {
  padding: 8px;
  text-decoration: none;
  font-size: 36px;
  color: #818181;
  display: block; /* Display block instead of inline */
  transition: 0.3s; /* Transition effects on hover (color) */
}

/* When you mouse over the navigation links, change their color */
.overlay a:hover, .overlay a:focus {
  color: #f1f1f1;
}

/* Position the close button (top right corner) */
.overlay .closebtn {
  position: absolute;
  top: 10px;
  right: 45px;
  font-size: 40px;
  cursor: pointer;
}

/* When the height of the screen is less than 450 pixels, change the font-size of the links and position the close button again, so they don't overlap */
@media screen and (max-height: 450px) {
  .overlay a {font-size: 20px}
  .overlay .closebtn {
    font-size: 25px;
    top: 15px;
    right: 35px;
  }
}
</style>
