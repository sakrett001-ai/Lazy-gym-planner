/* ---------- запуск ---------- */
logLoadLocal();
setupMotionViewer();
setupGallery();
setupWorkout();
setupMotionCameras();
setupFirstRun();
renderSetup();
renderPlan();
prefetchStressIds();
logInit();
/* самый первый запуск — несколько вопросов вместо параметров (11k-first-run.js) */
if (FIRST_RUN) openFirstRun();
