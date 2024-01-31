const express = require('express');
const fs = require('fs/promises');
const app = express();
const PORT = 3000;

let data = {
  autos: [],
  clientes: [],
};

let proximoIDCliente = 1;  

app.use(express.json());


app.get('/api/autos', (req, res) => {
  res.json(data.autos);
});


app.get('/api/autos/:id', (req, res) => {
  const auto = data.autos.find(car => car.id === parseInt(req.params.id));
  if (!auto) {
    return res.status(404).json({ mensaje: 'Auto no encontrado' });
  }
  res.json(auto);
});


app.post('/api/autos', async (req, res) => {
  const { modelo, marca, año, placas } = req.body;

  if (!modelo || !marca || !año || !placas) {
    return res.status(400).json({ mensaje: 'Todos los campos (modelo, marca, año, placas) son obligatorios' });
  }

  const nuevoAuto = { id: data.autos.length + 1, modelo, marca, año, placas };
  data.autos.push(nuevoAuto);

  await guardarDatosEnArchivo();
  
  res.json(nuevoAuto);
});




app.put('/api/autos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const autoExistente = data.autos.find(car => car.id === id);
  if (!autoExistente) {
    return res.status(404).json({ mensaje: 'Auto no encontrado' });
  }

  const indice = data.autos.indexOf(autoExistente);
  data.autos[indice] = { ...autoExistente, ...req.body };

  await guardarDatosEnArchivo();

  res.json(data.autos[indice]);
});


app.delete('/api/autos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const autoExistente = data.autos.find(car => car.id === id);
  if (!autoExistente) {
    return res.status(404).json({ mensaje: 'Auto no encontrado' });
  }

  data.autos = data.autos.filter(car => car.id !== id);

  await guardarDatosEnArchivo();

  res.json({ mensaje: 'Auto eliminado exitosamente' });
});


app.get('/api/clientes', (req, res) => {
  res.json(data.clientes);
});


app.get('/api/clientes/:id', (req, res) => {
  const cliente = data.clientes.find(client => client.id === parseInt(req.params.id));
  if (!cliente) {
    return res.status(404).json({ mensaje: 'Cliente no encontrado' });
  }
  res.json(cliente);
});

app.post('/api/clientes', async (req, res) => {
  const { nombre, usuario, direccion } = req.body;

  if (!nombre || !usuario || !direccion) {
    return res.status(400).json({ mensaje: 'Todos los campos (nombre, usuario, direccion) son obligatorios' });
  }

  const nuevoCliente = { id: proximoIDCliente++, nombre, usuario, direccion };
  data.clientes.push(nuevoCliente);

  await guardarDatosEnArchivo();
  
  res.json(nuevoCliente);
});
//http POST http://localhost:3000/api/clientes nombre="Nuevo Cliente" usuario="nuevousuario" direccion="Nueva Dirección"


// Ruta para actualizar un cliente
app.put('/api/clientes/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const clienteExistente = data.clientes.find(client => client.id === id);
  if (!clienteExistente) {
    return res.status(404).json({ mensaje: 'Cliente no encontrado' });
  }

  const indice = data.clientes.indexOf(clienteExistente);
  data.clientes[indice] = { ...clienteExistente, ...req.body };

  await guardarDatosEnArchivo();

  res.json(data.clientes[indice]);
});

// Ruta para borrar un cliente
app.delete('/api/clientes/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const clienteExistente = data.clientes.find(client => client.id === id);
  if (!clienteExistente) {
    return res.status(404).json({ mensaje: 'Cliente no encontrado' });
  }

  data.clientes = data.clientes.filter(client => client.id !== id);

  await guardarDatosEnArchivo();

  res.json({ mensaje: 'Cliente eliminado exitosamente' });
});

// Función para cargar data.json
async function cargarDatosDesdeArchivo() {
  try {
    const contenido = await fs.readFile('data.json', 'utf-8');
    data = JSON.parse(contenido);
  } catch (error) {
    console.error('Error al cargar datos desde el archivo:', error);
  }
}


async function guardarDatosEnArchivo() {
  try {
    await fs.writeFile('data.json', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error al guardar datos en el archivo:', error);
  }
}


cargarDatosDesdeArchivo().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
  });
});
