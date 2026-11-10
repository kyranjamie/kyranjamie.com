const heading = document.querySelector('.intro-header h1')

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible' || !heading) return

  heading.classList.add('caret-blink-paused')
  requestAnimationFrame(() => heading.classList.remove('caret-blink-paused'))
})
