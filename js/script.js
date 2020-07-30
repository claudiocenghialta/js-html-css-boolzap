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
    $('.box-avatar').click(function () {
        if (!$(this).hasClass('active')) {
            //sposto la classe active nel box avatar selezionato
            $('.box-avatar').removeClass('active');
            $(this).addClass('active');
            //calcolo posizione nell'elenco
            var posizione = $(this).index();
            console.log(posizione);
            //sposto la classe active nel relativo chat-messages 
            $('.chat-messages').removeClass('active');
            $('.chat-messages').eq(posizione).addClass('active');
        }
    })
    //al click o quando premo invio inizia la chat
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
    elemento.find('.message-hour').append(oraEsatta);
    if (tipo == 'sent') {
        elemento.addClass('sent')
    } else {
        elemento.addClass('received')
    }
    $('#chat .chat-messages.active').append(elemento);
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