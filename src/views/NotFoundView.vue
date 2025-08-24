<template>
  <div class="not-found-container">
    <div class="error-content card-glass fade-in-up">
      <div class="error-icon">
        <div class="error-number">404</div>
        <div class="error-subtitle">
          <span class="subtitle-text">Page introuvable</span>
        </div>
      </div>

      <h1 class="error-title">Page non trouvée</h1>
      <p class="error-message">
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>

      <div class="error-actions">
        <button @click="goHome" class="btn-glass-primary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Retour à l'accueil
        </button>
        <button @click="goBack" class="btn-glass-secondary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Page précédente
        </button>
      </div>

      <div class="error-details" v-if="currentPath">
        <small class="link-neon">Chemin demandé : {{ currentPath }}</small>
      </div>
    </div>

    <!-- Éléments décoratifs -->
    <div class="floating-elements">
      <div class="floating-dot dot-1"></div>
      <div class="floating-dot dot-2"></div>
      <div class="floating-dot dot-3"></div>
      <div class="floating-dot dot-4"></div>
    </div>
  </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

export default {
  name: 'NotFoundView',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const currentPath = ref('')

    onMounted(() => {
      currentPath.value = route.fullPath
    })

    const goHome = () => {
      router.push('/')
    }

    const goBack = () => {
      if (window.history.length > 1) {
        router.go(-1)
      } else {
        router.push('/')
      }
    }

    return {
      currentPath,
      goHome,
      goBack,
    }
  },
}
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.not-found-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 30% 20%, rgba(34, 211, 238, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.error-content {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.error-icon {
  margin-bottom: 2rem;
  position: relative;
}

.error-number {
  font-size: 6rem;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  opacity: 0.9;
}

.error-subtitle {
  position: relative;
  display: inline-block;
  margin-bottom: 1rem;
}

.subtitle-text {
  font-size: 1rem;
  font-weight: 500;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.8;
}

.glitch-effect {
  position: relative;
  display: inline-block;
}

.glitch-text {
  font-size: 1.2rem;
  font-weight: 500;
  color: #f87171;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  position: relative;
  display: inline-block;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.glitch-text:hover {
  color: #fca5a5;
  opacity: 1;
}

.error-title {
  font-size: 2rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.error-message {
  font-size: 1rem;
  color: #94a3b8;
  margin-bottom: 2rem;
  line-height: 1.6;
  opacity: 0.8;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.btn-glass-primary,
.btn-glass-secondary {
  padding: 1rem 1.5rem;
  border-radius: 9999px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  text-decoration: none;
  outline: none;
}

.btn-glass-primary:hover,
.btn-glass-secondary:hover {
  transform: scale(1.05);
}

.btn-glass-primary:focus,
.btn-glass-secondary:focus {
  outline: 2px solid;
  outline-offset: 2px;
}

.btn-glass-primary {
  background: linear-gradient(to right, rgba(34, 211, 238, 0.2), rgba(168, 85, 247, 0.2));
  border-color: rgba(34, 211, 238, 0.3);
  color: white;
}

.btn-glass-primary:hover {
  background: linear-gradient(to right, rgba(34, 211, 238, 0.3), rgba(168, 85, 247, 0.3));
  border-color: rgba(34, 211, 238, 0.5);
  box-shadow: 0 10px 25px rgba(34, 211, 238, 0.25);
}

.btn-glass-primary:focus {
  outline-color: rgba(34, 211, 238, 0.5);
}

.btn-glass-secondary {
  background: rgba(31, 41, 55, 0.5);
  border-color: rgba(75, 85, 99, 0.5);
  color: #e5e7eb;
}

.btn-glass-secondary:hover {
  background: rgba(55, 65, 81, 0.5);
  border-color: rgba(107, 114, 128, 0.7);
}

.btn-glass-secondary:focus {
  outline-color: rgba(107, 114, 128, 0.5);
}

.error-details {
  padding: 1rem;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 116, 139, 0.2);
  border-radius: 0.75rem;
  border-left: 4px solid #22d3ee;
}

/* Éléments flottants décoratifs */
.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-dot {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #22d3ee;
  border-radius: 50%;
  opacity: 0.6;
  animation: float 6s ease-in-out infinite;
}

.dot-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
  box-shadow: 0 0 10px #22d3ee;
}

.dot-2 {
  top: 70%;
  right: 20%;
  background: #a855f7;
  box-shadow: 0 0 10px #a855f7;
  animation-delay: 2s;
}

.dot-3 {
  bottom: 30%;
  left: 20%;
  background: #f472b6;
  box-shadow: 0 0 10px #f472b6;
  animation-delay: 4s;
}

.dot-4 {
  top: 40%;
  right: 10%;
  animation-delay: 1s;
  box-shadow: 0 0 10px #22d3ee;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20px) scale(1.2);
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .error-content {
    padding: 2rem 1rem;
  }

  .error-number {
    font-size: 6rem;
  }

  .error-title {
    font-size: 2rem;
  }

  .error-actions {
    flex-direction: column;
  }

  .btn-glass-primary,
  .btn-glass-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>
