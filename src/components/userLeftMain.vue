<script setup>
import LogOutLeft from '/src/assets/LogOutLeft.png'
import LupaLeft from '/src/assets/LupaLeft.png'
import PresentLeft from '/src/assets/PresentLeft.png'
import ProfileLeft from '/src/assets/ProfileLeft.png'
import ReferalLeft from '/src/assets/ReferalLeft.png'
import Santa from '/src/assets/Santa.png'
import SnowLeft from '/src/assets/SnowLeft.png'
import Telegram from '/src/assets/Telegram.png'
</script>

<template>
    <div class='bg-[#202020] w-[350px] h-[800px] fixed mt-[90px] rounded-[10px] border border-[#819723] '>
        <div class='w-[230px] h-[215px] bg-[#D2EE5B] absolute opacity-[1%] rounded-full ml-[110px] mt-[300px]'></div>
                <div class='w-[103px] h-[90px] bg-[#D2EE5B] absolute opacity-[1%] rounded-full ml-[10px] mt-[10px]'></div>
            <img 
                :src="Santa" 
                alt="Santa"
                class='absolute ml-[-28px] w-[70px] h-[70px] mt-[-115px] '
            >
        <div class='flex flex-col p-5 '>
            
            <RouterLink to='/Profile'>
                            <div class='flex items-center p-3 hover:bg-[#2d2d2d] rounded-lg transition-all duration-300 cursor-pointer group hover:scale-[1.02]'>
                <img 
                    :src="ProfileLeft" 
                    alt="ProfileLeft" 
                    class='w-[20px] h-[20px] mr-4'
                >
                <span class='text-white font-medium group-hover:text-[#819723] transition-colors duration-300'>Профиль</span>
            </div>
            </RouterLink>
            
            
            <div class='flex items-center p-3 mt-2 hover:bg-[#2d2d2d] rounded-lg transition-all duration-300 cursor-pointer group hover:scale-[1.02]'>
                <img 
                    :src="LupaLeft" 
                    alt="LupaLeft" 
                    class='w-[20px] h-[20px] mr-4'
                >
                <span class='text-white font-medium group-hover:text-[#819723] transition-colors duration-300'>Новости</span>
            </div>
            
           
            <div class='flex items-center p-3 mt-2 hover:bg-[#2d2d2d] rounded-lg transition-all duration-300 cursor-pointer group hover:scale-[1.02]'>
                <img 
                    :src="SnowLeft" 
                    alt="SnowLeft" 
                    class='w-[20px] h-[20px] mr-4'
                >
                <span class='text-white font-medium group-hover:text-[#819723] transition-colors duration-300'>Зимний эвент</span>
            </div>
            
            
            <div class='flex items-center p-3 mt-2 hover:bg-[#2d2d2d] rounded-lg transition-all duration-300 cursor-pointer group hover:scale-[1.02]'>
                <img 
                    :src="ReferalLeft" 
                    alt="ReferalLeft" 
                    class='w-[20px] h-[20px] mr-4'
                >
                <span class='text-white font-medium group-hover:text-[#819723] transition-colors duration-300'>Реферальная программа</span>
            </div>
            
            
            <div class='flex items-center p-3 mt-2 hover:bg-[#2d2d2d] rounded-lg transition-all duration-300 cursor-pointer group hover:scale-[1.02]'>
                <img 
                    :src="PresentLeft" 
                    alt="PresentLeft" 
                    class='w-[20px] h-[20px] mr-4'
                >
                <span class='text-white font-medium group-hover:text-[#819723] transition-colors duration-300'>Подписка Enigma Premium</span>
            </div>
            
           
            <div class='flex items-center p-3 mt-2 hover:bg-[#2d2d2d] rounded-lg transition-all duration-300 cursor-pointer group hover:scale-[1.02]'>
                <img 
                    :src="LogOutLeft" 
                    alt="LogOutLeft" 
                    class='w-[20px] h-[20px] mr-4'
                >
                <span class='text-white font-medium group-hover:text-[#819723] transition-colors duration-300'>Выйти</span>
            </div>
        </div>
            <div class='relative w-[256px] h-[222px] ml-[47px] mt-[160px] overflow-hidden'> 
            </div>
            <a href="https://t.me/dllcommunity">
                <div>
                    <img 
                    :src="Telegram" 
                    alt="Telegram" 
                    class='absolute w-[40px] h-[40px] ml-[300px]'
                    >
                </div>
            </a>
    </div>
</template>
