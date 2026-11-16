<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import './css/WhyChooseMe.css'

  const emit = defineEmits(['open-booking'])
  const isMenuOpen = ref(false)
  const isVisible = ref(false)
  const sectionRef = ref(null)
  let observer = null
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
  //обрати внимание, здесь без хэштега, и в остальных, скорее всего, сделаем так же
    { label: 'How to find us', href: 'how-to-find-us' },
    { label: 'Contacts', href: '#contacts' }
  ]

  const handleBooking = () => {
    emit('open-booking')
  }


  const closeMenu = () => {
    isMenuOpen.value = false
  }

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          isVisible.value = true
        }
      },
      {
      threshold: 0.15 // Анимация запустится, когда появится 15% нового экрана
    }
  )

    if (sectionRef.value) {
      observer.observe(sectionRef.value)
    }
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

</script>

<template>
  <section
  id="why-choose-me"
  ref="sectionRef"
  class="why-section"
  :class="{ 'is-visible': isVisible }"
  >
  <div class="why-section__container">
    <header class="why-header reveal-item reveal-delay-1">
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

  <div class="why-gallery reveal-item reveal-delay-2">
    <img src="@/assets/result-1.jpg" alt="Lips enhancement result" class="why-gallery__img" />
    <img src="@/assets/result-2.jpg" alt="Brows enhancement result" class="why-gallery__img" />
    <img src="@/assets/result-3.jpg" alt="Daria at work" class="why-gallery__img" />
  </div>

  <div class="why-content reveal-item reveal-delay-3">
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

  <button type="button" class="why-cta reveal-item reveal-delay-4" @click="handleBooking">
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
    <router-link
    v-for="(link, index) in sidebarLinks"
    :key="index"
    :to="link.href"
    class="why-sidebar__link"
    @click="closeMenu"
    >
    {{ link.label }}
  </router-link>
</nav>
</aside>
</section>
</template>
