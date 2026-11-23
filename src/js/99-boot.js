/* ---------- запуск ----------
   Ошибка при запуске (испорченные данные, которые не поймала проверка) — безопасный запуск (00a-keep.js: bootFailed):
   перезапуск с обычными настройками, журнал на месте; не помогло — экран спасения. */
try {
  logLoadLocal();
  setupMotionViewer();
  setupGallery();
  setupWorkout();
  setupMotionCameras();
  setupFirstRun();
  renderSetup();
  renderPlan();
} catch (e) { bootFailed(e); }
if (!BOOT.failed) {
  BOOT.phase = 'done';
  /* прошлый запуск не удался и прошёл с обычными настройками — сказать об этом (настройки отложены, их можно скачать) */
  try { const f = sessionStorage.getItem(KEEP_SAFE); if (f) { sessionStorage.removeItem(KEEP_SAFE); Keep.note('safe', JSON.parse(f) || {}); } } catch (e) {}
  Keep.probe(); keepPaint();
  keepPersistRead();
  prefetchStressIds();
  logInit();
  /* самый первый запуск — несколько вопросов вместо параметров (11k-first-run.js) */
  if (FIRST_RUN) openFirstRun();
  /* открыли ссылку на план (11m-plan-link.js): окно с планом — сразу, а в первый запуск — после вопросов */
  planHashOpen();
  /* запуск закончен — заставка загрузки уходит (00a-keep.js) */
  bootSplashOff();
}
