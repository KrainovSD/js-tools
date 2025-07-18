<script setup lang="ts">
  export type LoaderType =
    | "primary"
    | "secondary"
    | "tertiary"
    | "quaternary"
    | "quinary"
    | "senary";
  export type LoaderProps = { type?: LoaderType };

  withDefaults(defineProps<LoaderProps>(), { type: "primary" });
</script>

<template>
  <div v-if="$props.type === 'primary'" class="ksd-loader__primary">
    <i class="ksd-loader__primary-dot"></i>
    <i class="ksd-loader__primary-dot"></i>
    <i class="ksd-loader__primary-dot"></i>
    <i class="ksd-loader__primary-dot"></i>
  </div>
  <div v-if="$props.type === 'secondary'" class="ksd-loader__secondary"></div>
  <div v-if="$props.type === 'tertiary'" class="ksd-loader__tertiary"></div>
  <div v-if="$props.type === 'quaternary'" class="ksd-loader__quaternary"></div>
  <div v-if="$props.type === 'quinary'" class="ksd-loader__quinary"></div>
  <div v-if="$props.type === 'senary'" class="ksd-loader__senary"></div>
</template>

<style lang="scss">
  .ksd-loader {
    &__primary {
      position: absolute;
      top: 50%;
      inset-inline-start: 50%;
      translate: -50% -50%;
      display: inline-block;
      font-size: var(--ksd-loader-primary-size);
      width: 1em;
      height: 1em;
      color: var(--ksd-loader-primary-color);
      transform: rotate(45deg);
      animation-name: ksd-loader-primary-rotate;
      animation-duration: 1.2s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;

      @keyframes ksd-loader-primary-spin {
        0% {
          opacity: 0.3;
        }
        100% {
          opacity: 1;
        }
      }

      @keyframes ksd-loader-primary-rotate {
        0% {
          transform: rotate(45deg);
        }
        100% {
          transform: rotate(405deg);
        }
      }
    }

    &__primary-dot {
      position: absolute;
      display: block;
      width: calc((var(--ksd-loader-primary-size) - var(--ksd-margin-xxs) / 2) / 2);
      height: calc((var(--ksd-loader-primary-size) - var(--ksd-margin-xxs) / 2) / 2);
      background: currentColor;
      border-radius: 100%;
      transform: scale(0.75);
      transform-origin: 50% 50%;
      opacity: 0.3;
      animation-name: ksd-loader-primary-spin;
      animation-duration: 1s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
      animation-direction: alternate;
      animation-delay: 0s;

      &:nth-child(1) {
        top: 0;
        inset-inline-start: 0;
        animation-delay: 0s;
      }
      &:nth-child(2) {
        top: 0;
        inset-inline-end: 0;
        animation-delay: 0.4s;
      }
      &:nth-child(3) {
        inset-inline-end: 0;
        bottom: 0;
        animation-delay: 0.8s;
      }
      &:nth-child(4) {
        animation-delay: 1.2s;
        bottom: 0;
        inset-inline-start: 0;
      }
    }

    &__secondary {
      position: absolute;
      top: 50%;
      inset-inline-start: 50%;
      translate: -50% -50%;
      height: var(--ksd-loader-secondary-size);
      width: var(--ksd-loader-secondary-size);
      color: var(--ksd-loader-secondary-color);
      box-shadow:
        calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * -2) 0
          var(--ksd-loader-secondary-size),
        calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * -2) 0
          var(--ksd-loader-secondary-size),
        calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * -2) 0
          var(--ksd-loader-secondary-size),
        calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * -2) 0
          var(--ksd-loader-secondary-size);
      animation: ksd-loader-secondary 6s infinite;

      @keyframes ksd-loader-secondary {
        0% {
          box-shadow:
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * -2)
              0 var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * -2)
              0 var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * -2)
              0 var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * -2)
              0 var(--ksd-loader-secondary-size);
        }
        8.33% {
          box-shadow:
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * -2)
              0 var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * 2) calc(var(--ksd-loader-secondary-size) * -2) 0
              var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * 2) calc(var(--ksd-loader-secondary-size) * -2) 0
              var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * 2) calc(var(--ksd-loader-secondary-size) * -2) 0
              var(--ksd-loader-secondary-size);
        }
        16.66% {
          box-shadow:
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * -2)
              0 var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * 2) calc(var(--ksd-loader-secondary-size) * -2) 0
              var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * 2) calc(var(--ksd-loader-secondary-size) * 2) 0
              var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * 2) calc(var(--ksd-loader-secondary-size) * 2) 0
              var(--ksd-loader-secondary-size);
        }
        24.99% {
          box-shadow:
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * -2)
              0 var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * 2) calc(var(--ksd-loader-secondary-size) * -2) 0
              var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * 2) calc(var(--ksd-loader-secondary-size) * 2) 0
              var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * 2) 0
              var(--ksd-loader-secondary-size);
        }
        33.32% {
          box-shadow:
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * -2)
              0 var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * 2) calc(var(--ksd-loader-secondary-size) * -2) 0
              var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * 2) calc(var(--ksd-loader-secondary-size) * 2) 0
              var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * -2)
              0 var(--ksd-loader-secondary-size);
        }
        41.65% {
          box-shadow:
            calc(var(--ksd-loader-secondary-size) * 2) calc(var(--ksd-loader-secondary-size) * -2) 0
              var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * 2) calc(var(--ksd-loader-secondary-size) * -2) 0
              var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * 2) calc(var(--ksd-loader-secondary-size) * 2) 0
              var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * 2) calc(var(--ksd-loader-secondary-size) * -2) 0
              var(--ksd-loader-secondary-size);
        }
        49.98% {
          box-shadow:
            calc(var(--ksd-loader-secondary-size) * 2) calc(var(--ksd-loader-secondary-size) * 2) 0
              var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * 2) calc(var(--ksd-loader-secondary-size) * 2) 0
              var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * 2) calc(var(--ksd-loader-secondary-size) * 2) 0
              var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * 2) calc(var(--ksd-loader-secondary-size) * 2) 0
              var(--ksd-loader-secondary-size);
        }
        58.31% {
          box-shadow:
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * 2) 0
              var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * 2) 0
              var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * 2) calc(var(--ksd-loader-secondary-size) * 2) 0
              var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * 2) 0
              var(--ksd-loader-secondary-size);
        }
        66.64% {
          box-shadow:
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * -2)
              0 var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * -2)
              0 var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * 2) calc(var(--ksd-loader-secondary-size) * 2) 0
              var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * 2) 0
              var(--ksd-loader-secondary-size);
        }
        74.97% {
          box-shadow:
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * -2)
              0 var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * 2) calc(var(--ksd-loader-secondary-size) * -2) 0
              var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * 2) calc(var(--ksd-loader-secondary-size) * 2) 0
              var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * 2) 0
              var(--ksd-loader-secondary-size);
        }
        83.3% {
          box-shadow:
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * -2)
              0 var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * 2) calc(var(--ksd-loader-secondary-size) * 2) 0
              var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * 2) calc(var(--ksd-loader-secondary-size) * 2) 0
              var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * 2) 0
              var(--ksd-loader-secondary-size);
        }
        91.63% {
          box-shadow:
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * -2)
              0 var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * 2) 0
              var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * 2) 0
              var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * 2) 0
              var(--ksd-loader-secondary-size);
        }
        100% {
          box-shadow:
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * -2)
              0 var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * -2)
              0 var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * -2)
              0 var(--ksd-loader-secondary-size),
            calc(var(--ksd-loader-secondary-size) * -2) calc(var(--ksd-loader-secondary-size) * -2)
              0 var(--ksd-loader-secondary-size);
        }
      }
    }

    &__tertiary {
      top: 50%;
      inset-inline-start: 50%;
      translate: -50% -50%;
      position: absolute;
      width: var(--ksd-loader-tertiary-size);
      height: var(--ksd-loader-tertiary-size);
      border-radius: 50%;
      display: inline-block;
      border-top: 3px solid var(--ksd-loader-tertiary-color);
      border-right: 3px solid transparent;
      box-sizing: border-box;
      animation: ksd-loader-tertiary-rotation 1s linear infinite;

      @keyframes ksd-loader-tertiary-rotation {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    }

    &__quaternary {
      top: 50%;
      inset-inline-start: 50%;
      translate: -50% -50%;
      width: var(--ksd-loader-quaternary-size);
      height: var(--ksd-loader-quaternary-size);
      display: inline-block;
      position: relative;

      &::after,
      &::before {
        content: "";
        box-sizing: border-box;
        width: var(--ksd-loader-quaternary-size);
        height: var(--ksd-loader-quaternary-size);
        border-radius: 50%;
        background: var(--ksd-loader-quaternary-color);
        position: absolute;
        left: 0;
        top: 0;
        animation: ksd-loader-quaternary 2s linear infinite;
      }

      &::after {
        animation-delay: 1s;
        opacity: 0;
      }

      @keyframes ksd-loader-quaternary {
        0% {
          transform: scale(0);
          opacity: 1;
        }
        100% {
          transform: scale(1);
          opacity: 0;
        }
      }
    }

    &__quinary,
    &__quinary:before,
    &__quinary:after {
      border-radius: 50%;
      width: 2.5em;
      height: 2.5em;
      animation-fill-mode: both;
      animation: ksd-loader-quinary 1.8s infinite ease-in-out;
    }
    &__quinary {
      top: 50%;
      inset-inline-start: 50%;
      translate: -50% calc(-50% - 2.6em);
      color: var(--ksd-loader-quinary-color);
      font-size: var(--ksd-loader-quinary-size);
      position: relative;
      animation-delay: -0.16s;

      &::before,
      &::after {
        content: "";
        position: absolute;
        top: 0;
      }

      &::before {
        left: -3.5em;
        animation-delay: -0.32s;
      }

      &::after {
        left: 3.5em;
      }

      @keyframes ksd-loader-quinary {
        0%,
        80%,
        100% {
          box-shadow: 0 2.6em 0 -1.3em;
        }
        40% {
          box-shadow: 0 2.6em 0 0;
        }
      }
    }

    &__senary {
      top: 50%;
      inset-inline-start: 50%;
      translate: -50% -50%;
      width: 8px;
      height: var(--ksd-loader-senary-size);
      border-radius: 4px;
      display: block;
      position: absolute;
      background: currentColor;
      color: var(--ksd-loader-senary-color);
      box-sizing: border-box;
      animation: ksd-loader-senary 0.5s 0.3s linear infinite alternate;

      &::after,
      &::before {
        content: "";
        width: 8px;
        height: var(--ksd-loader-senary-size);
        border-radius: 4px;
        background: currentColor;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 20px;
        box-sizing: border-box;
        animation: ksd-loader-senary 0.5s 0.45s linear infinite alternate;
      }

      &::before {
        left: -20px;
        animation-delay: 0s;
      }

      @keyframes ksd-loader-senary {
        0% {
          height: var(--ksd-loader-senary-size);
        }
        100% {
          height: 4px;
        }
      }
    }
  }
</style>
