<script setup>
import copyUSDT from '/src/assets/copyUSDT.png'
import usdQR from '/src/assets/usdQR.png'
</script>

<template>
	<!-- <div class="absolute">
		<ProfileHeader />
	</div> -->

	<div
		class="w-[974px] h-[888px] bg-[#262626] border border-[#76BF55] rounded-[30px] ml-[492px] mt-[49px]"
	>
		<p
			class="text-[25px] text-[#FFFFFF] flex items-center justify-center pt-[16px] font-exo"
		>
			Оформить подписку Enigma Premium
		</p>
		<div class="w-[974px] h-[1px] bg-[#FFFFFF] mt-[17px]"></div>
		<div class="w-[377px] h-[36px] bg-[#383838] ml-[312px] mt-[16px]">
			<div class="bg-[#4E4E4E] w-[153px] h-[29px] ml-[7px] mt-[3.5px] absolute">
				<p class="text-[20px] text-[#FFFFFF] font-exo ml-[17px]">USDT/TRC20</p>
			</div>
			<div class="w-[1px] h-[35px] bg-[#FFFFFF] ml-[175px]">
				<div>
					<p
						class="text-[20px] text-[#FFFFFF] font-exo ml-[22px] mt-[1px] absolute"
					>
						Visa/Mastercard
					</p>
				</div>
			</div>
		</div>
		<div
			class="w-[652px] h-[590px] bg-[#383838] ml-[169px] mt-[73px] border border-[#5B5B5B] rounded-[20px]"
		>
			<!-- Это QR-Код оплаты по крипте -->
			<div>
				<img 
				:src="usdQR" 
				alt="usdtQR"
				class="w-[300px] h-[300px] bg-[#5B5B5B] ml-[175px] mt-[52px] rounded-[20px]">
			</div>
			<!-- Это QR-Код оплаты по крипте -->
			<button
				class="bg-[#4C4C4C] w-[164px] h-[43px] font-exo text-[#FFFFFF] rounded-[10px] mt-[73px] ml-[244px]"
			>
				Скопировать
			</button>
			<img 
			:src="copyUSDT" 
			alt="copyUSDT"
			class='absolute mt-[38px] ml-[50px] cursor-pointer'>
			<div class='bg-[#5B5B5B] w-[497px] h-[62px] mt-[16px] ml-[77px] rounded-[10px] border border-[#A4A4A4]'>
				<p class='text-[#CACACA] font-exo text-[17px] flex items-center justify-center mt-[17px]'>UQBO-HWNAsXgAtYl87JOtPQW5mp-aaObd9yxkmOHm7o41n17</p>
			</div>
		</div>
	</div>
</template>
