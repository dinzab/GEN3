<script lang="ts" setup>
import { ref, watch } from 'vue';
const props = defineProps<{
  fields: number;
  displayError: boolean
}>();
const mask = "#"
const data = ref([]);
const firstInputEl = ref(null);
const emit = defineEmits(['update:modelValue','inputFocus']);

watch(
  () => data,
  (newVal) => {
    if (
      newVal.value != '' &&
      newVal.value.length === props.fields &&
      !newVal.value.includes('')
    ) {
      emit('update:modelValue', Number(newVal.value.join('')));
    } else {
      emit('update:modelValue', null);
    }
  },
  { deep: true }
);
const handleOtpInput = (e) => {
  if (e.data && e.target.nextElementSibling) {
    e.target.nextElementSibling.focus();
  } else if (e.data == null && e.target.previousElementSibling) {
    e.target.previousElementSibling.focus();
  }
};

const handlePaste = (e) => {
  const pasteData = e.clipboardData.getData('text');
  let nextEl = firstInputEl.value[0].nextElementSibling;
  for (let i = 1; i < pasteData.length; i++) {
    if (nextEl) {
      data.value[i] = pasteData[i];
      nextEl = nextEl.nextElementSibling;
    }
  }
};
const focus = () => {
  emit('inputFocus',data)
}
// 123456
</script>

<template>
  <div class="otp w-full" @input="handleOtpInput">
    
      <div class="container flex justify-around">
        <template v-for="field in fields" :key="field">
          <input
        v-model="data[field - 1]"
        ref="firstInputEl"
        type="tel"
        maxlength="1"
        minlength="1"
        required
        v-mask="mask"
        class="border rounded nn p-0 m-1 text-center"
        @paste="field === 1 && handlePaste($event)"
        @focus="focus()"
      />
        </template>
        
      </div>
      <div class="grid grid-cols-1 pt-2 " :class="{'hide': !props.displayError}">
        <div class="col-span-1">
            <div class="error" style="border:none!important">
                <p>OTP code is required</p>
            </div>
        </div>
    </div>
  </div>
</template>
<style scope>
    .nn {
        width: 2.8em;
        height: 2.5em;
    }
</style>