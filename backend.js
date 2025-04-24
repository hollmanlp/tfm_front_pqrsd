const express = require('express');
const cors = require('cors'); // Habilita CORS
const app = express();
const port = 3000;

const whiteList=['http://localhost:4200','...'];
app.use(cors({origin: whiteList})); // Habilita CORS para todas las rutas

const paises = [
  { id: 'ef172dfd-dcb0-45df-80c6-3998cc6fd1cf', nombre: 'Colombia' },
  { id: 'c79c6a9c-6a92-402f-9f87-da9ee8a1bbcc', nombre: 'México' },
  { id: '2085149d-638f-4145-b90e-26dd065070a3', nombre: 'España' },
  { id: 'aaccf29b-bcfd-428f-8f2d-3bc37ea365f2', nombre: 'Myanmar' },
];

app.get('/pais/listaseleccion', (req, res) => {
  res.json(paises);
});

const tiposdocumento = [
  { id: '1da3e2fb-af3a-43ab-8437-c0651ee4c6bc', nombre: 'Pasaporte' },
  { id: '229daecb-8361-4730-9376-3d14ae2cb03d', nombre: 'Número Único de Identificación Personal' },
  { id: '344e8fb5-3d84-4971-96ed-9033dc37f324', nombre: 'Cédula de Ciudadanía' },
  { id: '5c23f5a8-ed91-4afd-be5d-f644d0846736', nombre: 'Cédula de Extranjería' },
  { id: 'cfc2f53e-91f1-42d3-90a3-6ffb27fcc785', nombre: 'Número de Identificación Tributario' }
];

app.get('/tipodocumento/listaseleccion', (req, res) => {
  res.json(tiposdocumento);
});

const tramite = [
  { nombre: 'Petición', descripcion: 'Solicitud verbal o escrita que presenta una persona natural o jurídica ante nosotros por los canales dispuestos para tal fin.', dias: 15 },
  { nombre: 'Queja', descripcion: 'Es la manifestación de inconformidad por parte de una persona natural o jurídica, generada por el comportamiento en la atención a los mismos, ya sea de carácter administrativa o por presuntas conductas no deseables de nuestros colaboradores.', dias: 15},
  { nombre: 'Consulta', descripcion: 'Solicitud mediante la cual se nos solicita un concepto sobre un caso o asunto de su competencia.', dias: 30 },
  { nombre: 'Petición de congresistas', descripcion: 'Solicitudes de información que presentan los Congresistas, amparados la Ley 5 de 1992 - Normativa del Congreso de la República, a funcionarios del Gobierno Nacional.', dias: 5 }
];

app.get('/tramite/homepqrsd', (req, res) => {
  res.json(tramite);
});

const mimes = [
  { mime: 'application/pdf', extension: 'pdf' },
  { mime: 'image/png', extension: 'png' },
  { mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', extension: 'docx' },
  { mime: 'application/vnd.oasis.opendocument.text', extension: 'odt' }
];

app.get('/formato/pqrsd', (req, res) => {
  res.json(mimes);
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});