<template>
<div class="bg-[#111111]">
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-[590px] h-[530px]  border-[#1F1F1F] border-2 rounded-[15px]">
      <span class="text-white flex justify-center mt-[56px] text-[26px]">Зарегистрироваться в GhostCode</span>
      <div class="flex justify-center mt-[48px]">
        <div class="inline-flex flex-col  border-[#323436] border-2 rounded-[10px]">
                <img 
                src="@/assets/лого ник.png"
                alt=""
                class="h-[31px] w-[31px] absolute ml-[13px] mt-[7px]"
                >
          <input 
            type="text"
            placeholder="Введите свой никнейм"
            class="bg-[#212224] text-[#707070] w-[376px] h-[48.5px] font-[400] pl-[57px] focus:outline-none rounded-tl-lg rounded-tr-lg"
          >
          <div class="w-[376px] border border-[#323436]"></div>
                <img 
                src="@/assets/лого пароль.png"
                alt=""
                class="h-[31px] w-[31px] absolute ml-[13px] mt-[57px]"
                >
                <img 
                src="@/assets/скрыть пароль.png"
                alt=""
                class="h-[23px] w-[23px] absolute ml-[335px] mt-[63px]"
                >
          <input 
            type="password"
            placeholder="Введите свой пароль"
            class="bg-[#212224] text-[#707070] w-[376px] h-[48.5px] font-[400] pl-[57px] mt-[-1px] focus:outline-none rounded-br-lg rounded-bl-lg "
          >
        </div>
      </div>
            <div class="cursor-pointer w-[376px] h-[40px] bg-[#D2EE5B] border-[#819723] border-[1.5px] flex justify-center items-center rounded-[10px] ml-[106px] mt-[44px] absolute">
                <router-link to="/GhostCode" class="">
                    Регистрация
                </router-link>
            </div>
            <div class="text-white flex justify-center items-center mt-[190px]">
                <router-link to="/NoAccount">
                    У вас уже есть аккаунт? <span class="border-b border-[#D2EE5B] pb-1">Войти</span>
                </router-link>
            </div>
    </div>
  </div>
</div>
</template>