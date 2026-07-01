(function () {
  "use strict";

  var responses = {
    craving: {
      it: [
        "La voglia e un'onda: non devi discuterci, devi attraversarla per qualche minuto.",
        "Bevi acqua lentamente e conta dieci respiri. Rimani solo nel prossimo minuto.",
        "Il cervello sta chiedendo una vecchia scorciatoia. Tu puoi scegliere una strada nuova.",
        "Allontanati dal punto in cui sei. Cambiare stanza spesso cambia anche l'impulso.",
        "Non promettere tutta la vita adesso. Prometti i prossimi cinque minuti.",
        "Questa voglia non e un ordine. E un segnale, e passera.",
        "Metti qualcosa in mano: penna, bicchiere, gomma. Rompi il gesto automatico.",
        "Hai gia superato altri impulsi. Questo e un altro allenamento.",
        "Fai tre respiri profondi: inspira 4, trattieni 2, espira 6.",
        "La parte difficile e reale. Anche la tua capacita di restare libero lo e."
      ],
      en: [
        "A craving is a wave: you do not have to debate it, just cross it for a few minutes.",
        "Drink water slowly and count ten breaths. Stay with the next minute only.",
        "Your brain is asking for an old shortcut. You can choose a new route.",
        "Move away from where you are. Changing rooms often changes the urge too.",
        "Do not promise a lifetime right now. Promise the next five minutes.",
        "This craving is not an order. It is a signal, and it will pass.",
        "Put something in your hand: a pen, a glass, gum. Break the automatic gesture.",
        "You have crossed other urges already. This is another training rep.",
        "Take three deep breaths: inhale 4, hold 2, exhale 6.",
        "The hard part is real. So is your ability to stay free."
      ]
    },
    positive: {
      it: [
        "Questa e una prova concreta: il cambiamento sta gia succedendo.",
        "Goditi il momento. Celebrare una vittoria aiuta il cervello a ricordarla.",
        "Hai fatto qualcosa di difficile e importante. Registralo mentalmente.",
        "Benissimo. Una giornata cosi diventa una base per la prossima.",
        "La fiducia cresce quando vede prove. Oggi gliene hai data una.",
        "Tieniti vicino questo stato: e parte della nuova normalita.",
        "Sono contento per te. Non minimizzare: e una vittoria vera.",
        "Ogni volta che ce la fai, rendi piu debole il vecchio automatismo.",
        "Questa energia puo diventare routine. Un passo pulito alla volta.",
        "Ottimo lavoro. Fai qualcosa di piccolo per segnare la vittoria."
      ],
      en: [
        "This is concrete proof: change is already happening.",
        "Enjoy the moment. Celebrating a win helps your brain remember it.",
        "You did something hard and important. Register it mentally.",
        "Beautiful. A day like this becomes a base for the next one.",
        "Confidence grows when it sees proof. Today you gave it proof.",
        "Keep this state close: it is part of the new normal.",
        "I am glad for you. Do not minimize it: this is a real win.",
        "Every time you make it, the old automatic pattern gets weaker.",
        "This energy can become routine. One clean step at a time.",
        "Great work. Do something small to mark the win."
      ]
    },
    relapse: {
      it: [
        "Una difficolta non cancella tutto il percorso fatto. Analizza cosa e successo e riparti.",
        "Niente giudizio. Capire il momento della ricaduta vale piu che punirti.",
        "Il percorso non e rovinato. E un dato in piu per proteggerti meglio.",
        "Respira. Scrivi dove eri, con chi eri, e cosa sentivi prima di fumare.",
        "Ripartire subito e una scelta potente. Non aspettare domani per tornare libero.",
        "Un episodio non definisce la tua identita. La prossima scelta conta adesso.",
        "Prova a togliere un innesco concreto dall'ambiente nelle prossime ore.",
        "Parlane con gentilezza: cosa ti serviva in quel momento, oltre alla sigaretta?",
        "Il progresso reale include anche imparare dai punti fragili.",
        "Non usare la colpa come carburante. Usa chiarezza, cura e un prossimo passo."
      ],
      en: [
        "A difficult moment does not erase the path you have walked. Analyze what happened and restart.",
        "No judgment. Understanding the relapse moment matters more than punishing yourself.",
        "The path is not ruined. It is more data to protect yourself better.",
        "Breathe. Write where you were, who was there, and what you felt before smoking.",
        "Restarting immediately is powerful. Do not wait until tomorrow to return to freedom.",
        "One episode does not define your identity. The next choice matters now.",
        "Try removing one concrete trigger from your environment in the next few hours.",
        "Talk to yourself gently: what did you need then, besides a cigarette?",
        "Real progress includes learning from fragile points.",
        "Do not use guilt as fuel. Use clarity, care, and a next step."
      ]
    },
    stress: {
      it: [
        "Lo stress chiede sollievo rapido, ma la sigaretta lo restituisce con interessi.",
        "Fai una pausa fisica: spalle giu, mascella morbida, piedi a terra.",
        "Scegli un'azione che abbassi il carico senza riaccendere il ciclo.",
        "Per due minuti non risolvere tutta la vita. Regola solo il respiro.",
        "Il bisogno di calma e legittimo. La sigaretta non e l'unico modo per dargli spazio.",
        "Scrivi tre parole su quello che senti. Dare nome allo stress lo rende piu gestibile.",
        "Se puoi, cammina cinque minuti. Il corpo aiuta la mente a cambiare canale.",
        "Rallenta l'espirazione. Il sistema nervoso ascolta quel segnale.",
        "Stai cercando sollievo, non fumo. Puntiamo al sollievo vero.",
        "Una pausa senza sigaretta insegna al corpo che puo calmarsi da solo."
      ],
      en: [
        "Stress asks for quick relief, but cigarettes return it with interest.",
        "Take a physical pause: shoulders down, soft jaw, feet on the ground.",
        "Choose an action that lowers the load without restarting the cycle.",
        "For two minutes, do not solve your whole life. Regulate only your breath.",
        "Your need for calm is valid. A cigarette is not the only way to make room for it.",
        "Write three words about what you feel. Naming stress makes it more manageable.",
        "If you can, walk for five minutes. The body helps the mind change channel.",
        "Slow the exhale. Your nervous system listens to that signal.",
        "You are looking for relief, not smoke. Let us aim for real relief.",
        "A break without a cigarette teaches your body it can calm itself."
      ]
    },
    tired: {
      it: [
        "Stanchezza e astinenza possono amplificarsi. Riduci l'obiettivo: resta pulito per oggi.",
        "Mangia qualcosa di semplice, bevi acqua e concediti una pausa vera.",
        "Non devi vincere con energia alta. Puoi vincere anche piano.",
        "La fatica non e un fallimento. E un segnale da ascoltare senza fumare.",
        "Se oggi e pesante, togli complessita. Proteggi il minimo indispensabile.",
        "Dormire, muoversi poco, respirare: anche questo e strategia.",
        "Il corpo sta ricalibrando. Dagli tempo e non pretendere perfezione.",
        "Quando sei stanco, decidi in anticipo: niente negoziazioni con la voglia.",
        "Appoggiati a una routine piccola: acqua, respiro, doccia, letto.",
        "Anche una giornata faticosa senza sigarette e una giornata riuscita."
      ],
      en: [
        "Tiredness and withdrawal can amplify each other. Shrink the goal: stay clean today.",
        "Eat something simple, drink water, and give yourself a real pause.",
        "You do not need high energy to win. You can win quietly.",
        "Fatigue is not failure. It is a signal to hear without smoking.",
        "If today is heavy, remove complexity. Protect the minimum that matters.",
        "Sleep, move gently, breathe: this is strategy too.",
        "Your body is recalibrating. Give it time and do not demand perfection.",
        "When you are tired, decide in advance: no negotiations with the craving.",
        "Lean on a small routine: water, breath, shower, bed.",
        "Even a hard day without cigarettes is a successful day."
      ]
    },
    generic: {
      it: [
        "Quello che provi ha senso. Restiamo sul prossimo passo, non su tutto il percorso.",
        "Raccontami una cosa concreta: dove sei e quanto e forte la voglia da 1 a 10?",
        "Se la mente corre, torna al corpo: piedi a terra, respiro lento, spalle morbide.",
        "La liberta si costruisce anche nei momenti poco eleganti. Continua.",
        "Non devi essere invincibile. Devi avere una strategia per i momenti fragili.",
        "Scegli una micro-azione adesso. Piccola, concreta, senza fumo.",
        "La parte di te che vuole smettere e ancora qui. Diamole spazio.",
        "Ogni minuto in cui non fumi cambia il voto della giornata.",
        "Stai facendo un lavoro serio. Trattati come una persona in recupero, non sotto esame.",
        "Va bene andare piano. L'importante e non consegnare il volante alla sigaretta."
      ],
      en: [
        "What you feel makes sense. Let us stay with the next step, not the whole path.",
        "Tell me one concrete thing: where are you, and how strong is the craving from 1 to 10?",
        "If your mind is racing, return to the body: feet down, slow breath, soft shoulders.",
        "Freedom is built in messy moments too. Continue.",
        "You do not need to be invincible. You need a strategy for fragile moments.",
        "Choose one micro-action now. Small, concrete, smoke-free.",
        "The part of you that wants to quit is still here. Let us give it space.",
        "Every minute without smoking changes the score of the day.",
        "You are doing serious work. Treat yourself like a person recovering, not being examined.",
        "It is okay to go slowly. What matters is not handing the wheel to the cigarette."
      ]
    }
  };

  var keywords = {
    craving: [
      "voglio fumare",
      "voglia",
      "sigaretta",
      "fumare",
      "non ce la faccio",
      "craving",
      "i want to smoke",
      "urge",
      "cigarette",
      "smoke",
      "can't do it",
      "cant do it"
    ],
    positive: [
      "ce l'ho fatta",
      "bene",
      "felice",
      "orgoglioso",
      "orgogliosa",
      "vinto",
      "riuscito",
      "riuscita",
      "i did it",
      "good",
      "happy",
      "proud",
      "made it",
      "better"
    ],
    relapse: [
      "ricaduta",
      "ho fumato",
      "sono caduto",
      "sono caduta",
      "fallito",
      "fallita",
      "relapse",
      "i smoked",
      "slipped",
      "failed"
    ],
    stress: [
      "stress",
      "ansia",
      "nervoso",
      "nervosa",
      "rabbia",
      "arrabbiato",
      "arrabbiata",
      "panic",
      "anxiety",
      "angry",
      "pressure"
    ],
    tired: [
      "stanco",
      "stanca",
      "sonno",
      "esausto",
      "esausta",
      "tired",
      "exhausted",
      "sleep",
      "weak"
    ]
  };

  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function detectCategory(message) {
    var text = normalize(message);
    var order = ["relapse", "craving", "positive", "stress", "tired"];

    for (var i = 0; i < order.length; i += 1) {
      var category = order[i];
      var found = keywords[category].some(function (keyword) {
        return text.indexOf(normalize(keyword)) >= 0;
      });
      if (found) {
        return category;
      }
    }

    if (text.indexOf("?") >= 0) {
      return "generic";
    }

    return "generic";
  }

  function pick(list, seedText) {
    var seed = 0;
    var source = String(seedText || "") + Date.now();
    for (var i = 0; i < source.length; i += 1) {
      seed = (seed + source.charCodeAt(i) * (i + 1)) % 2147483647;
    }
    return list[seed % list.length];
  }

  function getReply(message, language) {
    var lang = language === "en" ? "en" : "it";
    var category = detectCategory(message);
    var list = responses[category][lang] || responses.generic[lang];
    return {
      category: category,
      text: pick(list, message)
    };
  }

  window.DKYSChat = {
    responses: responses,
    getReply: getReply
  };
})();
