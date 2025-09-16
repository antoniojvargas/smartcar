# smartcar# 🚗 Smartcar API

A Node.js + Express implementation of a **Smartcar-like API** that provides vehicle information, security status, fuel/battery levels, and engine control.  
The project follows clean architecture principles with controllers, services, and logging integration.

---

## 📑 Features

- **Vehicle Info** → `GET /vehicles/:id`
- **Door Security Status** → `GET /vehicles/:id/doors`
- **Fuel Level** → `GET /vehicles/:id/fuel`
- **Battery Level** → `GET /vehicles/:id/battery`
- **Start/Stop Engine** → `POST /vehicles/:id/engine`
- Structured **logging** using [winston](https://github.com/winstonjs/winston).
- Unit tests with **Mocha + Chai + Sinon**.
- API documentation via **OpenAPI (Swagger)**.

---

## ⚙️ Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/antoniojvargas/smartcar.git
cd smartcar
```

## 🐳 Running with Docker

This project is containerized using Docker Compose.
No need to install Node.js locally — just run:

```bash
docker-compose up -d --build
```

This will:

* Build the smartcar image

* Start the container in development mode (nodemon)

* Expose the API on http://localhost:3000

To stop the container:

```bash
docker-compose down
```

---

## 🧪 Testing

Run the unit tests with Mocha + Chai + Sinon:

```bash
npm test
```

The test suite includes:

- ✅ Happy path responses

- ❌ Error handling (bad input, failed API responses)

- ⚡ Edge cases (incomplete/malformed data)

## 📘 API Endpoints

Vehicle Info

GET /vehicles/:id

Example

```bash
curl -X GET http://localhost:3000/vehicles/1234
```

Response

```json
{
  "vin": "1213231",
  "color": "Metallic Silver",
  "doorCount": 4,
  "driveTrain": "v8"
}
```

---

Security (Doors)

GET /vehicles/:id/doors

Example

```bash
curl -X GET http://localhost:3000/vehicles/1234/doors
```

Response

```json
[
  { "location": "frontLeft", "locked": true },
  { "location": "frontRight", "locked": true },
  { "location": "backLeft", "locked": true },
  { "location": "backRight", "locked": false }
]
```

---

Fuel Range

GET /vehicles/:id/fuel

Example

```bash
curl -X GET http://localhost:3000/vehicles/1234/fuel
```

Response

```json
{ "percent": 30.2 }
```

---

Battery Range

GET /vehicles/:id/battery

Example

```bash
curl -X GET http://localhost:3000/vehicles/1234/battery
```

Response

```json
{ "percent": 50.3 }
```

---

Start/Stop Engine

POST /vehicles/:id/engine
Content-Type: application/json

Example

```bash
curl -X POST http://localhost:3000/vehicles/1234/engine \
  -H "Content-Type: application/json" \
  -d '{"action":"START"}'
```

Response

```json
{ "status": "success" }
```

---

## 📖 📖 Interactive API Documentation (Swagger UI)

You can explore and test all endpoints using the built-in Swagger UI:

➡️ http://localhost:3000/api-docs

This interactive documentation is automatically generated from the openapi.yml specification.

---

## 📂 Project Structure

```bash
src/
  controllers/        # Route controllers (handle incoming HTTP requests and responses)
  doc/                # API documentation files (e.g. OpenAPI/Swagger specs, markdown docs)
  errors/             # Custom error classes (ValidationError, NotFoundError, etc.)
  middleware/         # Express middleware (validation, sanitization, logging, etc.)
  providers/          # External API providers (e.g. MM API integration layer)
  routes/             # Express route definitions (map endpoints to controllers)
  schemas/            # Joi schemas and validation logic
  services/           # Business logic and data transformation (calls providers)
  utils/logger.js     # Winston logger configuration and setup
  app.js              # Express app setup (middleware, routes, error handling)
  server.js           # Application entry point (starts the HTTP server)
tests/                # Unit tests
```

---

## 📝 Logging

Logging is handled by Winston:

- info → normal requests

- warn → API/data issues

- error → unexpected failures

Logs are printed to the console, and can be extended to files or external monitoring services.

---

## 📜 License

MIT License. Free to use and modify.
