/*
Replica della grafica con la possibilità 
di avere messaggi scritti dall'utente (verdi) e
dall'interlocutore (bianco) 
assegnando due classi CSS diverse.
*/
var arrayRisposte = [
    'ok',
    'non saprei',
    'certamente',
    'assolutamente no',
    'ciao',
    'buona giornata'
];


$(document).ready(function () {
    //mostra microfono o invio messaggio a seconda del focus su input
    // + "sta scrivendo" sotto nome utente
    $("#input-message").focus(function () {
        $('#nuovo-messaggio .icona-invio ').toggleClass('active');
        $('#app-right .header-left .avatar-details').toggleClass('active');
    })
    $("#input-message").focusout(function () {
        setTimeout(function () {
            $('#nuovo-messaggio .icona-invio ').toggleClass('active');
            $('#app-right .header-left .avatar-details').toggleClass('active');
        }, 100);
    })
    //al click su una voce dell'elenco delle chat cambio chat
    $('.box-avatar').click(selectChat);
    //al click o quando premo invio mando il messaggio ed inizia la chat
    $('#nuovo-messaggio i.fa-paper-plane').click(function () {
        chatta();
    })
    $("#input-message").keydown(function (evento) {
        if (evento.which == 13) {
            chatta();
        }
    });
});




//FUNZIONI



//CHAT 
function chatta() {
    //prendo il valore del messaggio nella input
    var nuovoMessaggio = $('#input-message').val()
    if (nuovoMessaggio != '') {
        //NB escludo invio quando input è vuota
        invioMessaggio(nuovoMessaggio, 'sent');
        //faccio scroll dei messaggi in automatico
        scrollChat();
        //dopo 1 secondo genero un messaggio di risposta
        setTimeout(function () {
            //risposta presa random da un array di risposte prestabilite
            invioMessaggio(arrayRisposte[random(0, arrayRisposte.length - 1)]);
            scrollChat();
        }, 1000);
        //reset campo input
        $('#input-message').val('');
    }
}

//SCROLL AUTOMATICO MESSAGGI CHAT
function scrollChat() {
    var posizione = $('#chat .chat-messages.active .message:last-child').position();
    $('#chat').scrollTop(posizione.top);
}

//INVIO MESSAGGIO
function invioMessaggio(testo, tipo) {
    //clono template ed inserisco valore testo + orario
    var elemento = $('#templates .message').clone();
    elemento.find('.message-text').append(testo);
    var orario = oraEsatta()
    elemento.find('.message-hour').append(orario);
    if (tipo == 'sent') {
        elemento.addClass('sent');
        ultimoAccesso(testo, orario);
        aggiornaDatiChat();
    } else {
        elemento.addClass('received');
        ultimoAccesso(testo); //non passo l'orario così non cambia l'ora dell'ultimo accesso
    }
    $('#chat .chat-messages.active').append(elemento);
}

//select chat da elenco chat a sinistra
function selectChat() {
    if (!$(this).hasClass('active')) {
        //sposto la classe active nel box avatar selezionato
        $('.box-avatar').removeClass('active');
        $(this).addClass('active');
        //calcolo posizione nell'elenco
        var posizione = $(this).index();
        //sposto la classe active nel relativo chat-messages 
        $('.chat-messages').removeClass('active');
        $('.chat-messages').eq(posizione).addClass('active');
        aggiornaDatiChat();
    }
}

//aggiorno dati testata chat su parte destra dell'app
function aggiornaDatiChat() {
    //cambio nome su chat a destra
    console.log('ciao');
    var nome = $('.box-avatar.active').find('.avatar-name').text();
    $('#app-right .header-left .avatar-name').text(nome);
    //cambio immagine su chat a destra
    var immagine = $('.box-avatar.active').find('img.avatar').attr('src');
    $('#app-right .header-left img.avatar').attr('src', immagine);
    var orario = $('.box-avatar.active').find('.orario-chat').text();
    $('#app-right .header-left .avatar-details.orario').text('Ultimo accesso oggi alle ' + orario);
}

//aggiorno ultimo messaggio ed ultimo accesso su elenco chat a sinistra
function ultimoAccesso(messaggio, orario) {
    //aggiorno ultimo messaggio su elenco chato e ora ultimo accesso
    $('#elenco-chat .box-avatar.active .avatar-details').text(messaggio);
    if (orario != '') {
        $('#elenco-chat .box-avatar.active .orario-chat').text(orario);
    }
}

//ORA ESATTA
function oraEsatta() {
    var d = new Date();
    var ore = d.getHours();
    var minuti = d.getMinutes();
    if (minuti < 10) {
        minuti = '0' + minuti
    }
    return ore + ':' + minuti;
}

//RANDOM
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}