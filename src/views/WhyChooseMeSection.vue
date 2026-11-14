<script setup>
import { ref } from 'vue'
import './css/WhyChooseMe.css'

const isMenuOpen = ref(false)
const rawPhone = '+972539476182'

const benefits = [
  { text: 'First consultation is free', italic: true },
  { text: '500+ happy clients', italic: false },
  { text: 'Personalized sketch created together', italic: false },
  { text: 'Safe healing', italic: false },
  { text: 'Sterilie and cozy workspace', italic: false }
]

const sidebarLinks = [
  { label: 'Before/after', href: '#before-after' },
  { label: 'Eyelash extensions', href: '#eyelash-extensions' },
  { label: 'About me', href: '#about-me' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'How to find us', href: '#how-to-find-us' },
  { label: 'Contacts', href: '#contacts' }
]

const emit = defineEmits(['open-booking'])
const handleBooking = () => {
  emit('open-booking')
}


const closeMenu = () => {
  isMenuOpen.value = false
}

</script>

<template>
  <section id="why-choose-me" class="why-section">
    <div class="why-section__container">
      <header class="why-header">
        <img src="@/assets/logo.svg" alt="Levchuk Permanent" class="why-header__logo" />

        <nav class="why-nav">
          <a href="#results" class="why-nav__link">Look at results</a>
          <a href="#before-after" class="why-nav__link">Before and after</a>
          <a href="#reviews" class="why-nav__link">Reviews</a>
        </nav>

        <button
          type="button"
          class="burger-btn"
          aria-label="Open menu"
          @click="isMenuOpen = true"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      <div class="why-gallery">
        <img src="@/assets/result-1.jpg" alt="Lips enhancement result" class="why-gallery__img" />
        <img src="@/assets/result-2.jpg" alt="Brows enhancement result" class="why-gallery__img" />
        <img src="@/assets/result-3.jpg" alt="Daria at work" class="why-gallery__img" />
      </div>

      <div class="why-content">
        <h2 class="why-content__title">WHY CHOOSE ME?</h2>

        <ul class="why-list">
          <li v-for="(item, index) in benefits" :key="index" class="why-list__item">
            <svg class="why-list__check" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span :class="{ 'is-italic': item.italic }">{{ item.text }}</span>
          </li>
        </ul>
      </div>

      <button type="button" class="why-cta" @click="handleBooking">
        Book online
      </button>
    </div>

    <div
      v-if="isMenuOpen"
      class="sidebar-backdrop"
      @click="closeMenu"
    ></div>

    <aside class="why-sidebar" :class="{ 'is-open': isMenuOpen }">
      <nav class="why-sidebar__nav">
        <a
          v-for="(link, index) in sidebarLinks"
          :key="index"
          :href="link.href"
          class="why-sidebar__link"
          @click="closeMenu"
        > {{ link.label }} </a> </nav> </aside> </section> </template>
