<template>
  <button
    v-if="showInstall"
    @click="installPWA"
    aria-label="Installer l'application"
    class="fixed top-4 left-4 z-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-600 shadow-lg transition-transform duration-200 hover:scale-110 focus:scale-110"
    style="min-width: 44px; min-height: 44px"
  >
    <svg
      class="w-7 h-7 md:w-8 md:h-8 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 16v-8m0 8l-4-4m4 4l4-4M4 20h16"
      />
    </svg>
    <span
      class="absolute w-px h-px p-0 m-0 overflow-hidden whitespace-nowrap border-0 clip-rect clip-path-inset"
      >Installer l'application</span
    >
  </button>
</template>

<style scoped>
.shadow-pwa {
  box-shadow:
    0 0 15px rgba(6, 182, 212, 0.18),
    0 1.5px 8px 0 rgba(0, 0, 0, 0.18);
}

@media (max-width: 768px) {
  .shadow-pwa {
    box-shadow:
      0 0 10px rgba(6, 182, 212, 0.13),
      0 1.5px 6px 0 rgba(0, 0, 0, 0.13);
  }
}
</style>

<script setup>
import { ref, onMounted } from 'vue'

const showInstall = ref(false)
let deferredPrompt = null
/* Le bouton utilise uniquement les classes utilitaires Tailwind pour l'harmonisation visuelle. */
onMounted(() => {
  console.log('PwaInstall composant monté')

  // Debug: vérifier si la PWA est déjà installée
  if ('serviceWorker' in navigator) {
    console.log('Service Worker supporté')
  }

  // Vérifier si l'app est déjà installée
  if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
    console.log('App déjà installée en mode standalone')
    return
  }

  // Vérifier si c'est dans un navigateur compatible
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
  const isEdge = /Edg/.test(navigator.userAgent)
  const isOpera = /OPR/.test(navigator.userAgent)

  console.log('Navigateur:', { isChrome, isEdge, isOpera })
  console.log('User Agent:', navigator.userAgent)

  // Vérifier le protocole
  console.log('Protocole:', window.location.protocol)

  // Écouter l'événement beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('🎉 beforeinstallprompt déclenché!')
    e.preventDefault()
    deferredPrompt = e
    showInstall.value = true
  })

  // Debug supplémentaire après un délai
  setTimeout(() => {
    console.log('Statut après 3 secondes:')
    console.log('- showInstall:', showInstall.value)
    console.log('- deferredPrompt:', deferredPrompt)
    console.log('- display-mode:', window.matchMedia('(display-mode: standalone)').matches)
  }, 3000)

  // Pour iOS Safari
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isStandalone = window.navigator.standalone
  if (isIOS && !isStandalone) {
    console.log('iOS détecté, installation manuelle requise')
    // Vous pouvez afficher un message d'instruction pour iOS ici
  }
})

function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then((choiceResult) => {
      console.log('Choix utilisateur:', choiceResult.outcome)
      showInstall.value = false
      deferredPrompt = null
    })
  }
}
</script>
