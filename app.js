(function () {
  "use strict";

  var state = null;
  var currentScreen = "dashboard";
  var activeActivityIndex = 0;
  var toastTimer = null;

  var screenRoot = document.getElementById("screenRoot");
  var bottomNav = document.getElementById("bottomNav");
  var appHeader = document.getElementById("appHeader");
  var brandKicker = document.getElementById("brandKicker");
  var toast = document.getElementById("toast");
  var rankModal = document.getElementById("rankModal");

  var navItems = [
    { id: "dashboard", icon: "home" },
    { id: "benefits", icon: "body" },
    { id: "cravings", icon: "spark" },
    { id: "chat", icon: "chat" },
    { id: "settings", icon: "settings" }
  ];

  function language() {
    return state && state.settings && state.settings.language === "en" ? "en" : "it";
  }

  function dictionary() {
    return window.DKYSi18n[language()] || window.DKYSi18n.it;
  }

  function valueAt(path) {
    return path.split(".").reduce(function (value, key) {
      return value && Object.prototype.hasOwnProperty.call(value, key) ? value[key] : undefined;
    }, dictionary());
  }

  function t(path, params) {
    var value = valueAt(path);
    if (typeof value !== "string") {
      return path;
    }
    return value.replace(/\{(\w+)\}/g, function (_, key) {
      return params && params[key] !== undefined ? String(params[key]) : "";
    });
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function icon(name) {
    var icons = {
      home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-8.5Z"/></svg>',
      body: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21c-5-3.8-8-7.4-8-11a5 5 0 0 1 5-5c1.4 0 2.4.6 3 1.5A3.5 3.5 0 0 1 15 5a5 5 0 0 1 5 5c0 3.6-3 7.2-8 11Z"/><path d="M12 8v9M8.7 12.3c2 .2 3.3 1.7 3.3 3.7M15.3 12.3c-2 .2-3.3 1.7-3.3 3.7"/></svg>',
      spark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.2 6.8H21l-5.5 4 2.1 6.7-5.6-4.1-5.6 4.1 2.1-6.7L3 8.8h6.8L12 2Z"/></svg>',
      chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v10H8l-3 4V5Z"/><path d="M8 9h8M8 12h5"/></svg>',
      settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/><path d="M19 12a7.4 7.4 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a6.2 6.2 0 0 0-1.7-1L14.5 3h-5l-.3 3.1a6.2 6.2 0 0 0-1.7 1l-2.4-1-2 3.4L5.1 11a7.4 7.4 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a6.2 6.2 0 0 0 1.7 1l.3 3.1h5l.3-3.1a6.2 6.2 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z"/></svg>',
      check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 10 17 19 7"/></svg>',
      arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
      send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4l17 8-17 8 3-8-3-8Z"/><path d="M7 12h8"/></svg>',
      trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 11v6M14 11v6M8 7l1-3h6l1 3M7 7l1 14h8l1-14"/></svg>',
      dice: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="9" r="1.3"/><circle cx="15" cy="9" r="1.3"/><circle cx="9" cy="15" r="1.3"/><circle cx="15" cy="15" r="1.3"/></svg>',
      moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 16.5A8 8 0 0 1 10.5 5a7 7 0 1 0 7.5 11.5Z"/></svg>',
      sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M19.8 4.2l-2.1 2.1M6.3 17.7l-2.1 2.1"/></svg>',
      save: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h12l2 2v14H5V4Z"/><path d="M8 4v6h8V4M8 20v-6h8v6"/></svg>'
    };
    return icons[name] || icons.spark;
  }

  function applyEnvironment() {
    var theme = state && state.settings && state.settings.theme === "night" ? "night" : "day";
    document.body.setAttribute("data-theme", theme);
    document.documentElement.lang = language();
    document.title = t("appName");
    brandKicker.textContent = t("brandKicker");
    var themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute("content", theme === "night" ? "#070708" : "#f8f7f2");
    }
  }

  function locale() {
    return language() === "en" ? "en-US" : "it-IT";
  }

  function formatNumber(value, digits) {
    return new Intl.NumberFormat(locale(), {
      maximumFractionDigits: digits == null ? 0 : digits
    }).format(value);
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat(locale(), {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2
    }).format(value);
  }

  function formatDate(value, withTime) {
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return t("common.unavailable");
    }
    return new Intl.DateTimeFormat(locale(), {
      dateStyle: "medium",
      timeStyle: withTime ? "short" : undefined
    }).format(date);
  }

  function toDateTimeLocal(date) {
    var d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) {
      d = new Date();
    }
    var offset = d.getTimezoneOffset();
    var local = new Date(d.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  }

  function durationParts(ms) {
    var safe = Math.max(0, Number(ms) || 0);
    var days = Math.floor(safe / window.DKYSRanks.DAY_MS);
    var hours = Math.floor((safe % window.DKYSRanks.DAY_MS) / 3600000);
    var minutes = Math.floor((safe % 3600000) / 60000);
    return { days: days, hours: hours, minutes: minutes };
  }

  function durationLabel(ms) {
    var parts = durationParts(ms);
    if (parts.days > 0) {
      return parts.days + t("common.daysShort") + " " + parts.hours + t("common.hoursShort") + " " + parts.minutes + t("common.minutesShort");
    }
    return parts.hours + t("common.hoursShort") + " " + parts.minutes + t("common.minutesShort");
  }

  function getStats() {
    var profile = state.profile;
    var elapsed = window.DKYSStorage.elapsedMs(profile);
    var parts = durationParts(elapsed);
    var daysFloat = elapsed / window.DKYSRanks.DAY_MS;
    var avoided = Math.max(0, Math.floor(profile.cigarettesPerDay * daysFloat));
    var saved = avoided * profile.costPerCigarette;
    var rank = window.DKYSRanks.getRank(parts.days);
    var nextRank = window.DKYSRanks.getNextRank(parts.days);
    return {
      elapsed: elapsed,
      parts: parts,
      avoided: avoided,
      saved: saved,
      rank: rank,
      nextRank: nextRank,
      rankProgress: window.DKYSRanks.getRankProgress(elapsed),
      todayDone: state.progress.completedDates.indexOf(window.DKYSStorage.toLocalDateKey(new Date())) >= 0
    };
  }

  function statCard(label, value, detail, tone) {
    return (
      '<article class="stat-card ' + (tone || "") + '">' +
      '<span class="stat-label">' + escapeHtml(label) + "</span>" +
      '<strong class="stat-value">' + escapeHtml(value) + "</strong>" +
      (detail ? '<span class="stat-detail">' + escapeHtml(detail) + "</span>" : "") +
      "</article>"
    );
  }

  function renderNav() {
    bottomNav.innerHTML = navItems
      .map(function (item) {
        var selected = item.id === currentScreen ? " is-active" : "";
        return (
          '<button class="nav-button' +
          selected +
          '" type="button" data-action="navigate" data-screen="' +
          item.id +
          '" aria-label="' +
          escapeHtml(t("nav." + item.id)) +
          '">' +
          icon(item.icon) +
          '<span>' +
          escapeHtml(t("nav." + item.id)) +
          "</span></button>"
        );
      })
      .join("");
  }

  function render() {
    applyEnvironment();

    if (!state.profile) {
      appHeader.hidden = true;
      bottomNav.hidden = true;
      renderOnboarding();
      return;
    }

    appHeader.hidden = false;
    bottomNav.hidden = false;
    renderNav();

    if (currentScreen === "benefits") {
      renderBenefits();
    } else if (currentScreen === "cravings") {
      renderCravings();
    } else if (currentScreen === "chat") {
      renderChat();
    } else if (currentScreen === "settings") {
      renderSettings();
    } else {
      currentScreen = "dashboard";
      renderDashboard();
    }

    maybeCelebrateRank();
  }

  function renderOnboarding() {
    var nowLocal = toDateTimeLocal(new Date());
    var currentLang = language();
    screenRoot.innerHTML =
      '<section class="onboarding-screen">' +
      '<div class="language-pills" role="group" aria-label="' +
      escapeHtml(t("onboarding.languageLabel")) +
      '">' +
      '<button type="button" class="pill-button ' +
      (currentLang === "it" ? "is-selected" : "") +
      '" data-action="set-language" data-language="it">IT</button>' +
      '<button type="button" class="pill-button ' +
      (currentLang === "en" ? "is-selected" : "") +
      '" data-action="set-language" data-language="en">EN</button>' +
      "</div>" +
      '<div class="intro-panel">' +
      '<img class="intro-badge" src="assets/badge-free.svg" alt="">' +
      '<p class="eyebrow">' +
      escapeHtml(t("onboarding.missionTitle")) +
      "</p>" +
      '<h1>' +
      escapeHtml(t("appName")) +
      "</h1>" +
      '<p class="mission-copy">' +
      escapeHtml(t("onboarding.missionText")) +
      "</p>" +
      '<p class="privacy-note">' +
      escapeHtml(t("onboarding.privacy")) +
      "</p>" +
      "</div>" +
      '<form class="profile-form" id="onboardingForm" novalidate>' +
      '<h2>' +
      escapeHtml(t("onboarding.title")) +
      "</h2>" +
      '<label class="field-label" for="nickname">' +
      escapeHtml(t("onboarding.nickname")) +
      "</label>" +
      '<input id="nickname" name="nickname" type="text" maxlength="32" autocomplete="nickname" placeholder="' +
      escapeHtml(t("onboarding.nicknamePlaceholder")) +
      '" required>' +
      '<p class="field-error" data-error-for="nickname"></p>' +
      '<label class="field-label" for="cigarettesPerDay">' +
      escapeHtml(t("onboarding.cigarettes")) +
      "</label>" +
      '<input id="cigarettesPerDay" name="cigarettesPerDay" type="number" min="1" max="120" step="1" inputmode="numeric" value="10" required>' +
      '<p class="field-error" data-error-for="cigarettes"></p>' +
      '<label class="field-label" for="quitAt">' +
      escapeHtml(t("onboarding.quitAt")) +
      "</label>" +
      '<input id="quitAt" name="quitAt" type="datetime-local" max="' +
      nowLocal +
      '" value="' +
      nowLocal +
      '" required>' +
      '<p class="field-error" data-error-for="quitAt"></p>' +
      '<label class="field-label" for="reason">' +
      escapeHtml(t("onboarding.reason")) +
      ' <span>(' +
      escapeHtml(t("common.optional")) +
      ")</span></label>" +
      '<textarea id="reason" name="reason" maxlength="180" rows="3" placeholder="' +
      escapeHtml(t("onboarding.reasonPlaceholder")) +
      '"></textarea>' +
      '<button class="primary-button wide-button" type="submit">' +
      '<span class="button-icon">' +
      icon("arrow") +
      "</span><span>" +
      escapeHtml(t("onboarding.startButton")) +
      "</span></button>" +
      "</form>" +
      "</section>";
  }

  function renderDashboard() {
    var stats = getStats();
    var rank = stats.rank;
    var nextRank = stats.nextRank;
    var progressStyle = 'style="--progress:' + stats.rankProgress + '%; --rank-color:' + rank.color + ';"';
    var reason = state.profile.reason || t("dashboard.noReason");
    var doneClass = stats.todayDone ? " is-done" : "";
    var doneLabel = stats.todayDone ? t("dashboard.dailyDone") : t("dashboard.dailyButton");
    var nextRankName = nextRank ? nextRank.name[language()] : t("dashboard.maxRank");
    var motivation = state.progress.lastMotivation;

    screenRoot.innerHTML =
      '<section class="screen dashboard-screen">' +
      '<div class="screen-heading">' +
      '<p class="eyebrow">' +
      escapeHtml(t("dashboard.smokeFreeFor")) +
      "</p>" +
      '<h2>' +
      escapeHtml(t("dashboard.greeting", { name: state.profile.nickname })) +
      "</h2>" +
      '<p>' +
      escapeHtml(t("dashboard.subtitle")) +
      "</p>" +
      "</div>" +
      '<article class="rank-card" style="--rank-color:' +
      rank.color +
      '">' +
      '<div class="rank-icon">' +
      rank.icon +
      "</div>" +
      '<div class="rank-copy">' +
      '<span>' +
      escapeHtml(t("dashboard.currentRank")) +
      "</span>" +
      '<h3>' +
      escapeHtml(rank.name[language()]) +
      "</h3>" +
      '<p>' +
      escapeHtml(rank.description[language()]) +
      "</p>" +
      "</div>" +
      "</article>" +
      '<div class="xp-panel" ' +
      progressStyle +
      ">" +
      '<div class="xp-row"><span>' +
      escapeHtml(t("dashboard.progressToNext")) +
      '</span><strong>' +
      escapeHtml(nextRankName) +
      "</strong></div>" +
      '<div class="xp-track" aria-label="' +
      escapeHtml(t("dashboard.progressToNext")) +
      '"><span></span></div>' +
      '<div class="xp-row subtle"><span>' +
      escapeHtml(t("dashboard.totalXp")) +
      '</span><strong>' +
      escapeHtml(formatNumber(state.progress.totalXp)) +
      " XP</strong></div>" +
      "</div>" +
      '<div class="stat-grid">' +
      statCard(t("dashboard.daysWithoutSmoking"), formatNumber(stats.parts.days), t("common.daysShort"), "gold") +
      statCard(t("dashboard.lastCigaretteTime"), durationLabel(stats.elapsed), "", "silver") +
      statCard(t("dashboard.cigarettesAvoided"), formatNumber(stats.avoided), t("common.estimated"), "green") +
      statCard(t("dashboard.moneySaved"), formatCurrency(stats.saved), t("common.estimated"), "gold") +
      statCard(t("dashboard.streakCard"), formatNumber(state.progress.completedDates.length), t("common.daysShort"), "silver") +
      statCard(t("dashboard.milestoneBonus"), formatNumber(state.progress.earnedMilestones.length), "", "green") +
      "</div>" +
      '<button class="primary-button daily-button' +
      doneClass +
      '" type="button" data-action="record-day" ' +
      (stats.todayDone ? "disabled" : "") +
      ">" +
      '<span class="button-icon">' +
      icon("check") +
      "</span><span>" +
      escapeHtml(doneLabel) +
      "</span></button>" +
      (motivation ? '<p class="motivation-line">' + escapeHtml(motivation) + "</p>" : "") +
      '<article class="reason-card">' +
      '<span>' +
      escapeHtml(t("dashboard.reasonTitle")) +
      "</span>" +
      '<p>' +
      escapeHtml(reason) +
      "</p>" +
      "</article>" +
      "</section>";
  }

  function benefitIcon(name) {
    var map = {
      pulse: "M4 13h4l2-7 4 14 2-7h4",
      blood: "M12 3c4 5 7 8 7 12a7 7 0 0 1-14 0c0-4 3-7 7-12Z",
      spark: "M12 3l2 6h6l-5 4 2 7-5-4-5 4 2-7-5-4h6l2-6Z",
      taste: "M6 6c4 0 8 3 8 8 0 4-3 7-7 7M18 5c-3 1-5 3-6 6",
      lungs: "M12 5v14M12 11c-4-5-8-5-8 1v6c5 0 8-3 8-7Zm0 0c4-5 8-5 8 1v6c-5 0-8-3-8-7Z",
      walk: "M13 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM10 22l2-7-4-3 3-5 4 2 3 4M15 15l4 7",
      breath: "M4 9c4-4 8-4 12 0 2 2 4 2 6 0M4 15c4-4 8-4 12 0 2 2 4 2 6 0",
      flow: "M5 12h12M13 6l6 6-6 6M5 6h4M5 18h4",
      habit: "M6 12l4 4 8-9M4 4h16v16H4z",
      shield: "M12 3l8 4v5c0 5-3 8-8 10-5-2-8-5-8-10V7l8-4Z",
      star: "M12 3l2 6h6l-5 4 2 7-5-4-5 4 2-7-5-4h6l2-6Z",
      horizon: "M3 17h18M5 17a7 7 0 0 1 14 0M7 12h10"
    };
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + (map[name] || map.spark) + '"/></svg>';
  }

  function renderBenefits() {
    var elapsedMinutes = Math.floor(window.DKYSStorage.elapsedMs(state.profile) / 60000);
    var data = window.DKYSBenefits.getBenefits(elapsedMinutes);
    var achieved = data.achieved.slice(-5).reverse();
    var next = data.next;

    screenRoot.innerHTML =
      '<section class="screen">' +
      '<div class="screen-heading">' +
      '<p class="eyebrow">' +
      escapeHtml(t("benefits.timeline")) +
      "</p>" +
      '<h2>' +
      escapeHtml(t("benefits.title")) +
      "</h2>" +
      '<p>' +
      escapeHtml(t("benefits.subtitle")) +
      "</p>" +
      "</div>" +
      '<div class="benefit-section">' +
      '<h3>' +
      escapeHtml(t("benefits.achieved")) +
      "</h3>" +
      (achieved.length
        ? achieved
            .map(function (benefit) {
              return benefitCard(benefit, true);
            })
            .join("")
        : '<p class="empty-state">' + escapeHtml(t("benefits.empty")) + "</p>") +
      "</div>" +
      (next
        ? '<div class="benefit-section"><h3>' +
          escapeHtml(t("benefits.next")) +
          "</h3>" +
          benefitCard(next, false) +
          "</div>"
        : "") +
      '<p class="science-note">' +
      escapeHtml(t("benefits.note")) +
      "</p>" +
      "</section>";
  }

  function benefitCard(benefit, achieved) {
    return (
      '<article class="benefit-card ' +
      (achieved ? "is-achieved" : "is-next") +
      '">' +
      '<div class="benefit-icon">' +
      benefitIcon(benefit.icon) +
      "</div>" +
      '<div><span>' +
      escapeHtml(timeMilestoneLabel(benefit.minMinutes)) +
      "</span><h4>" +
      escapeHtml(benefit.title[language()]) +
      "</h4><p>" +
      escapeHtml(benefit.text[language()]) +
      "</p></div></article>"
    );
  }

  function timeMilestoneLabel(minutes) {
    if (minutes < 60) {
      return minutes + " " + t("common.minutesShort");
    }
    if (minutes < 24 * 60) {
      return Math.round(minutes / 60) + " " + t("common.hoursShort");
    }
    return Math.round(minutes / (24 * 60)) + " " + t("common.daysShort");
  }

  function activities() {
    var list = valueAt("cravings.activities");
    if (Array.isArray(list)) {
      return list;
    }
    return [
      "Fare una passeggiata di 5 minuti",
      "Bere acqua lentamente",
      "Respirazione profonda"
    ];
  }

  function renderCravings() {
    var list = activities();
    if (activeActivityIndex >= list.length) {
      activeActivityIndex = 0;
    }
    var activity = list[activeActivityIndex] || list[0];

    screenRoot.innerHTML =
      '<section class="screen cravings-screen">' +
      '<div class="screen-heading">' +
      '<p class="eyebrow">' +
      escapeHtml(t("nav.cravings")) +
      "</p>" +
      '<h2>' +
      escapeHtml(t("cravings.title")) +
      "</h2>" +
      '<p>' +
      escapeHtml(t("cravings.subtitle")) +
      "</p>" +
      "</div>" +
      '<article class="activity-feature">' +
      '<span>' +
      escapeHtml(t("cravings.current")) +
      "</span>" +
      '<h3>' +
      escapeHtml(activity) +
      "</h3>" +
      '<div class="activity-actions">' +
      '<button class="secondary-button" type="button" data-action="new-activity">' +
      '<span class="button-icon">' +
      icon("dice") +
      "</span><span>" +
      escapeHtml(t("cravings.button")) +
      "</span></button>" +
      '<button class="icon-button large-icon-button" type="button" data-action="activity-done" aria-label="' +
      escapeHtml(t("cravings.completed")) +
      '">' +
      icon("check") +
      "</button>" +
      "</div></article>" +
      '<div class="quick-list">' +
      '<h3>' +
      escapeHtml(t("cravings.allIdeas")) +
      "</h3>" +
      list
        .map(function (item, index) {
          return (
            '<button class="idea-chip ' +
            (index === activeActivityIndex ? "is-selected" : "") +
            '" type="button" data-action="select-activity" data-index="' +
            index +
            '">' +
            escapeHtml(item) +
            "</button>"
          );
        })
        .join("") +
      "</div>" +
      "</section>";
  }

  function renderChat() {
    var messages = state.chat.messages.slice();
    var renderedMessages = messages.length
      ? messages
      : [{ role: "bot", text: t("chat.firstMessage"), createdAt: new Date().toISOString() }];

    screenRoot.innerHTML =
      '<section class="screen chat-screen">' +
      '<div class="screen-heading compact-heading">' +
      '<p class="eyebrow">' +
      escapeHtml(t("chat.botName")) +
      "</p>" +
      '<h2>' +
      escapeHtml(t("chat.title")) +
      "</h2>" +
      '<p>' +
      escapeHtml(t("chat.subtitle")) +
      "</p>" +
      "</div>" +
      '<div class="chat-log" id="chatLog">' +
      renderedMessages
        .map(function (message) {
          var isUser = message.role === "user";
          return (
            '<article class="chat-message ' +
            (isUser ? "is-user" : "is-bot") +
            '">' +
            '<span>' +
            escapeHtml(isUser ? t("chat.you") : t("chat.botName")) +
            "</span><p>" +
            escapeHtml(message.text) +
            "</p></article>"
          );
        })
        .join("") +
      "</div>" +
      '<form class="chat-form" id="chatForm">' +
      '<input name="message" type="text" maxlength="700" autocomplete="off" enterkeyhint="send" placeholder="' +
      escapeHtml(t("chat.placeholder")) +
      '" aria-label="' +
      escapeHtml(t("chat.placeholder")) +
      '">' +
      '<button class="icon-button send-button" type="submit" aria-label="' +
      escapeHtml(t("chat.send")) +
      '">' +
      icon("send") +
      "</button>" +
      "</form>" +
      '<button class="text-button" type="button" data-action="clear-chat">' +
      icon("trash") +
      "<span>" +
      escapeHtml(t("chat.clear")) +
      "</span></button>" +
      "</section>";

    var chatLog = document.getElementById("chatLog");
    if (chatLog) {
      chatLog.scrollTop = chatLog.scrollHeight;
    }
  }

  function renderSettings() {
    var stats = getStats();
    var storageStatus = window.DKYSStorage.getStatus();
    var earnedLabels = state.progress.earnedMilestones
      .map(function (day) {
        var milestone = window.DKYSRanks.milestones.find(function (item) {
          return item.day === day;
        });
        return milestone ? milestone.label[language()] : day + " " + t("common.daysShort");
      })
      .join(", ");

    screenRoot.innerHTML =
      '<section class="screen settings-screen">' +
      '<div class="screen-heading compact-heading">' +
      '<p class="eyebrow">' +
      escapeHtml(t("nav.settings")) +
      "</p>" +
      '<h2>' +
      escapeHtml(t("settings.title")) +
      "</h2>" +
      "</div>" +
      '<section class="settings-block">' +
      '<h3>' +
      escapeHtml(t("settings.appearance")) +
      "</h3>" +
      '<div class="setting-row"><span>' +
      escapeHtml(t("settings.theme")) +
      '</span><div class="segmented" role="group">' +
      segmentedButton("set-theme", "theme", "day", t("settings.day"), state.settings.theme === "day", "sun") +
      segmentedButton("set-theme", "theme", "night", t("settings.night"), state.settings.theme === "night", "moon") +
      "</div></div>" +
      '<div class="setting-row"><span>' +
      escapeHtml(t("settings.language")) +
      '</span><div class="segmented" role="group">' +
      segmentedButton("set-language", "language", "it", "IT", language() === "it") +
      segmentedButton("set-language", "language", "en", "EN", language() === "en") +
      "</div></div>" +
      "</section>" +
      '<form class="settings-block profile-form" id="settingsProfileForm" novalidate>' +
      '<h3>' +
      escapeHtml(t("settings.profile")) +
      "</h3>" +
      '<label class="field-label" for="settingsNickname">' +
      escapeHtml(t("settings.nickname")) +
      "</label>" +
      '<input id="settingsNickname" name="nickname" maxlength="32" value="' +
      escapeHtml(state.profile.nickname) +
      '">' +
      '<label class="field-label" for="settingsCost">' +
      escapeHtml(t("settings.cost")) +
      "</label>" +
      '<input id="settingsCost" name="costPerCigarette" type="number" min="0.01" max="25" step="0.01" inputmode="decimal" value="' +
      escapeHtml(state.profile.costPerCigarette) +
      '">' +
      '<label class="field-label" for="settingsReason">' +
      escapeHtml(t("settings.reason")) +
      "</label>" +
      '<textarea id="settingsReason" name="reason" maxlength="180" rows="3">' +
      escapeHtml(state.profile.reason) +
      "</textarea>" +
      '<button class="secondary-button" type="submit">' +
      '<span class="button-icon">' +
      icon("save") +
      "</span><span>" +
      escapeHtml(t("common.save")) +
      "</span></button>" +
      "</form>" +
      '<section class="settings-block">' +
      '<h3>' +
      escapeHtml(t("settings.stats")) +
      "</h3>" +
      settingsStat(t("settings.quitAt"), formatDate(state.profile.quitAt, true)) +
      settingsStat(t("settings.createdAt"), formatDate(state.profile.createdAt, false)) +
      settingsStat(t("settings.cigarettesPerDay"), formatNumber(state.profile.cigarettesPerDay)) +
      settingsStat(t("dashboard.cigarettesAvoided"), formatNumber(stats.avoided)) +
      settingsStat(t("dashboard.moneySaved"), formatCurrency(stats.saved)) +
      settingsStat(t("settings.completedDays"), formatNumber(state.progress.completedDates.length)) +
      settingsStat(t("settings.earnedMilestones"), earnedLabels || "0") +
      "</section>" +
      '<section class="settings-block">' +
      '<h3>' +
      escapeHtml(t("settings.appInfo")) +
      "</h3>" +
      '<p class="settings-copy">' +
      escapeHtml(t("settings.appInfoText")) +
      "</p>" +
      '<p class="storage-status">' +
      escapeHtml(storageStatus.storageAvailable ? t("settings.storageOk") : t("settings.storageFallback")) +
      "</p>" +
      '<button class="danger-button" type="button" data-action="reset-data">' +
      '<span class="button-icon">' +
      icon("trash") +
      "</span><span>" +
      escapeHtml(t("settings.reset")) +
      "</span></button>" +
      "</section>" +
      "</section>";
  }

  function segmentedButton(action, key, value, label, selected, iconName) {
    return (
      '<button class="' +
      (selected ? "is-selected" : "") +
      '" type="button" data-action="' +
      action +
      '" data-' +
      key +
      '="' +
      value +
      '">' +
      (iconName ? icon(iconName) : "") +
      '<span>' +
      escapeHtml(label) +
      "</span></button>"
    );
  }

  function settingsStat(label, value) {
    return (
      '<div class="settings-stat"><span>' +
      escapeHtml(label) +
      "</span><strong>" +
      escapeHtml(value) +
      "</strong></div>"
    );
  }

  function randomMotivation() {
    var list = valueAt("motivation");
    if (!Array.isArray(list) || !list.length) {
      return "";
    }
    return list[Math.floor(Math.random() * list.length)];
  }

  function showToast(message) {
    if (!message) {
      return;
    }
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
      toast.hidden = true;
    }, 3600);
  }

  function maybeCelebrateRank() {
    if (!state.profile) {
      return;
    }
    var rank = window.DKYSRanks.getRank(window.DKYSStorage.elapsedDays(state.profile));
    if (rank.id > state.progress.lastSeenRankId) {
      showRankModal(rank);
      state = window.DKYSStorage.setLastSeenRank(rank.id);
    }
  }

  function showRankModal(rank) {
    var iconHolder = document.getElementById("rankModalIcon");
    var eyebrow = document.getElementById("rankModalEyebrow");
    var title = document.getElementById("rankModalTitle");
    var text = document.getElementById("rankModalText");
    var button = document.getElementById("rankModalButton");
    rankModal.style.setProperty("--rank-color", rank.color);
    iconHolder.innerHTML = rank.icon;
    eyebrow.textContent = t("ranks.modalEyebrow");
    title.textContent = rank.name[language()];
    text.textContent = t("ranks.reached", { rank: rank.name[language()] });
    button.textContent = t("ranks.modalButton");
    rankModal.hidden = false;
  }

  function showErrors(form, validation) {
    form.querySelectorAll(".field-error").forEach(function (node) {
      node.textContent = "";
    });
    if (!validation || !validation.errors) {
      return;
    }
    if (validation.errors.nickname) {
      setError(form, "nickname", t("onboarding.errors.nickname"));
    }
    if (validation.errors.cigarettes) {
      setError(form, "cigarettes", t("onboarding.errors.cigarettes"));
    }
    if (validation.errors.quitAt) {
      setError(form, "quitAt", t("onboarding.errors.quitAt"));
    }
  }

  function setError(form, key, message) {
    var node = form.querySelector('[data-error-for="' + key + '"]');
    if (node) {
      node.textContent = message;
    }
  }

  function handleClick(event) {
    var button = event.target.closest("[data-action]");
    if (!button) {
      return;
    }
    var action = button.getAttribute("data-action");

    if (action === "navigate") {
      currentScreen = button.getAttribute("data-screen") || "dashboard";
      render();
    }

    if (action === "quick-theme") {
      var nextTheme = state.settings.theme === "night" ? "day" : "night";
      state = window.DKYSStorage.setSettings({ theme: nextTheme });
      render();
      showToast(t("toast.theme"));
    }

    if (action === "set-theme") {
      state = window.DKYSStorage.setSettings({ theme: button.getAttribute("data-theme") });
      render();
      showToast(t("toast.theme"));
    }

    if (action === "set-language") {
      state = window.DKYSStorage.setSettings({ language: button.getAttribute("data-language") });
      render();
      showToast(t("toast.language"));
    }

    if (action === "record-day") {
      var motivation = randomMotivation();
      var result = window.DKYSStorage.recordToday(motivation);
      state = result.state;
      render();
      if (result.ok) {
        showToast(t("dashboard.award", { xp: result.xpAward }) + " - " + motivation);
      } else if (result.reason === "already-done") {
        showToast(t("dashboard.todayDone"));
      }
    }

    if (action === "new-activity") {
      var list = activities();
      activeActivityIndex = Math.floor(Math.random() * list.length);
      render();
    }

    if (action === "select-activity") {
      activeActivityIndex = Math.max(0, Number(button.getAttribute("data-index")) || 0);
      render();
    }

    if (action === "activity-done") {
      showToast(t("cravings.encouragement"));
    }

    if (action === "clear-chat") {
      state = window.DKYSStorage.clearChat();
      render();
      showToast(t("chat.cleared"));
    }

    if (action === "reset-data") {
      if (window.confirm(t("settings.resetConfirm"))) {
        state = window.DKYSStorage.reset();
        currentScreen = "dashboard";
        render();
        showToast(t("settings.resetDone"));
      }
    }

    if (action === "close-rank-modal") {
      rankModal.hidden = true;
    }
  }

  function handleSubmit(event) {
    if (event.target.id === "onboardingForm") {
      event.preventDefault();
      var form = event.target;
      var result = window.DKYSStorage.createProfile({
        nickname: form.nickname.value,
        cigarettesPerDay: form.cigarettesPerDay.value,
        quitAt: form.quitAt.value,
        reason: form.reason.value,
        costPerCigarette: 0.35
      });
      if (!result.ok) {
        showErrors(form, result.validation);
        showToast(t("onboarding.errors.generic"));
        return;
      }
      state = result.state;
      currentScreen = "dashboard";
      render();
    }

    if (event.target.id === "chatForm") {
      event.preventDefault();
      var input = event.target.elements.message;
      var text = window.DKYSStorage.cleanText(input.value, 700);
      if (!text) {
        return;
      }
      state = window.DKYSStorage.appendChat("user", text);
      var reply = window.DKYSChat.getReply(text, language());
      state = window.DKYSStorage.appendChat("bot", reply.text);
      render();
      var newInput = document.querySelector('#chatForm input[name="message"]');
      if (newInput) {
        newInput.focus();
      }
    }

    if (event.target.id === "settingsProfileForm") {
      event.preventDefault();
      var settingsForm = event.target;
      var update = window.DKYSStorage.updateProfile({
        nickname: settingsForm.nickname.value,
        reason: settingsForm.reason.value,
        costPerCigarette: settingsForm.costPerCigarette.value
      });
      if (!update.ok) {
        showToast(t("toast.invalidProfile"));
        return;
      }
      state = update.state;
      render();
      showToast(t("toast.profile"));
    }
  }

  function init() {
    state = window.DKYSStorage.load();
    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleSubmit);
    render();

    var status = window.DKYSStorage.getStatus();
    if (status.repaired && state.profile) {
      showToast(t("dashboard.repaired"));
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
