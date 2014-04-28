'use strict';

var start = new Date;
var grille;
var posBateaux = new Array();
var cptBateau=0;
var nbCoups=0;
var timer;

var PORTEAVION="Porte-avion", CROISEUR="Croiseur", SOUSMARIN="Sous-Marin", TORPILLEUR="Torpilleur";
var lngBateaux = new Array();
lngBateaux[PORTEAVION]=5;
lngBateaux[CROISEUR]=4;
lngBateaux[SOUSMARIN]=3;
lngBateaux[TORPILLEUR]=2;


function getMessage(i) {
    switch (i) {
        case 0: return "A l'eau !";
        case 1: return "Case déjà jouée !";
        case 2: return "Porte-avion touché !";
        case 3: return "Croiseur touché !";
        case 4: return "Sous-marin touché !";
        case 5: return "Torpilleur touché !";
        case 6: return "Porte-avion coulé !";
        case 7: return "Croiseur coulé !";
        case 8: return "Sous-marin coulé !";
        case 9: return "Torpilleur coulé !";
    }
}


// Ajoute un message d'information dans le div de gauche 
function ajouteMessage(m) {
    // Nouveau texte dans la liste
    var nouveauTexte=$('<p></p>').html(m);
    $('#messages').append(nouveauTexte);
    // Positionnement sur le dernier texte
    var newmsg_top = parseInt($('#messages p:last').offset().top);
    $('#messages').scrollTop(newmsg_top);

}



function getInformationBateauTouche(x,y) {
    var b=null;
    posBateaux.forEach(function(bateau) {
        console.log(bateau.x+"/"+bateau.y);
        if ( (bateau.x == x) && (bateau.y == y) ) {
            bateau.etat=1; // Bateau touché
            b=bateau;
        }
        });
    // Le bateau est coulé ? 
    var numBateau = b.num;
    var coule=true;
    posBateaux.forEach(function(bateau) {
        if (bateau.num == numBateau ) {
            console.log("bateau ....");
            if (bateau.etat == '0' ) {
                console.log("non");
                coule=false;
            }
        }
        });
    if (coule===true) {
        b.etat=-1;
    }
    return b;
}


function finDePartie() {
    ajouteMessage("Partie terminée en "+nbCoups+" coups.")
    clearInterval(timer);
}

function tir(coordonnee) {
    nbCoups++;
    $('#nbCoups').val(nbCoups);
    var id=coordonnee.attr("id");
    var x=id.substring(id.indexOf('x')+1,id.indexOf('y'));
    var y=id.substring(id.indexOf('y')+1,id.length);
    switch (grille[x][y]) {
        case -1:
            // Déja joué
            ajouteMessage(getMessage(1));
            break;
        case 0: 
            // A l'eau
            coordonnee.css("background-image", "url(img/rate.png)"); 
            ajouteMessage(getMessage(0));
            grille[x][y]=-1;
            break;
        default:
            // Bateau touché
            coordonnee.css("background-image", "url(img/touche.png)"); 
            // Type de bateau touché
            var bateau = getInformationBateauTouche(x,y);
            if (bateau!==null) {
                if (bateau.etat==-1) {
                    switch (bateau.type) {
                        case PORTEAVION:
                            ajouteMessage(getMessage(6));
                            break;
                        case CROISEUR:
                            ajouteMessage(getMessage(7));
                            break;
                        case SOUSMARIN:
                            ajouteMessage(getMessage(8));
                            break;
                        case TORPILLEUR:
                            ajouteMessage(getMessage(9));
                            break;
                    }
                    cptBateau--;
                    ajouteMessage("Il reste "+cptBateau+" bateau(x).");
                    $('#nbBateaux').val(cptBateau);

                }
                else
                {
                    switch (bateau.type) {
                        case PORTEAVION:
                            ajouteMessage(getMessage(2));
                            break;
                        case CROISEUR:
                            ajouteMessage(getMessage(3));
                            break;
                        case SOUSMARIN:
                            ajouteMessage(getMessage(4));
                            break;
                        case TORPILLEUR:
                            ajouteMessage(getMessage(5));
                            break;
                    }
                }
                grille[x][y]=1;
            }
            break;
    }

    if (cptBateau===0) {
        finDePartie();
    }

}

function getRandom(max) {
    return Math.floor(Math.random() * max);
}


function getPositionInitiale() {
    var nbCasesTotales = grille[0].length;
    do {
        var x1 = getRandom(nbCasesTotales);
        var y1 = getRandom(nbCasesTotales);
        if (grille[x1][y1] === 0) {
            break;
        }
    } while (true);
    return {
            x: x1,
            y: y1
        };  
}

