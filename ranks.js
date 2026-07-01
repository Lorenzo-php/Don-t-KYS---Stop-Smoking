(function () {
  "use strict";

  var DAY_MS = 24 * 60 * 60 * 1000;

  var ranks = [
    {
      id: 1,
      minDay: 0,
      maxDay: 3,
      color: "#c49a32",
      name: { it: "Primo Passo", en: "First Step" },
      description: {
        it: "Il momento piu difficile: il corpo inizia a eliminare nicotina.",
        en: "The hardest moment: your body begins clearing nicotine."
      },
      icon: '<svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="31"/><path d="M28 46l9 9 18-27"/></svg>'
    },
    {
      id: 2,
      minDay: 4,
      maxDay: 14,
      color: "#4f8f7a",
      name: { it: "Resistenza", en: "Resistance" },
      description: {
        it: "La fase intensa dell'astinenza generalmente diminuisce.",
        en: "The intense withdrawal phase usually starts easing."
      },
      icon: '<svg viewBox="0 0 80 80" aria-hidden="true"><path d="M40 10l25 12v18c0 16-10 25-25 30-15-5-25-14-25-30V22l25-12z"/><path d="M28 42l8 8 17-19"/></svg>'
    },
    {
      id: 3,
      minDay: 15,
      maxDay: 30,
      color: "#5e7bb8",
      name: { it: "Rinascita", en: "Renewal" },
      description: {
        it: "Respirazione in miglioramento e adattamento senza nicotina.",
        en: "Breathing improves while your system adapts without nicotine."
      },
      icon: '<svg viewBox="0 0 80 80" aria-hidden="true"><path d="M40 69C24 57 17 45 17 32c0-9 6-16 15-16 4 0 7 2 8 5 1-3 4-5 8-5 9 0 15 7 15 16 0 13-7 25-23 37z"/><path d="M40 22v38M28 38c8 1 12 6 12 14M52 38c-8 1-12 6-12 14"/></svg>'
    },
    {
      id: 4,
      minDay: 31,
      maxDay: 90,
      color: "#9871a8",
      name: { it: "Controllo", en: "Control" },
      description: {
        it: "Nuove abitudini prendono spazio e gli automatismi perdono forza.",
        en: "New habits take up space and automatic behaviors lose strength."
      },
      icon: '<svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="29"/><path d="M40 22v20l14 8"/></svg>'
    },
    {
      id: 5,
      minDay: 91,
      maxDay: 180,
      color: "#bd7356",
      name: { it: "Trasformazione", en: "Transformation" },
      description: {
        it: "Lo stile di vita senza fumo si consolida giorno dopo giorno.",
        en: "A smoke-free lifestyle consolidates day after day."
      },
      icon: '<svg viewBox="0 0 80 80" aria-hidden="true"><path d="M18 56c19 0 33-14 33-33 9 4 13 12 11 21 7 0 12 4 14 10-8 9-18 14-31 14-12 0-21-4-27-12z"/><path d="M28 56c9-7 16-15 21-27"/></svg>'
    },
    {
      id: 6,
      minDay: 181,
      maxDay: 365,
      color: "#6f8fcb",
      name: { it: "Nuova Identita", en: "New Identity" },
      description: {
        it: "Non fumare diventa una parte sempre piu naturale di chi sei.",
        en: "Not smoking becomes an increasingly natural part of who you are."
      },
      icon: '<svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="25" r="13"/><path d="M17 68c4-15 13-24 23-24s19 9 23 24"/><path d="M25 58h30"/></svg>'
    },
    {
      id: 7,
      minDay: 366,
      maxDay: Infinity,
      color: "#d6b44f",
      name: { it: "Leggenda Libera", en: "Free Legend" },
      description: {
        it: "Percorso completato: la liberta e diventata identita.",
        en: "Path completed: freedom has become identity."
      },
      icon: '<svg viewBox="0 0 80 80" aria-hidden="true"><path d="M40 9l8 21 22 1-17 14 6 22-19-12-19 12 6-22-17-14 22-1 8-21z"/><path d="M31 42l6 6 13-16"/></svg>'
    }
  ];

  var milestoneBonuses = [
    { day: 7, xp: 250, label: { it: "Una settimana libera", en: "One smoke-free week" } },
    { day: 14, xp: 400, label: { it: "Astinenza in discesa", en: "Withdrawal easing" } },
    { day: 30, xp: 750, label: { it: "Primo mese", en: "First month" } },
    { day: 90, xp: 1400, label: { it: "Nuove abitudini", en: "New habits" } },
    { day: 180, xp: 2200, label: { it: "Sei mesi", en: "Six months" } },
    { day: 365, xp: 5000, label: { it: "Un anno libero", en: "One smoke-free year" } }
  ];

  function getRank(days) {
    var safeDays = Math.max(0, Math.floor(Number(days) || 0));
    for (var i = ranks.length - 1; i >= 0; i -= 1) {
      if (safeDays >= ranks[i].minDay) {
        return ranks[i];
      }
    }
    return ranks[0];
  }

  function getNextRank(days) {
    var current = getRank(days);
    return ranks.find(function (rank) {
      return rank.id === current.id + 1;
    }) || null;
  }

  function getRankProgress(elapsedMs) {
    var safeMs = Math.max(0, Number(elapsedMs) || 0);
    var daysFloat = safeMs / DAY_MS;
    var current = getRank(Math.floor(daysFloat));
    var next = getNextRank(Math.floor(daysFloat));

    if (!next) {
      return 100;
    }

    var span = next.minDay - current.minDay;
    var completed = daysFloat - current.minDay;
    return Math.max(0, Math.min(100, Math.round((completed / span) * 100)));
  }

  function getMilestonesForDays(days) {
    var safeDays = Math.max(0, Math.floor(Number(days) || 0));
    return milestoneBonuses.filter(function (milestone) {
      return safeDays >= milestone.day;
    });
  }

  function calculateXp(completedDayCount, earnedMilestoneDays) {
    var count = Math.max(0, Math.min(20000, Math.floor(Number(completedDayCount) || 0)));
    var earned = Array.isArray(earnedMilestoneDays) ? earnedMilestoneDays : [];
    var bonus = milestoneBonuses.reduce(function (sum, milestone) {
      return earned.indexOf(milestone.day) >= 0 ? sum + milestone.xp : sum;
    }, 0);
    return count * 100 + bonus;
  }

  window.DKYSRanks = {
    DAY_MS: DAY_MS,
    all: ranks,
    milestones: milestoneBonuses,
    getRank: getRank,
    getNextRank: getNextRank,
    getRankProgress: getRankProgress,
    getMilestonesForDays: getMilestonesForDays,
    calculateXp: calculateXp
  };
})();
