(() => {
  'use strict';

  const STORAGE_PREFIX = 'smrttech-3cc3-lab01-v2:';
  const stageTabs = [...document.querySelectorAll('[data-stage-tab]')];
  const stagePanels = [...document.querySelectorAll('[data-stage-panel]')];
  const totalStages = stagePanels.length;
  let currentStage = Number(localStorage.getItem(`${STORAGE_PREFIX}current-stage`) || 0);
  let lastFocusedElement = null;

  const key = name => `${STORAGE_PREFIX}${name}`;

  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => { toast.hidden = true; }, 4800);
  }

  function setStage(index, moveFocus = true) {
    if (!Number.isInteger(index) || index < 0 || index >= totalStages) return;
    currentStage = index;
    localStorage.setItem(key('current-stage'), String(index));

    stagePanels.forEach((panel, panelIndex) => {
      panel.hidden = panelIndex !== index;
    });
    stageTabs.forEach((tab, tabIndex) => {
      tab.setAttribute('aria-selected', tabIndex === index ? 'true' : 'false');
      tab.tabIndex = tabIndex === index ? 0 : -1;
    });

    if (moveFocus) {
      const heading = stagePanels[index].querySelector('h2');
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function updateProgress() {
    let completed = 0;
    stageTabs.forEach((tab, index) => {
      const isComplete = localStorage.getItem(key(`stage-${index}-complete`)) === 'true';
      tab.classList.toggle('is-complete', isComplete);
      if (isComplete) completed += 1;
    });
    const target = document.getElementById('stageProgress');
    if (target) target.textContent = `${completed}/${totalStages} stages marked complete`;
  }

  function markStageComplete(index) {
    localStorage.setItem(key(`stage-${index}-complete`), 'true');
    updateProgress();
    showToast(`Stage ${index + 1} marked complete. You can revisit it at any time.`);
  }

  function restorePersistentFields() {
    document.querySelectorAll('[data-persist]').forEach(field => {
      const storageName = field.dataset.persist;
      const saved = localStorage.getItem(key(storageName));

      if (field.type === 'checkbox') {
        field.checked = saved === 'true';
      } else if (field.type === 'radio') {
        field.checked = saved === field.value;
      } else if (saved !== null) {
        field.value = saved;
      }

      const eventName = (field.tagName === 'SELECT' || field.type === 'checkbox' || field.type === 'radio') ? 'change' : 'input';
      field.addEventListener(eventName, () => {
        if (field.type === 'checkbox') {
          localStorage.setItem(key(storageName), field.checked ? 'true' : 'false');
        } else if (field.type === 'radio') {
          if (field.checked) localStorage.setItem(key(storageName), field.value);
        } else {
          localStorage.setItem(key(storageName), field.value);
        }
        updateCalculations();
      });
    });
  }

  function gradeQuestion(fieldset) {
    const questionId = fieldset.dataset.question;
    const correct = fieldset.dataset.correct;
    const selected = fieldset.querySelector('input:checked');
    const feedback = fieldset.querySelector('[data-quiz-feedback]');

    if (!selected) {
      feedback.hidden = false;
      feedback.className = 'quiz-feedback incorrect';
      feedback.textContent = 'Choose an answer first. You can retry without penalty.';
      return;
    }

    localStorage.setItem(key(`quiz-${questionId}-selected`), selected.value);
    if (selected.value === correct) {
      fieldset.classList.remove('is-incorrect');
      fieldset.classList.add('is-correct');
      feedback.hidden = false;
      feedback.className = 'quiz-feedback correct';
      feedback.textContent = fieldset.dataset.explanation || 'Correct. Use this reasoning in the next activity.';
      localStorage.setItem(key(`quiz-${questionId}-correct`), 'true');
    } else {
      fieldset.classList.remove('is-correct');
      fieldset.classList.add('is-incorrect');
      feedback.hidden = false;
      feedback.className = 'quiz-feedback incorrect';
      feedback.textContent = `Not yet. ${fieldset.dataset.hint || 'Review the linked concept and try again.'}`;
      localStorage.setItem(key(`quiz-${questionId}-correct`), 'false');
    }
    updateKnowledgeChecks();
  }

  function restoreQuizState() {
    document.querySelectorAll('[data-question]').forEach(fieldset => {
      const id = fieldset.dataset.question;
      const saved = localStorage.getItem(key(`quiz-${id}-selected`));
      if (saved !== null) {
        const input = fieldset.querySelector(`input[value="${CSS.escape(saved)}"]`);
        if (input) input.checked = true;
      }
      if (localStorage.getItem(key(`quiz-${id}-correct`)) === 'true') {
        fieldset.classList.add('is-correct');
        const feedback = fieldset.querySelector('[data-quiz-feedback]');
        feedback.hidden = false;
        feedback.className = 'quiz-feedback correct';
        feedback.textContent = fieldset.dataset.explanation || 'Correct.';
      }
    });
  }

  function updateKnowledgeChecks() {
    const questions = [...document.querySelectorAll('[data-question]')];
    const correct = questions.filter(q => localStorage.getItem(key(`quiz-${q.dataset.question}-correct`)) === 'true').length;
    const target = document.getElementById('knowledgeCheckProgress');
    if (target) target.textContent = `${correct}/${questions.length} formative checks completed`;
  }

  function numberValue(id) {
    const element = document.getElementById(id);
    if (!element || element.value.trim() === '') return NaN;
    return Number(element.value);
  }

  function updateDividerCalculator() {
    const vin = numberValue('calcVin');
    const r1 = numberValue('calcR1');
    const r2 = numberValue('calcR2');
    const output = document.getElementById('calcVout');
    if (!output) return;
    if ([vin, r1, r2].every(Number.isFinite) && vin >= 0 && r1 >= 0 && r2 >= 0 && (r1 + r2) > 0) {
      output.textContent = `${(vin * r2 / (r1 + r2)).toFixed(3)} V`;
    } else {
      output.textContent = 'Enter valid values';
    }
  }

  function updatePhysicalCalculations() {
    const fixedResistanceK = 4.7;
    const vin = 5;
    ['dark', 'normal', 'flashlight'].forEach(condition => {
      const total = numberValue(`total-${condition}`);
      const calcTarget = document.getElementById(`calculated-${condition}`);
      const differenceTarget = document.getElementById(`difference-${condition}`);
      const measured = numberValue(`measured-${condition}`);

      if (calcTarget) {
        if (Number.isFinite(total) && total >= fixedResistanceK) {
          const calculated = vin * fixedResistanceK / total;
          calcTarget.value = calculated.toFixed(3);
          localStorage.setItem(key(`calculated-${condition}`), calcTarget.value);
          if (differenceTarget && Number.isFinite(measured) && calculated !== 0) {
            differenceTarget.textContent = `${(Math.abs(measured - calculated) / Math.abs(calculated) * 100).toFixed(1)}%`;
          } else if (differenceTarget) {
            differenceTarget.textContent = '—';
          }
        } else {
          calcTarget.value = '';
          if (differenceTarget) differenceTarget.textContent = '—';
        }
      }
    });
  }

  function updateSensorSimulator() {
    const slider = document.getElementById('sensorReading');
    const threshold = document.getElementById('thresholdReading');
    const readingText = document.getElementById('sensorReadingValue');
    const thresholdText = document.getElementById('thresholdReadingValue');
    const ledState = document.getElementById('simulatedLedState');
    if (!slider || !threshold || !ledState) return;

    const reading = Number(slider.value);
    const limit = Number(threshold.value);
    if (readingText) readingText.textContent = String(reading);
    if (thresholdText) thresholdText.textContent = String(limit);
    const isOn = reading < limit;
    ledState.textContent = isOn ? 'ON (HIGH)' : 'OFF (LOW)';
    ledState.className = isOn ? 'chip simulator-on' : 'chip';
    localStorage.setItem(key('sensor-reading'), String(reading));
    localStorage.setItem(key('threshold-reading'), String(limit));
  }

  function updateCalculations() {
    updateDividerCalculator();
    updatePhysicalCalculations();
    updateSensorSimulator();
  }

  function setTextSize(mode) {
    document.body.classList.remove('large-text', 'extra-large-text');
    if (mode === 'large') document.body.classList.add('large-text');
    if (mode === 'extra') document.body.classList.add('extra-large-text');
    localStorage.setItem(key('text-size'), mode);
  }

  function openDrawer() {
    const drawer = document.getElementById('knowledgeDrawer');
    const backdrop = document.getElementById('drawerBackdrop');
    if (!drawer || !backdrop) return;
    lastFocusedElement = document.activeElement;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.hidden = false;
    const close = drawer.querySelector('[data-close-drawer]');
    if (close) close.focus();
  }

  function closeDrawer() {
    const drawer = document.getElementById('knowledgeDrawer');
    const backdrop = document.getElementById('drawerBackdrop');
    if (!drawer || !backdrop) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.hidden = true;
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function resetLab() {
    const accepted = window.confirm('Clear all saved answers, measurements, and progress for this lab on this browser?');
    if (!accepted) return;
    Object.keys(localStorage).filter(item => item.startsWith(STORAGE_PREFIX)).forEach(item => localStorage.removeItem(item));
    window.location.reload();
  }

  function configureEvents() {
    stageTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => setStage(index));
      tab.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % totalStages;
        if (event.key === 'ArrowLeft') next = (index - 1 + totalStages) % totalStages;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = totalStages - 1;
        setStage(next);
        stageTabs[next].focus();
      });
    });

    document.querySelectorAll('[data-next-stage]').forEach(button => {
      button.addEventListener('click', () => setStage(Math.min(currentStage + 1, totalStages - 1)));
    });
    document.querySelectorAll('[data-previous-stage]').forEach(button => {
      button.addEventListener('click', () => setStage(Math.max(currentStage - 1, 0)));
    });
    document.querySelectorAll('[data-complete-stage]').forEach(button => {
      button.addEventListener('click', () => markStageComplete(Number(button.dataset.completeStage)));
    });
    document.querySelectorAll('[data-check-question]').forEach(button => {
      button.addEventListener('click', () => gradeQuestion(button.closest('[data-question]')));
    });
    document.querySelectorAll('[data-placeholder-link]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        showToast(`${link.dataset.placeholderLink} has not been configured yet. Replace this placeholder with the school link.`);
      });
    });
    document.querySelectorAll('[data-open-drawer]').forEach(button => button.addEventListener('click', openDrawer));
    document.querySelectorAll('[data-close-drawer]').forEach(button => button.addEventListener('click', closeDrawer));
    const backdrop = document.getElementById('drawerBackdrop');
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    document.querySelectorAll('[data-text-size]').forEach(button => {
      button.addEventListener('click', () => setTextSize(button.dataset.textSize));
    });
    document.querySelectorAll('[data-print]').forEach(button => button.addEventListener('click', () => window.print()));
    document.querySelectorAll('[data-reset-lab]').forEach(button => button.addEventListener('click', resetLab));

    ['calcVin', 'calcR1', 'calcR2', 'total-dark', 'total-normal', 'total-flashlight', 'measured-dark', 'measured-normal', 'measured-flashlight', 'sensorReading', 'thresholdReading']
      .forEach(id => {
        const element = document.getElementById(id);
        if (element) element.addEventListener('input', updateCalculations);
      });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeDrawer();
    });
  }

  function initialize() {
    const textMode = localStorage.getItem(key('text-size')) || 'default';
    setTextSize(textMode);
    restorePersistentFields();
    restoreQuizState();
    updateCalculations();
    updateProgress();
    updateKnowledgeChecks();
    configureEvents();
    if (!Number.isInteger(currentStage) || currentStage < 0 || currentStage >= totalStages) currentStage = 0;
    setStage(currentStage, false);
  }

  document.addEventListener('DOMContentLoaded', initialize);
})();
