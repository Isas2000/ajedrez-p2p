import { useState } from 'react';
import Sala from './Sala';
import Tablero from './Tablero';
import Chat from './Chat';
import ModalConfirmar from './ModalConfirmar';

function App() {
  const [pantalla, setPantalla] = useState('sala');
  const [miColor, setMiColor] = useState(null);
  const [codigoGenerado, setCodigoGenerado] = useState(null);
  const [temaOscuro, setTemaOscuro] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [mostrarModalSalir, setMostrarModalSalir] = useState(false);

  function crearSala() {
    setMiColor('white');
    setTimeout(() => setCodigoGenerado('abc123-simulado'), 1000);
    // SIMULACIÓN: asumimos que el amigo se conecta 2s después de generar el código.
    // Tu amigo reemplazará esto por peer.on('connection', () => setPantalla('juego'))
    setTimeout(() => setPantalla('juego'), 3000);
  }

  function unirseSala(codigo) {
    setMiColor('black');
    setPantalla('juego');
  }

  function confirmarSalida() {
    setMostrarModalSalir(false);
    setPantalla('sala');
    setMiColor(null);
    setCodigoGenerado(null);
    setMensajes([]);
    // Aquí tu amigo cerraría la conexión P2P: conexion.close()
  }

  if (pantalla === 'sala') {
    return <Sala onCrearSala={crearSala} onUnirseSala={unirseSala} codigoGenerado={codigoGenerado} />;
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Ajedrez P2P</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '10px 0 20px' }}>
        <button onClick={() => setTemaOscuro(!temaOscuro)} style={estiloBoton}>
          Cambiar tema
        </button>
        <button onClick={() => setMostrarModalSalir(true)} style={{ ...estiloBoton, backgroundColor: '#B03A2E' }}>
          Salir de la partida
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <div style={{ maxWidth: '500px', width: '100%' }}>
          <Tablero miColor={miColor} temaOscuro={temaOscuro} />
        </div>
        <Chat mensajes={mensajes} onEnviarMensaje={(t) => setMensajes(p => [...p, { texto: t, autor: 'yo' }])} temaOscuro={temaOscuro} />
      </div>

      <ModalConfirmar
        visible={mostrarModalSalir}
        mensaje="¿Estás seguro de salir de la partida? Si te sales se concluirá como terminada."
        onAceptar={confirmarSalida}
        onCancelar={() => setMostrarModalSalir(false)}
      />
    </div>
  );
}

const estiloBoton = {
  padding: '10px 20px',
  fontSize: '16px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#4A4A4A',
  color: 'white',
  cursor: 'pointer',
};

export default App;