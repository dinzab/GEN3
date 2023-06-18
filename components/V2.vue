<template>
    <div class="otp w-full">
      <div class="container flex justify-around">
        <template v-for="(field, index) in otpDigits" :key="index">
          <input
            v-model="otp[index]"
            ref="otpInput"
            type="tel"
            inputmode="numeric"
            maxlength="1"
            minlength="1"
            required
            class="border rounded nn p-0 m-1 text-center"
            @input="handleOtpInput($event)"
            @paste="field === 0 && handlePaste($event)"
            @focus="handleFocus(index)"
          />
        </template>
      </div>
      <div class="grid grid-cols-1 pt-2" :class="{'hide': !displayError}">
        <div class="col-span-1">
          <div class="error" style="border:none!important">
            <p>OTP code is required</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      fields: {
        type: Number,
        required: true
      },
      displayError: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        otpDigits: Array.from({ length: this.fields }, (_, index) => index),
        otp: Array.from({ length: this.fields }, () => '')
      };
    },
    mounted() {
      this.$nextTick(() => {
        if (this.$refs.otpInput[0]) {
          this.$refs.otpInput[0].focus();
        }
      });
    },
    watch: {
      otp: {
        handler(newVal) {
          if (
            newVal.length === this.fields &&
            !newVal.includes('')
          ) {
            const otpCode = newVal.join('');
            this.$emit('update:modelValue', Number(otpCode));
            this.$emit('inputFocus', this.otp);
          } else {
            this.$emit('update:modelValue', null);
          }
        },
        deep: true
      }
    },
    methods: {
      handleOtpInput(event) {
        const input = event.target;
        const inputValue = event.data;
  
        if (inputValue && input.nextElementSibling) {
          input.nextElementSibling.focus();
        } else if (inputValue === null && input.previousElementSibling) {
          input.previousElementSibling.focus();
        }
      },
      handlePaste(event) {
        const pasteData = event.clipboardData.getData('text');
        const pasteDigits = pasteData.replace(/[^0-9]/g, '');
        const pasteLength = Math.min(pasteDigits.length, this.otpDigits.length);
  
        for (let i = 0; i < pasteLength; i++) {
          this.otp[i] = pasteDigits.charAt(i);
        }
  
        this.$nextTick(() => {
          if (this.$refs.otpInput[pasteLength]) {
            this.$refs.otpInput[pasteLength].focus();
          }
        });
      },
      handleFocus(index) {
        this.$emit('inputFocus', this.otp);
        this.$nextTick(() => {
          if (this.$refs.otpInput[index]) {
            this.$refs.otpInput[index].select();
          }
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .nn {
    width: 2.8em;
    height: 2.5em;
  }
  .hide {
    display: none;
  }
  </style>
  