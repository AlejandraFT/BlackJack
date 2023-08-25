const miJuego = (()=>{

    'use strict'

    let deck         = [];
    const tipos      = ['C','D','H','S'];
    const especiales = ['A','J','Q','K'];

    let puntosJugadores = [];

    const btnPedir   = document.querySelector('#btnPedir');
    const btnDetener = document.querySelector('#btnDetener');
    const btnNuevo   = document.querySelector('#btnNuevo');

    const divCartasJugadores = document.querySelectorAll('.cartas');
    const puntosHTML = document.querySelectorAll('small');

    const inicializarJuego = ( numJugadores = 2 ) => {
        deck = crearDeck(); 
        puntosJugadores = [];

        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
            puntosHTML[i].innerText = 0;
            divCartasJugadores[i].innerHTML = '';
        }
        btnPedir.disabled   = false;
        btnDetener.disabled = false;
    }

    const crearDeck = () => {
        deck = [];
        tipos.forEach(carta => {
            for( let i = 2; i <= 10; i++ ) {
                deck.push(i + carta);
            }
            for( let i = 0; i < especiales.length; i++ ) {
                deck.push(especiales[i] + carta);
            }
        });
        return _.shuffle( deck );
    }

    const pedirCarta = () => {
        if ( deck.length === 0 ) throw 'No hay cartas en el deck';
        return deck.pop();
    }

    const valorCarta = ( carta ) => {
        const valor = carta.substring(0, carta.length - 1);
        return ( isNaN( valor ) ) ? ( valor === 'A' ) ? 11 : 10 : valor * 1;
    }

    const acumularPuntosJugador = (carta, turno) =>{
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta( carta );
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return  puntosJugadores[turno]; 
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${ carta }.png`; 
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append( imgCarta );
    }

    const determinarGanador = () => {
        const [ puntosMinimos, puntosComputadora ] = puntosJugadores;
        setTimeout(() => {
            if( puntosComputadora === puntosMinimos ) {
                alert('Nadie gana :(');
            } else if ( puntosMinimos > 21 ) {
                alert('Computadora gana')
            } else if( puntosComputadora > 21 ) {
                alert('Jugador Gana');
            } else {
                alert('Computadora Gana')
            }
        }, 100 );
    }

    const turnoComputadora = ( puntosMinimos ) => {
        let puntosComputadora = 0;
        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntosJugador(carta, puntosJugadores.length -1);
            crearCarta(carta, puntosJugadores.length -1);

        } while(  (puntosComputadora < puntosMinimos)  && (puntosMinimos <= 21 ) );
        determinarGanador();
    }



    // Eventos

    btnPedir.addEventListener('click', () => {

        const carta = pedirCarta();
        const puntosJugador = acumularPuntosJugador(carta, 0);
        crearCarta(carta, 0);

        if ( puntosJugadores[0] > 21 ) {
            console.warn('Lo siento mucho, perdiste');
            btnPedir.disabled   = true;
            btnDetener.disabled = true;
            turnoComputadora( puntosJugadores[0] );

        } else if ( puntosJugadores[0] === 21 ) {
            console.warn('21, genial!');
            btnPedir.disabled   = true;
            btnDetener.disabled = true;
            turnoComputadora( puntosJugadores[0] );
        }

    });


    btnDetener.addEventListener('click', () => {
        btnPedir.disabled   = true;
        btnDetener.disabled = true;

        turnoComputadora( puntosJugadores[0] );
    });

    btnNuevo.addEventListener('click', () => {
        inicializarJuego();
    });


    return {
        inicializarJuego
    }

})();