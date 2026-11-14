<script setup>
import { ref, computed } from 'vue'
import './css/Calendar.css'

const emit = defineEmits(['close'])

const step = ref('date') // 'date' -> 'time' -> 'form'
const selectedDate = ref('')
const selectedTime = ref('')

// Текущий отображаемый месяц в календаре
const today = new Date()
today.setHours(0, 0, 0, 0)
const currentMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const form = ref({
  service: '',
  name: '',
  phone: '',
  comment: ''
})

const timeSlots = ['14:00', '16:00', '18:00', '20:00']

const services = [
  'Natural lips enhancement',
  'Powder brows enhancement',
  'Eyelash extensions',
  'Free consultation'
]

// Заголовок месяца и года (например, "June 2026")
const monthYearTitle = computed(() => {
  return currentMonth.value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
})

// Генерация ячеек сетки календаря (с понедельника по воскресенье)
const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Сдвиг для начала недели с понедельника (0 - Пн, 6 - Вс)
  let startOffset = firstDayOfMonth.getDay() - 1
  if (startOffset < 0) startOffset = 6

  const cells = []

  // Пустые ячейки до 1-го числа
  for (let i = 0; i < startOffset; i++) {
    cells.push({ day: null, dateStr: null, isPast: true })
  }

  // Числа месяца
  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(year, month, day)
    const yyyy = cellDate.getFullYear()
    const mm = String(cellDate.getMonth() + 1).padStart(2, '0')
    const dd = String(day).padStart(2, '0')

    cells.push({
      day,
      dateStr: `${yyyy}-${mm}-${dd}`,
      isPast: cellDate < today
    })
  }

  return cells
})

const changeMonth = (delta) => {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() + delta,
    1
  )
}

const selectDay = (cell) => {
  if (!cell.day || cell.isPast) return
  selectedDate.value = cell.dateStr
  step.value = 'time'
}

const formattedDate = computed(() => {
  if (!selectedDate.value) return ''
  const date = new Date(selectedDate.value + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).replace(/,/g, '')
})

const formattedDateShort = computed(() => {
  if (!selectedDate.value) return ''
  const date = new Date(selectedDate.value + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).replace(/,/g, '')
})

const selectTime = (time) => {
  selectedTime.value = time
  step.value = 'form'
}

const submitBooking = () => {
  if (!form.value.service || !form.value.name || !form.value.phone) {
    alert('Пожалуйста, заполните обязательные поля')
    return
  }

  const message =
    `Здравствуйте, Дарья! Хочу записаться:\n` +
    `Дата: ${formattedDate.value} в ${selectedTime.value}\n` +
    `Услуга: ${form.value.service}\n` +
    `Имя: ${form.value.name}\n` +
    `Телефон: ${form.value.phone}` +
    (form.value.comment ? `\nКомментарий: ${form.value.comment}` : '')

  window.open(`https://wa.me{encodeURIComponent(message)}`, '_blank')
  emit('close')
}
</script>

<template>
  <div class="booking-overlay" @click.self="emit('close')">
    <div class="booking-modal">
      <button type="button" class="booking-close" aria-label="Close" @click="emit('close')">✕</button>

      <header class="booking-header">
        <div class="booking-logo">
          <img src="@/assets/logo.svg" alt="Levchuk Permanent" class="booking-logo__img" />
          <span v-if="step === 'form'" class="booking-logo__text">levchuk<br />permanent</span>
        </div>

        <button
          v-if="step === 'time'"
          type="button"
          class="booking-back"
          @click="step = 'date'"
        >
          ◀ {{ formattedDate }}
        </button>

        <button
          v-if="step === 'form'"
          type="button"
          class="booking-back"
          @click="step = 'time'"
        >
          ◀ Change time
        </button>
      </header>

      <!-- ШАГ 1: Визуальная сетка календаря -->
      <div v-if="step === 'date'" class="booking-step">
        <div class="cal-nav">
          <button type="button" class="cal-nav__btn" @click="changeMonth(-1)">◀</button>
          <h2 class="cal-nav__title">{{ monthYearTitle }}</h2>
          <button type="button" class="cal-nav__btn" @click="changeMonth(1)">▶</button>
        </div>

        <div class="cal-grid">
          <div v-for="wd in weekDays" :key="wd" class="cal-weekday">
            {{ wd }}
          </div>

          <button
            v-for="(cell, index) in calendarDays"
            :key="index"
            type="button"
            class="cal-day"
            :class="{
              'is-empty': !cell.day,
              'is-past': cell.isPast && cell.day,
              'is-selected': cell.dateStr === selectedDate
            }"
            :disabled="!cell.day || cell.isPast"
            @click="selectDay(cell)"
          >
            {{ cell.day }}
          </button>
        </div>
      </div>

      <!-- ШАГ 2: Выбор времени -->
      <div v-else-if="step === 'time'" class="booking-step booking-slots">
        <button
          v-for="slot in timeSlots"
          :key="slot"
          type="button"
          class="booking-slot-btn"
          @click="selectTime(slot)"
        >
          {{ slot }}
        </button>
      </div>

      <!-- ШАГ 3: Выбор сервиса и контакты -->
      <div v-else-if="step === 'form'" class="booking-step">
        <form class="booking-card" @submit.prevent="submitBooking">
          <h2 class="booking-card__heading">
            {{ formattedDateShort }} {{ selectedTime }}
          </h2>

          <div class="booking-row">
            <label class="booking-label">Select a service*:</label>
            <select v-model="form.service" class="booking-field" required>
              <option value="" disabled>Select a service</option>
              <option v-for="srv in services" :key="srv" :value="srv">
                {{ srv }}
              </option>
            </select>
          </div>

          <div class="booking-row">
            <label class="booking-label">Your name*:</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Name"
              class="booking-field"
              required
            />
          </div>

          <div class="booking-row">
            <label class="booking-label">Phone / WhatsApp*:</label>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="+972 ..."
              class="booking-field"
              required
            />
          </div>

          <div class="booking-row booking-row--top">
            <label class="booking-label">Leave a comment for master (up to you):</label>
            <textarea
              v-model="form.comment"
              rows="3"
              class="booking-field booking-textarea"
            ></textarea>
          </div>

          <button type="submit" class="booking-submit">
            Забронировать
          </button>
        </form>

        <p class="booking-footer-note">
          <strong>Do you have still questions? Contact me!</strong> Telephone/whatsapp: 053-947-6182, Daria
        </p>
      </div>
    </div>
  </div>
</template>
