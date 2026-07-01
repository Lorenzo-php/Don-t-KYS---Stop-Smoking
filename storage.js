(function () {
  "use strict";

  var KEY = "dkys.stopSmoking.state.v1";
  var VERSION = 1;
  var MAX_CHAT_MESSAGES = 80;
  var memoryState = null;
  var lastStatus = {
    storageAvailable: true,
    repaired: false,
    corrupted: false
  };

  function storageAvailable() {
    try {
      var testKey = "__dkys_test__";
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  function defaultLanguage() {
    var lang = (window.navigator && window.navigator.language) || "it";
    return lang.toLowerCase().indexOf("en") === 0 ? "en" : "it";
  }

  function getDefaultState() {
    return {
      version: VERSION,
      profile: null,
      settings: {
        theme: "day",
        language: defaultLanguage()
      },
      progress: {
        completedDates: [],
        earnedMilestones: [],
        totalXp: 0,
        lastSeenRankId: 1,
        lastMotivation: "",
        signature: ""
      },
      chat: {
        messages: []
      }
    };
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function cleanText(value, maxLength) {
    return String(value || "")
      .replace(/[\u0000-\u001F\u007F]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, maxLength);
  }

  function toNumber(value, fallback, min, max) {
    var number = Number(value);
    if (!Number.isFinite(number)) {
      return fallback;
    }
    return Math.max(min, Math.min(max, number));
  }

  function parseDate(value) {
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return null;
    }
    return date;
  }

  function toLocalDateKey(date) {
    var d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) {
      d = new Date();
    }
    var year = d.getFullYear();
    var month = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function dateKeyToDate(key) {
    var parts = String(key || "").split("-");
    if (parts.length !== 3) {
      return null;
    }
    var year = Number(parts[0]);
    var month = Number(parts[1]);
    var day = Number(parts[2]);
    var date = new Date(year, month - 1, day, 12, 0, 0, 0);
    if (
      Number.isNaN(date.getTime()) ||
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }
    return date;
  }

  function isValidDateKey(key) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(key || "")) && !!dateKeyToDate(key);
  }

  function elapsedMs(profile) {
    if (!profile || !profile.quitAt) {
      return 0;
    }
    var quitAt = parseDate(profile.quitAt);
    if (!quitAt) {
      return 0;
    }
    return Math.max(0, Date.now() - quitAt.getTime());
  }

  function elapsedDays(profile) {
    return Math.floor(elapsedMs(profile) / window.DKYSRanks.DAY_MS);
  }

  function checksum(text) {
    var hash = 2166136261;
    var source = String(text || "");
    for (var i = 0; i < source.length; i += 1) {
      hash ^= source.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16);
  }

  function progressSignature(state) {
    var progress = state.progress || {};
    var profile = state.profile || {};
    return checksum(
      [
        VERSION,
        profile.quitAt || "",
        (progress.completedDates || []).join(","),
        (progress.earnedMilestones || []).join(","),
        progress.totalXp || 0,
        progress.lastSeenRankId || 1
      ].join("|")
    );
  }

  function normalizeProfile(profile) {
    if (!profile || typeof profile !== "object") {
      return { profile: null, repaired: !!profile };
    }

    var repaired = false;
    var nickname = cleanText(profile.nickname, 32);
    if (nickname.length < 2) {
      nickname = "Free";
      repaired = true;
    }

    var cigarettesPerDay = Math.round(toNumber(profile.cigarettesPerDay, 10, 1, 120));
    if (cigarettesPerDay !== Number(profile.cigarettesPerDay)) {
      repaired = true;
    }

    var quitAt = parseDate(profile.quitAt);
    if (!quitAt) {
      quitAt = new Date();
      repaired = true;
    }
    if (quitAt.getTime() > Date.now() + 60000) {
      quitAt = new Date();
      repaired = true;
    }

    var createdAt = parseDate(profile.createdAt) || new Date();
    var costPerCigarette = toNumber(profile.costPerCigarette, 0.35, 0.01, 25);
    if (costPerCigarette !== Number(profile.costPerCigarette)) {
      repaired = true;
    }

    return {
      repaired: repaired,
      profile: {
        nickname: nickname,
        cigarettesPerDay: cigarettesPerDay,
        quitAt: quitAt.toISOString(),
        reason: cleanText(profile.reason, 180),
        costPerCigarette: Math.round(costPerCigarette * 100) / 100,
        createdAt: createdAt.toISOString()
      }
    };
  }

  function normalizeSettings(settings) {
    var safe = settings && typeof settings === "object" ? settings : {};
    var language = safe.language === "en" ? "en" : "it";
    var theme = safe.theme === "night" ? "night" : "day";
    return {
      settings: { theme: theme, language: language },
      repaired: language !== safe.language || theme !== safe.theme
    };
  }

  function normalizeProgress(progress, profile) {
    var safe = progress && typeof progress === "object" ? progress : {};
    var repaired = !progress || typeof progress !== "object";
    var today = dateKeyToDate(toLocalDateKey(new Date()));
    var quitDate = profile ? dateKeyToDate(toLocalDateKey(profile.quitAt)) : null;
    var seen = Object.create(null);
    var completedDates = [];

    if (Array.isArray(safe.completedDates)) {
      safe.completedDates.forEach(function (key) {
        if (!isValidDateKey(key) || seen[key]) {
          repaired = true;
          return;
        }
        var asDate = dateKeyToDate(key);
        if (today && asDate > today) {
          repaired = true;
          return;
        }
        if (quitDate && asDate < quitDate) {
          repaired = true;
          return;
        }
        seen[key] = true;
        completedDates.push(key);
      });
    }

    completedDates.sort();

    var allowedMilestones = window.DKYSRanks.getMilestonesForDays(profile ? elapsedDays(profile) : 0).map(function (milestone) {
      return milestone.day;
    });
    var earnedMilestones = [];

    if (Array.isArray(safe.earnedMilestones)) {
      safe.earnedMilestones.forEach(function (day) {
        var parsed = Math.floor(Number(day));
        if (allowedMilestones.indexOf(parsed) >= 0 && earnedMilestones.indexOf(parsed) < 0) {
          earnedMilestones.push(parsed);
        } else {
          repaired = true;
        }
      });
    }

    earnedMilestones.sort(function (a, b) {
      return a - b;
    });

    var totalXp = window.DKYSRanks.calculateXp(completedDates.length, earnedMilestones);
    if (Number(safe.totalXp) !== totalXp) {
      repaired = true;
    }

    var currentRank = window.DKYSRanks.getRank(profile ? elapsedDays(profile) : 0);
    var lastSeenRankId = Math.round(toNumber(safe.lastSeenRankId, currentRank.id, 1, window.DKYSRanks.all.length));
    if (lastSeenRankId > currentRank.id) {
      lastSeenRankId = currentRank.id;
      repaired = true;
    }

    var normalized = {
      completedDates: completedDates,
      earnedMilestones: earnedMilestones,
      totalXp: totalXp,
      lastSeenRankId: lastSeenRankId,
      lastMotivation: cleanText(safe.lastMotivation, 220),
      signature: ""
    };

    var stateForSignature = {
      profile: profile,
      progress: normalized
    };
    normalized.signature = progressSignature(stateForSignature);

    if (safe.signature && safe.signature !== normalized.signature) {
      repaired = true;
    }

    return { progress: normalized, repaired: repaired };
  }

  function normalizeChat(chat) {
    var safe = chat && typeof chat === "object" ? chat : {};
    var repaired = !chat || typeof chat !== "object";
    var messages = [];

    if (Array.isArray(safe.messages)) {
      safe.messages.slice(-MAX_CHAT_MESSAGES).forEach(function (message) {
        if (!message || typeof message !== "object") {
          repaired = true;
          return;
        }
        var role = message.role === "user" ? "user" : "bot";
        var text = cleanText(message.text, 700);
        if (!text) {
          repaired = true;
          return;
        }
        var createdAt = parseDate(message.createdAt) || new Date();
        messages.push({ role: role, text: text, createdAt: createdAt.toISOString() });
      });
    }

    return {
      chat: { messages: messages },
      repaired: repaired
    };
  }

  function normalizeState(rawState) {
    var base = getDefaultState();
    var source = rawState && typeof rawState === "object" ? rawState : base;
    var repaired = !rawState || typeof rawState !== "object";

    var normalizedSettings = normalizeSettings(source.settings);
    var normalizedProfile = normalizeProfile(source.profile);
    var normalizedProgress = normalizeProgress(source.progress, normalizedProfile.profile);
    var normalizedChat = normalizeChat(source.chat);

    var state = {
      version: VERSION,
      profile: normalizedProfile.profile,
      settings: normalizedSettings.settings,
      progress: normalizedProgress.progress,
      chat: normalizedChat.chat
    };

    return {
      state: state,
      repaired:
        repaired ||
        source.version !== VERSION ||
        normalizedSettings.repaired ||
        normalizedProfile.repaired ||
        normalizedProgress.repaired ||
        normalizedChat.repaired
    };
  }

  function persist(state) {
    var normalized = normalizeState(state).state;
    normalized.progress.signature = progressSignature(normalized);

    if (!storageAvailable()) {
      memoryState = clone(normalized);
      lastStatus.storageAvailable = false;
      return clone(normalized);
    }

    window.localStorage.setItem(KEY, JSON.stringify(normalized));
    memoryState = clone(normalized);
    lastStatus.storageAvailable = true;
    return clone(normalized);
  }

  function load() {
    lastStatus = {
      storageAvailable: storageAvailable(),
      repaired: false,
      corrupted: false
    };

    if (!lastStatus.storageAvailable) {
      if (!memoryState) {
        memoryState = getDefaultState();
      }
      return clone(memoryState);
    }

    var parsed = null;
    var raw = window.localStorage.getItem(KEY);
    if (!raw) {
      parsed = getDefaultState();
    } else {
      try {
        parsed = JSON.parse(raw);
      } catch (error) {
        parsed = getDefaultState();
        lastStatus.corrupted = true;
      }
    }

    var normalized = normalizeState(parsed);
    lastStatus.repaired = normalized.repaired || lastStatus.corrupted;
    if (lastStatus.repaired) {
      persist(normalized.state);
    } else {
      memoryState = clone(normalized.state);
    }

    return clone(normalized.state);
  }

  function validateProfileInput(input) {
    var nickname = cleanText(input.nickname, 32);
    var cigarettes = Math.round(toNumber(input.cigarettesPerDay, NaN, 1, 120));
    var quitAt = parseDate(input.quitAt);
    var cost = toNumber(input.costPerCigarette, 0.35, 0.01, 25);
    var errors = {};

    if (nickname.length < 2 || nickname.length > 32) {
      errors.nickname = true;
    }
    if (!Number.isFinite(cigarettes) || cigarettes < 1 || cigarettes > 120) {
      errors.cigarettes = true;
    }
    if (!quitAt || quitAt.getTime() > Date.now() + 60000) {
      errors.quitAt = true;
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors: errors,
      profile: {
        nickname: nickname,
        cigarettesPerDay: cigarettes,
        quitAt: quitAt ? quitAt.toISOString() : new Date().toISOString(),
        reason: cleanText(input.reason, 180),
        costPerCigarette: Math.round(cost * 100) / 100
      }
    };
  }

  function createProfile(input) {
    var validation = validateProfileInput(input);
    if (!validation.valid) {
      return { ok: false, validation: validation };
    }

    var state = load();
    var rank = window.DKYSRanks.getRank(Math.floor(Math.max(0, Date.now() - new Date(validation.profile.quitAt).getTime()) / window.DKYSRanks.DAY_MS));
    state.profile = {
      nickname: validation.profile.nickname,
      cigarettesPerDay: validation.profile.cigarettesPerDay,
      quitAt: validation.profile.quitAt,
      reason: validation.profile.reason,
      costPerCigarette: validation.profile.costPerCigarette,
      createdAt: new Date().toISOString()
    };
    state.progress = {
      completedDates: [],
      earnedMilestones: [],
      totalXp: 0,
      lastSeenRankId: rank.id,
      lastMotivation: "",
      signature: ""
    };
    state.chat = { messages: [] };
    return { ok: true, state: persist(state) };
  }

  function updateProfile(input) {
    var state = load();
    if (!state.profile) {
      return { ok: false };
    }

    var validation = validateProfileInput({
      nickname: input.nickname,
      cigarettesPerDay: state.profile.cigarettesPerDay,
      quitAt: state.profile.quitAt,
      reason: input.reason,
      costPerCigarette: input.costPerCigarette
    });

    if (!validation.valid) {
      return { ok: false, validation: validation };
    }

    state.profile.nickname = validation.profile.nickname;
    state.profile.reason = validation.profile.reason;
    state.profile.costPerCigarette = validation.profile.costPerCigarette;
    return { ok: true, state: persist(state) };
  }

  function setSettings(partial) {
    var state = load();
    if (partial.theme === "day" || partial.theme === "night") {
      state.settings.theme = partial.theme;
    }
    if (partial.language === "it" || partial.language === "en") {
      state.settings.language = partial.language;
    }
    return persist(state);
  }

  function recordToday(motivationText) {
    var state = load();
    if (!state.profile) {
      return { ok: false, reason: "missing-profile", state: state };
    }

    var todayKey = toLocalDateKey(new Date());
    if (state.progress.completedDates.indexOf(todayKey) >= 0) {
      return { ok: false, reason: "already-done", state: state };
    }

    var quitDate = dateKeyToDate(toLocalDateKey(state.profile.quitAt));
    var todayDate = dateKeyToDate(todayKey);
    if (quitDate && todayDate && todayDate < quitDate) {
      return { ok: false, reason: "before-quit-date", state: state };
    }

    state.progress.completedDates.push(todayKey);

    var days = elapsedDays(state.profile);
    var newMilestones = [];
    window.DKYSRanks.getMilestonesForDays(days).forEach(function (milestone) {
      if (state.progress.earnedMilestones.indexOf(milestone.day) < 0) {
        state.progress.earnedMilestones.push(milestone.day);
        newMilestones.push(milestone);
      }
    });

    state.progress.lastMotivation = cleanText(motivationText, 220);
    state = persist(state);

    var milestoneXp = newMilestones.reduce(function (sum, milestone) {
      return sum + milestone.xp;
    }, 0);

    return {
      ok: true,
      state: state,
      xpAward: 100 + milestoneXp,
      newMilestones: newMilestones
    };
  }

  function appendChat(role, text) {
    var state = load();
    state.chat.messages.push({
      role: role === "user" ? "user" : "bot",
      text: cleanText(text, 700),
      createdAt: new Date().toISOString()
    });
    state.chat.messages = state.chat.messages.slice(-MAX_CHAT_MESSAGES);
    return persist(state);
  }

  function clearChat() {
    var state = load();
    state.chat.messages = [];
    return persist(state);
  }

  function setLastSeenRank(rankId) {
    var state = load();
    state.progress.lastSeenRankId = Math.max(1, Math.min(window.DKYSRanks.all.length, Math.floor(Number(rankId) || 1)));
    return persist(state);
  }

  function reset() {
    if (storageAvailable()) {
      window.localStorage.removeItem(KEY);
    }
    memoryState = getDefaultState();
    return clone(memoryState);
  }

  function getStatus() {
    return {
      storageAvailable: lastStatus.storageAvailable,
      repaired: lastStatus.repaired,
      corrupted: lastStatus.corrupted
    };
  }

  window.DKYSStorage = {
    KEY: KEY,
    load: load,
    save: persist,
    reset: reset,
    getStatus: getStatus,
    createProfile: createProfile,
    updateProfile: updateProfile,
    setSettings: setSettings,
    recordToday: recordToday,
    appendChat: appendChat,
    clearChat: clearChat,
    setLastSeenRank: setLastSeenRank,
    validateProfileInput: validateProfileInput,
    cleanText: cleanText,
    toLocalDateKey: toLocalDateKey,
    dateKeyToDate: dateKeyToDate,
    elapsedMs: elapsedMs,
    elapsedDays: elapsedDays
  };
})();
