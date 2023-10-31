const express = require('express')
const router = express.Router()
const registarUserControllers = require("../controllers/registrarUserController")
const login = require('../controllers/login')
const visualizadorVehiculo = require('../controllers/visualizadorVehiculo')
const gestionarCuotaAlquiler = require("../controllers/gestion_de_cuotasAlquiler")
const { getMaxListeners } = require('nodemailer/lib/xoauth2')
const solicitarAlquilerVehiculo = require("../controllers/solicitarAlquilerVehiculo")
const devolucion = require("../controllers/devolucion")

router
    .post("/registro_cliente", registarUserControllers.postRegistrarcliente)
    .post("/registro_empleado", registarUserControllers.postRegistraEmpleado)
    .post("/login", login.postLogin)
    .post("/code", login.sendCodigo)
    .post("/agregar_vehiculo", visualizadorVehiculo.postAgregarVehiculo)
    .get("/obtener_vehiculos", visualizadorVehiculo.getObtenerVehiculos)
    .get("/obtener_vehiculos_disponibles", visualizadorVehiculo.getObtenerVehiculosDisponibles)
    .post("/modificar_cuota_vehiculo",gestionarCuotaAlquiler.postUpdateCuotaVehiculos)
    .post("/modificar_cuota_vehiculo_marca",gestionarCuotaAlquiler.postUpdateCuotaVehiculoMarca)
    .post("/modificar_cuota_vehiculo_categoria",gestionarCuotaAlquiler.postUpdateCuotaVehiculoCategoria)
    .post("/modificar_cuota_vehiculo_ambos", gestionarCuotaAlquiler.postUpdateCuotaVehiculoAmbos)
    .post("/solicitar_alquiler", solicitarAlquilerVehiculo.postSolicitarAlquiler)
    .get("/devolucion/:id",devolucion.getObtenerVehiculosDevolver)
module.exports = router