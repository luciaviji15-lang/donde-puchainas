
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Coordenadas reales con margen amplio de tolerancia (±80 píxeles)
const characterLocations = {

  "Susanita": { 
    minX: 175 - 80, maxX: 175 + 80,  
    minY: 370 - 80, maxY: 370 + 80   
  },
  "Las_tetonas": { 
    minX: 758 - 80, maxX: 758 + 80,  
    minY: 356 - 80, maxY: 356 + 80   
  },
  "cinema": { 
    minX: 430 - 80, maxX: 430 + 80,  
    minY: 976 - 80, maxY: 976 + 80 
  },
  "melendi_prime": { 
    minX: 259 - 80, maxX: 259 + 80,    
    minY: 936 - 80, maxY: 936 + 80 
  },
  "hartura": { 
    minX: 51 - 80, maxX: 51 + 80,  
    minY: 1320 - 80, maxY: 1320 + 80 
  },
  "jonni_la_conozco": { 
    minX: 262 - 80, maxX: 262 + 80,  
    minY: 1687 - 80, maxY: 1687 + 80 
  },
  "perruqueria": { 
    minX: 375 - 80, maxX: 375 + 80,  
    minY: 1539 - 80, maxY: 1539 + 80 
  },
  "sir_Sergio":{
    minX: 979 - 80, maxX: 979 + 80,  
    minY: 1722 - 80, maxY: 1722 + 80 
  }
};

// Ruta única y limpia de verificación
app.post('/api/verify', (req, res) => {
  const { character, x, y } = req.body;
  
  console.log(`\n--- Nueva validación ---`);
  console.log(`Personaje buscado: ${character}`);
  console.log(`Coordenadas recibidas: X=${x}, Y=${y}`);

  const target = characterLocations[character];

  if (!target) {
    console.log(`-> Error: Personaje no válido`);
    return res.status(400).json({ success: false, message: "Personaje no válido" });
  }

  const isCorrect = 
    x >= target.minX && x <= target.maxX && 
    y >= target.minY && y <= target.maxY;

  if (isCorrect) {
    console.log(`-> Resultado: ¡ACERTADO!`);
    return res.json({ success: true, message: "¡Encontrado!" }); // <-- ¡Corregido (res.json)!
  } else {
    console.log(`-> Resultado: Fallado (Fuera de rango)`);
    return res.json({ success: false, message: "Has fallado." });
  }
});

app.listen(3000, () => {
  console.log('Servidor backend corriendo en http://localhost:3000');
});