<script setup>
import { ref, computed } from 'vue'
import './css/Calendar.css'
import {API_URL} from "@/constants.js"

const emit = defineEmits(['close'])

const step = ref('date') // 'date' -> 'time' -> 'form'
const selectedDate = ref('')
const selectedTime = ref('')

const isLoadingSlots = ref(false)
const isSubmitting = ref(false)
const busyIntervals = ref([])

const today = new Date()
today.setHours(0, 0, 0, 0)
const currentMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const baseTimeSlots = ['14:00', '16:00', '18:00', '20:00']

const form = ref({
  service: '',
  name: '',
  phone: '',
  comment: ''
})

const services = [
  'Natural lips enhancement',
  'Powder brows enhancement',
  'Eyelash extensions',
  'Free consultation'
]

const monthYearTitle = computed(() => {
  return currentMonth.value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
})

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const firstDayOfMonth = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  let startOffset = firstDayOfMonth.getDay() - 1
  if (startOffset < 0) startOffset = 6

  const cells = []
  for (let i = 0; i < startOffset; i++) {
    cells.push({ day: null, dateStr: null, isPast: true })
  }

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

// Проверка, пересекается ли слот (длительностью 2 часа) с событиями в Google Календаре
const computedSlots = computed(() => {
  if (!selectedDate.value) return []

  return baseTimeSlots.map(time => {
    const slotStart = new Date(`${selectedDate.value}T${time}:00`).getTime()
    const slotEnd = slotStart + 2 * 60 * 60 * 1000

    const isBusy = busyIntervals.value.some(interval => {
      return slotStart < interval.end && slotEnd > interval.start
    })

    return { time, isBusy }
  })
})

const changeMonth = (delta) => {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() + delta,
    1
  )
}

// Запрос занятости в Google Календаре при выборе дня
const selectDay = async (cell) => {
  if (!cell.day || cell.isPast) return
  selectedDate.value = cell.dateStr
  step.value = 'time'
  isLoadingSlots.value = true
  busyIntervals.value = []

  try {
    const response = await fetch(`${API_URL}?date=${cell.dateStr}`)
    const data = await response.json()
    if (data.busy) {
      busyIntervals.value = data.busy
    }
  } catch (error) {
    console.error('Ошибка загрузки расписания:', error)
  } finally {
    isLoadingSlots.value = false
  }
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

const selectTime = (slot) => {
  if (slot.isBusy) return
  selectedTime.value = slot.time
  step.value = 'form'
}

// Отправка брони в Google Календарь
const submitBooking = async () => {
  if (!form.value.service || !form.value.name || !form.value.phone) {
    alert('Пожалуйста, заполните обязательные поля')
    return
  }

  isSubmitting.value = true

  try {
    // Используем text/plain, чтобы избежать CORS preflight-запросов в Google Apps Script
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        date: selectedDate.value,
        time: selectedTime.value,
        service: form.value.service,
        name: form.value.name,
        phone: form.value.phone,
        comment: form.value.comment
      })
    })

    const result = await response.json()

    if (result.status === 'conflict') {
      alert('К сожалению, это время только что заняли. Выберите другой слот.')
      step.value = 'time'
      await selectDay({ day: 1, dateStr: selectedDate.value, isPast: false })
      return
    }

    if (result.status === 'success') {
      alert('Вы успешно записаны! Событие добавлено в расписание мастера.')
      emit('close')
    } else {
      throw new Error(result.message || 'Ошибка сервера')
    }
  } catch (error) {
    alert('Не удалось завершить запись. Попробуйте позже или напишите мастеру в WhatsApp.')
  } finally {
    isSubmitting.value = false
  }
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
        <p v-if="isLoadingSlots" class="booking-loading">Проверяем свободное время...</p>

        <template v-else>
          <button
            v-for="slot in computedSlots"
            :key="slot.time"
            type="button"
            class="booking-slot-btn"
            :class="{ 'is-busy': slot.isBusy }"
            :disabled="slot.isBusy"
            @click="selectTime(slot)"
          >
            {{ slot.time }} <span v-if="slot.isBusy" class="slot-badge">(Занято)</span>
          </button>
        </template>
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

          <button type="submit" class="booking-submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Бронируем...' : 'Забронировать' }}
          </button>
        </form>

        <p class="booking-footer-note">
          <strong>Do you have still questions? Contact me!</strong> Telephone/whatsapp: 053-947-6182, Daria
        </p>
      </div>
    </div>
  </div>
</template>
