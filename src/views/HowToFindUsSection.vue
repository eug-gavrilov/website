<script setup>
  import './css/HowToFindUs.css'
  const studioAddress = 'Bialik St 51, Ramat Gan, Israel'
  const encodedAddress = encodeURIComponent(studioAddress)

  const googleMapsUrl = 'https:' + '//' + 'www.google.com' + '/maps/search/?api=1&query=' + encodedAddress
  const wazeUrl = 'https:' + '//' + 'waze.com' + '/ul?q=' + encodedAddress + '&navigate=yes'
  const mapEmbedUrl = 'https:' + '//' + 'maps.google.com' + '/maps?q=' + encodedAddress + '&t=&z=16&ie=UTF8&iwloc=&output=embed'

</script>

<template>
  <section id="how-to-find-us" class="location-section">
    <div class="location-container">
      <div class="location-header">
        <h2 class="location-title">HOW TO FIND US</h2>
        <p class="location-subtitle">Cozy and sterile private PMU studio in Ramat Gan</p>
      </div>

      <div class="location-grid">
        <div class="location-info">
          <div class="info-block">
            <h3 class="info-block__label">Address</h3>
            <p class="info-block__value">{{ studioAddress }}</p>
            <p class="info-block__note">Exact apartment/floor details are sent after booking confirmation.</p>
          </div>

          <div class="info-block">
            <h3 class="info-block__label">Working hours</h3>
            <p class="info-block__value">Sun – Fri: 10:00 – 20:00</p>
            <p class="info-block__note">Saturday (Shabbat): Closed</p>
          </div>

          <div class="location-nav-buttons">
<!--             <a :href="googleMapsUrl" target="_blank" rel="noopener noreferrer" class="nav-btn">
              <span>Open in Google Maps</span>
            </a> -->
            <a :href="wazeUrl" target="_blank" rel="noopener noreferrer" class="nav-btn nav-btn--waze">
              <span>Navigate with Waze</span>
            </a>
          </div>
        </div>

        <div class="location-map-wrapper">
          <iframe
          title="Studio Location Map"
          class="location-map"
          :src="mapEmbedUrl"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      <footer class="site-footer">
        <div class="footer-brand">
          <img src="@/assets/logo.svg" alt="Levchuk Permanent" class="footer-logo" />
          <span>levchuk permanent</span>
        </div>
        <p class="footer-copy">© {{ new Date().getFullYear() }} Levchuk Permanent. All rights reserved.</p>
      </footer>
    </div>
  </section>
</template>