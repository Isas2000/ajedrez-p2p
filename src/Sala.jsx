import { useState } from 'react';

// props:
// - onCrearSala: función que llamas cuando el usuario elige "crear sala"
// - onUnirseSala: función que llamas con el código ingresado, cuando elige "unirse"
// - codigoGenerado: el código de sala (lo genera el código de tu amigo con PeerJS). null mientras se genera.
function Sala({ onCrearSala, onUnirseSala, codigoGenerado }) {
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [modo, setModo] = useState(null); // null | 'crear' | 'unirse'
  const [copiado, setCopiado] = useState(false);

  function copiarCodigo() {
    navigator.clipboard.writeText(codigoGenerado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', textAlign: 'center' }}>
      <h2>Ajedrez P2P</h2>

      {modo === null && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
          <button onClick={() => { setModo('crear'); onCrearSala?.(); }} style={estiloBoton}>
            Crear sala (jugaré con blancas)
          </button>
          <button onClick={() => setModo('unirse')} style={estiloBoton}>
            Unirme a una sala (jugaré con negras)
          </button>
        </div>
      )}

      {modo === 'crear' && (
        <div style={{ marginTop: '20px' }}>
          {!codigoGenerado ? (
            <p>Generando código de sala...</p>
          ) : (
            <>
              <p>Comparte este código con tu amigo:</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  readOnly
                  value={codigoGenerado}
                  style={{ flex: 1, minWidth: 0, padding: '10px', borderRadius: '6px', border: '1px solid #ccc', textAlign: 'center' }}
                />
                <button onClick={copiarCodigo} style={estiloBoton}>
                  {copiado ? 'Copiado ✓' : 'Copiar'}
                </button>
              </div>
              <p style={{ marginTop: '12px', color: '#888' }}>Esperando a que tu amigo se conecte...</p>
            </>
          )}
        </div>
      )}

      {modo === 'unirse' && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
          <input
            value={codigoIngresado}
            onChange={(e) => setCodigoIngresado(e.target.value)}
            placeholder="Pega el código de la sala"
            style={{ flex: 1, minWidth: 0, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <button onClick={() => onUnirseSala?.(codigoIngresado)} style={estiloBoton}>
            Conectar
          </button>
        </div>
      )}
    </div>
  );
}

const estiloBoton = {
  padding: '12px 16px',
  fontSize: '15px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#4A4A4A',
  color: 'white',
  cursor: 'pointer',
};

export default Sala;