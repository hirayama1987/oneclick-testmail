const MAX_HISTORY = 20;

const $ = (id) => document.getElementById(id);

const els = {
  setupView: $("setup-view"),
  mainView: $("main-view"),
  setupEmail: $("setup-email"),
  setupError: $("setup-error"),
  setupSave: $("setup-save"),
  addressField: $("address-field"),
  copyBtn: $("copy-btn"),
  toast: $("toast"),
  regenerateBtn: $("regenerate-btn"),
  historyList: $("history-list"),
  historyEmpty: $("history-empty"),
  clearHistoryBtn: $("clear-history-btn"),
  baseEmailDisplay: $("base-email-display"),
  editBaseEmailBtn: $("edit-base-email-btn"),
};

let state = {
  baseEmail: null,
};

function localizePage() {
  document.documentElement.lang = chrome.i18n.getUILanguage();
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = chrome.i18n.getMessage(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = chrome.i18n.getMessage(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    el.title = chrome.i18n.getMessage(el.dataset.i18nTitle);
  });
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function buildTag(date = new Date()) {
  return (
    date.getFullYear() +
    pad2(date.getMonth() + 1) +
    pad2(date.getDate()) +
    pad2(date.getHours()) +
    pad2(date.getMinutes()) +
    pad2(date.getSeconds())
  );
}

function splitBaseEmail(baseEmail) {
  const [local, domain] = baseEmail.split("@");
  const root = local.split("+")[0];
  return { root, domain };
}

function buildAlias(baseEmail, tag) {
  const { root, domain } = splitBaseEmail(baseEmail);
  return `${root}+${tag}@${domain}`;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (err2) {
      return false;
    }
  }
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.remove("hidden");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    els.toast.classList.add("hidden");
  }, 1800);
}

async function loadSettings() {
  const sync = await chrome.storage.sync.get(["baseEmail"]);
  state.baseEmail = sync.baseEmail || null;
}

async function saveBaseEmail(email) {
  state.baseEmail = email;
  await chrome.storage.sync.set({ baseEmail: email });
}

async function loadHistory() {
  const local = await chrome.storage.local.get(["history"]);
  return local.history || [];
}

async function addHistoryEntry(entry) {
  const history = await loadHistory();
  history.unshift(entry);
  if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;
  await chrome.storage.local.set({ history });
  return history;
}

async function clearHistory() {
  await chrome.storage.local.set({ history: [] });
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleString(chrome.i18n.getUILanguage(), {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderHistory(history) {
  els.historyList.innerHTML = "";
  if (!history || history.length === 0) {
    els.historyEmpty.classList.remove("hidden");
    return;
  }
  els.historyEmpty.classList.add("hidden");
  for (const entry of history) {
    const li = document.createElement("li");
    li.className = "history-item";
    li.title = chrome.i18n.getMessage("historyItemTitle");

    const main = document.createElement("div");
    main.className = "history-item-main";

    const addrEl = document.createElement("div");
    addrEl.className = "history-item-address";
    addrEl.textContent = entry.address;

    const metaEl = document.createElement("div");
    metaEl.className = "history-item-meta";
    metaEl.textContent = formatTime(entry.ts);

    main.appendChild(addrEl);
    main.appendChild(metaEl);

    const copyBtn = document.createElement("button");
    copyBtn.className = "history-copy-btn";
    copyBtn.textContent = "📋";
    copyBtn.title = chrome.i18n.getMessage("copyButtonTitle");

    const doCopy = async () => {
      const ok = await copyText(entry.address);
      showToast(chrome.i18n.getMessage(ok ? "toastCopied" : "toastCopyFailed"));
    };
    li.addEventListener("click", doCopy);
    copyBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      doCopy();
    });

    li.appendChild(main);
    li.appendChild(copyBtn);
    els.historyList.appendChild(li);
  }
}

function showSetupView(prefill = "") {
  els.mainView.classList.add("hidden");
  els.setupView.classList.remove("hidden");
  els.setupError.classList.add("hidden");
  els.setupEmail.value = prefill;
  els.setupEmail.focus();
}

function showMainView() {
  els.setupView.classList.add("hidden");
  els.mainView.classList.remove("hidden");
}

async function generateAndCopy() {
  const now = new Date();
  const tag = buildTag(now);
  const address = buildAlias(state.baseEmail, tag);
  els.addressField.value = address;

  const ok = await copyText(address);
  showToast(chrome.i18n.getMessage(ok ? "toastCopied" : "toastCopyFailedManual"));

  const history = await addHistoryEntry({
    address,
    ts: now.getTime(),
  });
  renderHistory(history);
}

async function initMainView() {
  showMainView();
  els.baseEmailDisplay.textContent = state.baseEmail;

  const history = await loadHistory();
  renderHistory(history);

  await generateAndCopy();
}

async function init() {
  localizePage();
  await loadSettings();
  if (!state.baseEmail) {
    showSetupView();
  } else {
    await initMainView();
  }
}

els.setupSave.addEventListener("click", async () => {
  const value = els.setupEmail.value.trim().toLowerCase();
  if (!isValidEmail(value)) {
    els.setupError.textContent = chrome.i18n.getMessage("setupErrorInvalidEmail");
    els.setupError.classList.remove("hidden");
    return;
  }
  await saveBaseEmail(value);
  await initMainView();
});

els.setupEmail.addEventListener("keydown", (e) => {
  if (e.key === "Enter") els.setupSave.click();
});

els.copyBtn.addEventListener("click", async () => {
  const ok = await copyText(els.addressField.value);
  showToast(chrome.i18n.getMessage(ok ? "toastCopied" : "toastCopyFailed"));
});

els.regenerateBtn.addEventListener("click", async () => {
  await generateAndCopy();
});

els.clearHistoryBtn.addEventListener("click", async () => {
  await clearHistory();
  renderHistory([]);
});

els.editBaseEmailBtn.addEventListener("click", () => {
  showSetupView(state.baseEmail);
});

init();
