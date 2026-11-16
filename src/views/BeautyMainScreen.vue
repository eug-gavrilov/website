<script setup>
  import { ref } from 'vue'
  import "@/views/css/Beauty.css";
  import {phoneNumber} from "@/constants.js"
  import {rawPhone} from "@/constants.js"
  import {whatsappNumber} from "@/constants.js"
  import WhyChooseMeSection from '@/views/WhyChooseMeSection.vue'
  import Calendar from '@/components/Calendar.vue'

  const isBookingOpen = ref(false)
  const handleBooking = () => {
    isBookingOpen.value = true
  }

  const scrollToNext = () => {
    document.getElementById('why-choose-me')?.scrollIntoView({ behavior: 'smooth' })
  }
</script>

<template>
  <section class="hero">
    <div class="hero__container">
      <header class="hero__header">
        <div class="logo">
          <span class="logo__text">levchuk<br />permanent</span>
          <img src="@/assets/logo.svg" alt="Levchuk Permanent" class="logo__icon" />
        </div>
      </header>

      <div class="hero__content">
        <h1 class="hero__title">Welcome!</h1>

        <p class="hero__intro">
          I'm Daria, a <strong>certified international PMU artist</strong> in Israel, Tel Aviv/Ramat Gan.
        </p>

        <p class="hero__subtitle">Natural lips&amp;brows enhancement</p>

        <p class="hero__description">
          Personalized approach,<br />
          safe healing,<br />
          natural-looking result.
        </p>

        <div class="hero__contacts">
         <a
         :href="whatsappNumber"
         target="_blank"
         rel="noopener noreferrer"
         class="contact-link"
         >
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
          <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
        </svg>
        <span>{{ phoneNumber }}</span>
      </a>

      <a :href="`tel:${rawPhone}`" class="contact-link">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        <span>{{ phoneNumber }}</span>
      </a>
    </div>

<!--         <button type="button" class="hero__cta" @click="handleBooking">
          Book online
        </button> -->
      </div>

      <div class="hero__image-wrapper">
        <img src="@/assets/daria.png" alt="Daria - PMU Artist" class="hero__image" />
      </div>
    </div>
  </section>
  <WhyChooseMeSection @open-booking="isBookingOpen = true" />
  <Calendar v-if="isBookingOpen" @close="isBookingOpen = false" />

</template>