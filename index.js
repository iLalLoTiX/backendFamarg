
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const {dbConnection} = require('./database/config');

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use(cors());

//Lectura y parseo del body
app.use(express.json());

dbConnection();

// RUTAS
app.use('/api/usuarios'         ,   require('./routes/usuariosRts'));
app.use('/api/login'            ,   require('./routes/authRts'));
app.use('/api/cajas'            ,   require('./routes/cajasRts'));
app.use('/api/empleados'        ,   require('./routes/empleadosRts'));
app.use('/api/departamentos'    ,   require('./routes/departamentosRts'));
app.use('/api/cargar'           ,   require('./routes/cargarRts'));
app.use('/api/entradaCajas'     ,   require('./routes/entradasCajasRts'));
app.use('/api/contactos'        ,   require('./routes/contactosRts'));
app.use('/api/productos'        ,   require('./routes/productosRts'));
app.use('/api/entradaProveedor' ,   require('./routes/entradaProveedorRts'));
app.use('/api/ordenes'          ,   require('./routes/ordenesRts'));

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto: ' + process.env.PORT);
});

/*
    papulate
    agregates
    token
    indexaciones
    C:\Users\FAMARG-PC4\Downloads\2020_07_01-2020_07_31 tquelleno.xls
*/

// var XLSX = require('xlsx');

// const ExcelAJSON = () =>{

//     const excel = XLSX.readFile(
//         "C:\\Users\\FAMARG-PC4\\Downloads\\uwu.xlsx"
//     );
//     var nombreHoja = excel.SheetNames;
//     let datos = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[0]]);

//     const jDatos = [];

//     for(let i= 0; i< datos.length; i++){
//         const dato = datos[i];
//         const Fecha = formatearFechaExcel(dato.Fecha);

//         datos[i].Fecha = Fecha;

//         jDatos.push({
//             Fecha
//         });
//     }

//     for(let x=0; x<datos.length; x++){
//         for(let z=0; z<datos.length; z++){
//             if(datos[x].Fecha == jDatos[z].Fecha){
//                 console.log(true);
//             }
//         }
//         console.log('------------');
//     }
// }

// function formatearFechaExcel(fechaExcel) {
//     var diasUTC = Math.floor(fechaExcel - 25569);
//     var valorUTC = diasUTC * 86400;
//     var infoFecha = new Date(valorUTC * 1000);
//     infoFecha = sumarDias(infoFecha, +1);
//     // Convertidos a 2 dígitos
//     var dia = ('0' + infoFecha.getDate()).slice(-2);
//     var mes = ('0' + (infoFecha.getMonth() + 1)).slice(-2);
//     var anio = infoFecha.getFullYear();
  
//     var fecha = `${dia}/${mes}/${anio}`;

//     return fecha;
//   }

// function sumarDias(fecha, dias){
//     fecha.setDate(fecha.getDate() + dias);
//     return fecha;
//   }

// ExcelAJSON();