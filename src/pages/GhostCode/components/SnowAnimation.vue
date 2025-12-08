<template>
  <div class="snow-container">
    <div class="snowflake" v-for="n in 30" :key="n" :style="getSnowflakeStyle(n)"></div>
  </div>
</template>

<script setup>
const getSnowflakeStyle = (index) => {
  const styles = [
    { size: 10, left: 10, duration: 12, delay: 0 },
    { size: 8, left: 20, duration: 14, delay: 1 },
    { size: 12, left: 30, duration: 16, delay: 2 },
    { size: 6, left: 40, duration: 13, delay: 3 },
    { size: 9, left: 50, duration: 15, delay: 4 },
    { size: 7, left: 60, duration: 11, delay: 5 },
    { size: 11, left: 70, duration: 17, delay: 6 },
    { size: 5, left: 80, duration: 10, delay: 7 },
    { size: 8, left: 90, duration: 14, delay: 8 },
    { size: 10, left: 5, duration: 13, delay: 9 },
    { size: 6, left: 15, duration: 12, delay: 10 },
    { size: 9, left: 25, duration: 15, delay: 11 },
    { size: 7, left: 35, duration: 14, delay: 12 },
    { size: 11, left: 45, duration: 16, delay: 13 },
    { size: 8, left: 55, duration: 13, delay: 14 },
    { size: 10, left: 65, duration: 12, delay: 15 },
    { size: 6, left: 75, duration: 11, delay: 16 },
    { size: 9, left: 85, duration: 14, delay: 17 },
    { size: 7, left: 95, duration: 13, delay: 18 },
    { size: 12, left: 3, duration: 17, delay: 19 },
    { size: 5, left: 13, duration: 10, delay: 20 },
    { size: 8, left: 23, duration: 14, delay: 21 },
    { size: 6, left: 33, duration: 12, delay: 22 },
    { size: 10, left: 43, duration: 15, delay: 23 },
    { size: 7, left: 53, duration: 13, delay: 24 },
    { size: 9, left: 63, duration: 16, delay: 25 },
    { size: 11, left: 73, duration: 14, delay: 26 },
    { size: 8, left: 83, duration: 12, delay: 27 },
    { size: 6, left: 93, duration: 11, delay: 28 },
    { size: 10, left: 8, duration: 15, delay: 29 }
  ]
  
  const style = styles[index - 1] || styles[0]
  
  return {
    width: `${style.size}px`,
    height: `${style.size}px`,
    left: `${style.left}%`,
    animationDuration: `${style.duration}s`,
    animationDelay: `${style.delay}s`
  }
}
</script>

<style scoped>
.snow-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 20;
  overflow: hidden;
}

.snowflake {
  position: absolute;
  background: white;
  border-radius: 50%;
  opacity: 0.8;
  animation-name: snowfall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes snowfall {
  0% {
    top: -10%;
    transform: translateX(0) rotate(0deg);
    opacity: 0.8;
  }
  25% {
    transform: translateX(25px) rotate(90deg);
  }
  50% {
    transform: translateX(-15px) rotate(180deg);
    opacity: 0.6;
  }
  75% {
    transform: translateX(20px) rotate(270deg);
  }
  100% {
    top: 100%;
    transform: translateX(-10px) rotate(360deg);
    opacity: 0;
  }
}
</style>