function placeCeBateau (type, x, y) {
    grille[x][y] = 1;
    //$('#x'+x+'y'+y).html("X");
    posBateaux.push( {num:cptBateau, type:type, x:x, y:y, etat:0} );
}


function positionneCeBateau(type, pos, direction,longueur) {
    placeCeBateau(type, pos.x,pos.y);
    var x=0, y=0;
    for (var j=1;j<longueur; j++) {
        // Horizontal
        if (direction === 0) { 
                x = pos.x+j;
                y = pos.y;
        }
        // Vertical
        else {
                x = pos.x;
                y = pos.y+j;
        }
        placeCeBateau(type, x,y);
    }
    console.log("Bateau num. "+cptBateau+" de "+type+" placé de ("+pos.x+"/"+pos.y+") à ("+x+"/"+y+")");

}

function afficheLesBateaux() {
    posBateaux.forEach(function(bateau) {
        var x = bateau.x,y = bateau.y;
        var id="#x"+x+"y"+y;
        console.log(id);
        $(id).css("background-image", "url(img/touche.png)");     
    });
}



function placeUn (type) {
    var longueur=lngBateaux[type];
    var direction = getRandom(2); 
    var nbCasesTotales = grille[0].length;
    var pos = getPositionInitiale(grille);
    for (var j=1;j<longueur; j++) {
        // Horizontal
        if (direction === 0) {
            if ( ( (pos.x+j)>=nbCasesTotales) || (grille[(pos.x+j)][pos.y] !== 0) ) {
                return true;
            } 
            
        }
        // Vertical
        else {
            if ( ( (pos.y+j)>=nbCasesTotales) || (grille[pos.x][(pos.y+j)] !== 0) ) {
                return true;
            }
            
        }
    }
    positionneCeBateau(type, pos, direction, longueur);
    return false;
}


function ajouteUn(type) {
    cptBateau++;
    console.log("Ajoute un "+type+" de longueur "+ lngBateaux[type]);
    var running = true;
    while (running)
    {
        running = placeUn(type); 
    }
}


function positionnementBateaux() {
    ajouteUn(PORTEAVION);
    ajouteUn(CROISEUR);
    ajouteUn(SOUSMARIN);
    ajouteUn(SOUSMARIN);
    ajouteUn(TORPILLEUR);
    ajouteMessage('Bateaux positionnés');
    $('#nbBateaux').val(cptBateau);
}


function afficheChrono(inputChrono) {
    var end = new Date();
    var diff = end - start;
    var date = new Date(diff);
    var h = date.getHours()-1;
    if(h<10)
    {
        h = "0"+h;
    }
    var m = date.getMinutes();
    if(m<10)
    {
        m = "0"+m;
    }
    var s = date.getSeconds();
    if(s<10)
    {
        s = "0"+s;
    }
    inputChrono.val(h+':'+m+':'+s);
}


function initialisationPartie(nbCases) {

    // Efface les input
    $('#nbCoups').val(0);
    $('#temps').val("");

    // Lance le chrono
    start = new Date;
    var inputChrono = $('#temps');
    timer = window.setInterval( function()
        {
            afficheChrono(inputChrono);
        }, 1000);

    // Dessine le tableau
    var tableDocFrag = document.createDocumentFragment();
    $('tr').remove();
    for (var i=0;i<nbCases;i++) {
        var tr = $('<tr></tr>').appendTo(tableDocFrag);
        for (var j=0;j<nbCases;j++) {
            var td = $('<td></td>').attr('id','x'+j+'y'+i).addClass('cellule').on('click', function() { tir($(this)); }).appendTo(tr);
        }
    }
    $('#battle').append(tableDocFrag);

    // Initialise les variables
    posBateaux = new Array();
    cptBateau=0;
    nbCoups=0;

    // Initialise la grille
    grille = new Array(nbCases);
    for (var x = 0; x < nbCases; x++) {
        grille[x] = new Array(nbCases);
        for (var y = 0; y < nbCases; y++) {
            grille[x][y]=0;
        }
    }
    
    ajouteMessage('Partie initialisée');
}


function check(element) {
    var val = element.val();
    return (val<10 || val>20 || !$.isNumeric(val) ) ? false : true;
}

$(function(){
    $('#boutonGenerate').on('click', function(){
        if (check($('#nbCasesX'))) {
            $('#messages p').remove();            
            var input = $('#nbCasesX');
            var nbCases = input.val();
            initialisationPartie(nbCases);
            positionnementBateaux(grille);
        }
    });
    $('#boutonVoir').on('click', function(){
        finDePartie();
        afficheLesBateaux();
    });

    $('#nbCasesX').on('input',function(){
        if (check($(this))) {
            $(this).addClass('ok').removeClass('ko');
        }
        else
        {
            $(this).addClass('ko').removeClass('ok');
        }
    });

});


