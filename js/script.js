$(document).ready(function () {
  var arrayRisposte = [
    "ok",
    "non saprei",
    "certamente",
    "assolutamente no",
    "ciao",
    "buona giornata",
  ];
  var timeoutRisposta = 1; //valore espresso in secondi

  //mostra microfono o invio messaggio a seconda del focus su input
  // + "sta scrivendo" sotto nome utente
  $("#input-message").focus(function () {
    $("#nuovo-messaggio .icona-invio ").toggleClass("active");
    $("#app-right .header-left .avatar-details").toggleClass("active");
  });
  $("#input-message").focusout(function () {
    setTimeout(function () {
      $("#nuovo-messaggio .icona-invio ").toggleClass("active");
      $("#app-right .header-left .avatar-details").toggleClass("active");
    }, 100);
  });
  //al click su una voce dell'elenco delle chat cambio chat
  $(".box-avatar").click(selectChat);
  //al click o quando premo invio mando il messaggio ed inizia la chat
  $("#nuovo-messaggio i.fa-paper-plane").click(function () {
    chatta();
  });
  $("#input-message").keydown(function () {
    if (event.which == 13 || event.keycode == 13) {
      chatta();
    }
  });

  $("#input-cerca").keyup(function () {
    var valoreRicerca = $("#input-cerca").val().toLowerCase();
    $("#elenco-chat .box-avatar").each(function () {
      if (
        $(this)
          .find(".avatar-name")
          .text()
          .toLowerCase()
          .includes(valoreRicerca)
      ) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });

  //FUNZIONI

  //CHAT
  function chatta() {
    //prendo il valore del messaggio nella input
    var nuovoMessaggio = $("#input-message").val();
    if (nuovoMessaggio != "") {
      //NB escludo invio quando input è vuota
      var indiceChat = $("#chat .chat-messages.active").index();
      invioMessaggio(nuovoMessaggio, "sent", indiceChat);
      //faccio scroll dei messaggi in automatico
      scrollChat(indiceChat);
      //memorizzo l'indice della chat attiva
      //dopo 1 secondo genero un messaggio di risposta
      //lo devo generare nella chat con indice preso in precedenza,
      //perchè se nel frattempo ho cambiato chat la risposta
      //arriverebbe sulla chat sbagliata
      setTimeout(function () {
        //risposta presa random da un array di risposte prestabilite
        invioMessaggio(
          arrayRisposte[random(0, arrayRisposte.length - 1)],
          "received",
          indiceChat
        );
        scrollChat(indiceChat);
      }, timeoutRisposta * 1000);
      //reset campo input
      $("#input-message").val("");
    }
  }

  //SCROLL AUTOMATICO MESSAGGI CHAT
  function scrollChat(indiceChat) {
    var posizione = $("#chat .chat-messages")
      .eq(indiceChat)
      .find(".message:last-child")
      .position();
    $("#chat").scrollTop(posizione.top);
  }

  //INVIO MESSAGGIO
  function invioMessaggio(testo, tipo, indiceChat) {
    //clono template ed inserisco valore testo + orario
    var elemento = $("#templates .message").clone();
    elemento.find(".message-text").append(testo);
    var orario = oraEsatta();
    elemento.find(".message-hour").append(orario);
    if (tipo == "sent") {
      elemento.addClass("sent");
      ultimoAccesso(testo, indiceChat, orario);
      aggiornaDatiChat(indiceChat);
    } else {
      elemento.addClass("received");
      ultimoAccesso(testo, indiceChat); //non passo l'orario così non cambia l'ora dell'ultimo accesso
    }
    $("#chat .chat-messages").eq(indiceChat).append(elemento);
  }

  //select chat da elenco chat a sinistra
  function selectChat() {
    if (!$(this).hasClass("active")) {
      //sposto la classe active nel box avatar selezionato
      $(".box-avatar").removeClass("active");
      $(this).addClass("active");
      //calcolo posizione nell'elenco
      var posizione = $(this).index();
      //sposto la classe active nel relativo chat-messages
      $(".chat-messages").removeClass("active");
      $(".chat-messages").eq(posizione).addClass("active");
      aggiornaDatiChat(posizione);
    }
  }

  //aggiorno dati testata chat su parte destra dell'app
  function aggiornaDatiChat(indiceChat) {
    //cambio nome su chat a destra
    var elemento = $(".box-avatar").eq(indiceChat);
    var nome = elemento.find(".avatar-name").text();
    $("#app-right .header-left .avatar-name").text(nome);
    //cambio immagine su chat a destra
    var immagine = elemento.find("img.avatar").attr("src");
    $("#app-right .header-left img.avatar").attr("src", immagine);
    var orario = elemento.find(".orario-chat").text();
    $("#app-right .header-left .avatar-details.orario").text(
      "Ultimo accesso oggi alle " + orario
    );
  }

  //aggiorno ultimo messaggio ed ultimo accesso su elenco chat a sinistra
  function ultimoAccesso(messaggio, indiceChat, orario) {
    //aggiorno ultimo messaggio su elenco chato e ora ultimo accesso
    var elemento = $("#elenco-chat .box-avatar").eq(indiceChat);
    elemento.find(".avatar-details").text(messaggio);
    if (orario != "") {
      elemento.find(".orario-chat").text(orario);
    }
  }

  //ORA ESATTA
  function oraEsatta() {
    var d = new Date();
    var ore = d.getHours();
    var minuti = d.getMinutes();
    console.log(ore, minuti);
    ore = aggiungiZero(ore);
    minuti = aggiungiZero(minuti);
    return ore + ":" + minuti;
  }

  function aggiungiZero(dato) {
    if (dato < 10) {
      return "0" + dato;
    }
    return dato;
  }

  //RANDOM
  function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
});
