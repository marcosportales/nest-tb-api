# ThingsBoard Data Collector

## Descripción
Sistema de recolección de datos que se conecta a ThingsBoard mediante WebSocket para capturar telemetría de PLCs en tiempo real. Los datos son almacenados en PostgreSQL para su posterior uso en el entrenamiento de modelos de IA desarrollados en MatLab.

## Características Principales
- Conexión WebSocket con ThingsBoard
- Captura de telemetría en tiempo real desde PLCs
- Almacenamiento automático en PostgreSQL
- Preparación de datos para modelos de IA
- Monitoreo continuo de la conexión

## Tecnologías Utilizadas
- Python
- ThingsBoard
- PostgreSQL
- WebSocket
- MatLab (para el procesamiento posterior de datos)

## Requisitos Previos
- Python 3.8 o superior
- PostgreSQL 12 o superior
- ThingsBoard (instancia configurada)
- Credenciales de acceso a ThingsBoard
- PLC configurado y conectado a ThingsBoard

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/thingsboard-data-collector.git
```

2. Instalar dependencias:
```bash

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Iniciar la aplicación:
```bash
npm start:dev
```