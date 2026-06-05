# ThingsBoard API Data Collector

## Descripción

Sistema de recolección de datos que se conecta a ThingsBoard mediante WebSocket para capturar telemetría de PLCs en tiempo real. Los datos son almacenados en PostgreSQL para su posterior uso en el entrenamiento de modelos de IA desarrollados en MatLab.

Frontend de la aplicación: [tb-front](https://github.com/marcosportales/tb-front)

## Características Principales

- Conexión WebSocket con ThingsBoard
- Captura de telemetría en tiempo real desde PLCs
- Almacenamiento automático en PostgreSQL
- Preparación de datos para modelos de IA
- Monitoreo continuo de la conexión

## Tecnologías Utilizadas

- [Javascript (NestJS)](https://docs.nestjs.com/)
- [ThingsBoard API](https://thingsboard.io/docs/)
- [PostgreSQL](https://www.postgresql.org/docs/17/index.html)
- [WebSocket NestJS API](https://docs.nestjs.com/websockets/gateways)

## Requisitos Previos

- PostgreSQL 12 o superior
- ThingsBoard (instancia configurada)
- Credenciales de acceso a ThingsBoard
- PLC configurado (o simulado) y conectado a ThingsBoard

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/marcosportales/nest-tb-api.git
```

2. Instalar dependencias usando tu gestor de paquetes preferido:

```bash
npm install
yarn install
bun install
pnpm install
```

3. Configurar variables de entorno:

```bash
cp .env.example .env
```

4. Iniciar la aplicación:

```bash
npm start:dev
```
