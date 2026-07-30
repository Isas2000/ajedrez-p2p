import { useState } from 'react';

// props:
// - mensajes: array de { texto, autor }
// - onEnviarMensaje: función que llamas cuando TÚ escribes algo
// - temaOscuro: boolean para el estilo visual
function Chat({ mensajes = [], onEnviarMensaje, temaOscuro = false }) {
  const [texto, setTexto] = useState('');

  function enviar() {
    if (!texto.trim()) return;
    onEnviarMensaje?.(texto);
    setTexto('');
  }

  const colores = temaOscuro
    ? { fondo: '#2E2E2E', texto: '#F0F0F0', borde: '#555', inputFondo: '#3D3D3D' }
    : { fondo: '#FFFFFF', texto: '#222', borde: '#ccc', inputFondo: '#FFFFFF' };

  return (
    <div
      style={{
        width: '250px',
        border: `1px solid ${colores.borde}`,
        borderRadius: '8px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        backgroundColor: colores.fondo,
        color: colores.texto,
      }}
    >
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
        {mensajes.map((m, i) => (
          <p key={i} style={{ margin: '4px 0' }}>
            <strong>{m.autor}:</strong> {m.texto}
          </p>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '6px' }}>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enviar()}
          placeholder="Escribe un mensaje..."
          style={{
            flex: 1,
            minWidth: 0, 
            padding: '8px',
            borderRadius: '6px',
            border: `1px solid ${colores.borde}`,
            backgroundColor: colores.inputFondo,
            color: colores.texto,
          }}
        />
        <button
          onClick={enviar}
          style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', backgroundColor: '#4A4A4A', color: 'white', cursor: 'pointer' }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

export default Chat;