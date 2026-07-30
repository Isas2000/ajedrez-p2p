import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

// props que tu amigo va a usar para conectar el P2P:
// - miColor: 'white' o 'black' (se lo pasa él, ya coordinado por PeerJS)
// - onEnviarMovimiento: función que llamas cuando TÚ mueves, para que él lo mande por P2P
// - movimientoRecibido: el último movimiento que llegó del rival (objeto { from, to })
// - temaOscuro: boolean para elegir el diseño
function Tablero({ miColor = 'white', onEnviarMovimiento, movimientoRecibido, temaOscuro = false }) {
  const [game, setGame] = useState(new Chess());

  // Cuando llega un movimiento del rival por P2P, lo aplicamos aquí
  useEffect(() => {
    if (!movimientoRecibido) return;
    const gameCopy = new Chess(game.fen());
    gameCopy.move(movimientoRecibido);
    setGame(gameCopy);
  }, [movimientoRecibido]);

  function onDrop({ sourceSquare, targetSquare }) {
    // No dejamos mover piezas del rival
    const turno = game.turn() === 'w' ? 'white' : 'black';
    if (turno !== miColor) return false;

    const gameCopy = new Chess(game.fen());
    const move = gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
    if (move === null) return false;

    setGame(gameCopy);
    onEnviarMovimiento?.({ from: sourceSquare, to: targetSquare, promotion: 'q' });
    return true;
  }

  const estilos = temaOscuro
    ? { darkSquareStyle: { backgroundColor: '#4A4A4A' }, lightSquareStyle: { backgroundColor: '#7A7A7A' } }
    : { darkSquareStyle: { backgroundColor: '#B58863' }, lightSquareStyle: { backgroundColor: '#F0D9B5' } };

  const chessboardOptions = {
    position: game.fen(),
    onPieceDrop: onDrop,
    boardOrientation: miColor,
    ...estilos,
  };

  return <Chessboard options={chessboardOptions} />;
}

export default Tablero;