(function () {
  "use strict";

  var benefits = [
    {
      minMinutes: 20,
      icon: "pulse",
      title: { it: "Pressione in riequilibrio", en: "Pressure rebalancing" },
      text: {
        it: "Frequenza cardiaca e pressione possono iniziare a normalizzarsi.",
        en: "Heart rate and blood pressure may begin moving toward normal."
      }
    },
    {
      minMinutes: 12 * 60,
      icon: "blood",
      title: { it: "Monossido di carbonio in calo", en: "Carbon monoxide drops" },
      text: {
        it: "Il monossido di carbonio nel sangue diminuisce e l'ossigeno migliora.",
        en: "Carbon monoxide in the blood decreases and oxygen levels improve."
      }
    },
    {
      minMinutes: 24 * 60,
      icon: "spark",
      title: { it: "Primo giorno completato", en: "First day completed" },
      text: {
        it: "Il corpo lavora per ripulirsi dagli effetti immediati del fumo.",
        en: "Your body works to clear the immediate effects of smoking."
      }
    },
    {
      minMinutes: 48 * 60,
      icon: "taste",
      title: { it: "Sensi piu presenti", en: "Senses returning" },
      text: {
        it: "Gusto e olfatto possono iniziare a diventare piu nitidi.",
        en: "Taste and smell may start becoming sharper."
      }
    },
    {
      minMinutes: 72 * 60,
      icon: "lungs",
      title: { it: "Nicotina quasi eliminata", en: "Nicotine nearly cleared" },
      text: {
        it: "La nicotina viene eliminata in gran parte dal corpo; la voglia puo essere intensa ma temporanea.",
        en: "Nicotine is mostly cleared from the body; cravings can be intense but temporary."
      }
    },
    {
      minMinutes: 7 * 24 * 60,
      icon: "walk",
      title: { it: "Prima settimana", en: "First week" },
      text: {
        it: "Molti sintomi acuti dell'astinenza iniziano a perdere intensita.",
        en: "Many acute withdrawal symptoms start losing intensity."
      }
    },
    {
      minMinutes: 14 * 24 * 60,
      icon: "breath",
      title: { it: "Respiro piu stabile", en: "Steadier breathing" },
      text: {
        it: "La respirazione puo diventare piu semplice durante le attivita quotidiane.",
        en: "Breathing may feel easier during everyday activities."
      }
    },
    {
      minMinutes: 30 * 24 * 60,
      icon: "flow",
      title: { it: "Circolazione in miglioramento", en: "Circulation improving" },
      text: {
        it: "La circolazione e la funzione respiratoria possono continuare a migliorare.",
        en: "Circulation and respiratory function can keep improving."
      }
    },
    {
      minMinutes: 90 * 24 * 60,
      icon: "habit",
      title: { it: "Nuove abitudini", en: "New habits" },
      text: {
        it: "Le routine senza sigarette diventano piu riconoscibili e ripetibili.",
        en: "Smoke-free routines become easier to recognize and repeat."
      }
    },
    {
      minMinutes: 180 * 24 * 60,
      icon: "shield",
      title: { it: "Tosse in diminuzione", en: "Less coughing" },
      text: {
        it: "Tosse e affanno possono ridursi mentre i polmoni recuperano efficienza.",
        en: "Coughing and shortness of breath may decrease as lungs recover efficiency."
      }
    },
    {
      minMinutes: 365 * 24 * 60,
      icon: "star",
      title: { it: "Un anno libero", en: "One year free" },
      text: {
        it: "I rischi associati al fumo iniziano una riduzione importante e progressiva.",
        en: "Smoking-related risks begin a meaningful and progressive reduction."
      }
    },
    {
      minMinutes: 5 * 365 * 24 * 60,
      icon: "horizon",
      title: { it: "Riduzione a lungo termine", en: "Long-term reduction" },
      text: {
        it: "Negli anni, i rischi cardiovascolari e respiratori continuano a diminuire.",
        en: "Over the years, cardiovascular and respiratory risks continue to decline."
      }
    }
  ];

  function getBenefits(elapsedMinutes) {
    var minutes = Math.max(0, Number(elapsedMinutes) || 0);
    var achieved = benefits.filter(function (benefit) {
      return minutes >= benefit.minMinutes;
    });
    var next = benefits.find(function (benefit) {
      return minutes < benefit.minMinutes;
    }) || null;
    return { achieved: achieved, next: next, all: benefits };
  }

  window.DKYSBenefits = {
    all: benefits,
    getBenefits: getBenefits
  };
})();
