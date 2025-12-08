<template>
  <div class="flex w-full h-[47px] border-b-2 border-[#242627] items-center fixed bg-[#111111] z-10">
    <img :src="logo" alt="logo" class="h-full ml-[250px]" />

    <div class="flex items-center ml-auto mr-[250px]">
      <div class="relative">
        <input
          type="text"
          placeholder="Что ищете в царстве теней?"
          class="ml-[-550px] font-exo font-[400] text-[14px] w-[262px] h-[29px] bg-[#202020] pl-[35px] rounded-[25px] border border-[#2C2C2C] cursor-pointer outline-none text-[#B6B5B5]"
        />
      </div>
      <img :src="lupa" alt="search icon" class="absolute ml-[-540px]" />

      <div class="flex items-center ml-[25px] space-x-[15px]">
        <img :src="sms" alt="sms" class="w-[25px] h-[25px] cursor-pointer" />

        <div class="relative">
          <img
            :src="notifaction"
            alt="notifaction"
            class="w-[40px] h-[40px] cursor-pointer "
            @click="$emit('toggle-notifications')"
          />
          <span
            v-if="notificationStore.unreadCount > 0"
            class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
          >
            {{ notificationStore.unreadCount }}
          </span>
        </div>

        <UseProfileHeader />
      </div>
    </div>
  </div>
</template>

<script setup>
import notifaction from '@/assets/1.png'
import logo from '@/assets/лого.png'
import lupa from '@/assets/лупа.png'
import sms from '@/assets/смс.png'
import { useNotificationStore } from '@/stores/notificationStore'
import { defineEmits } from 'vue'
import UseProfileHeader from './UseProfileHeader.vue'

const notificationStore = useNotificationStore()
defineEmits(['toggle-notifications'])
</script>