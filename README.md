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
git clone https://github.com/your-username/smartcar-api.git
cd smartcar-api
npm install
```

## 🚀 Usage

Run the application in development mode with hot reloading (nodemon):

```bash
npm run dev
```

The API will start at:

```bash
http://localhost:3000
```

---

## 🏭 Production

Run the application in production mode:

```bash
npm start
```

By default, the server runs on port 3000.
You can override this by setting the PORT environment variable:

```bash
PORT=4000 npm start
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

## 📖 API Documentation (Swagger/OpenAPI)

This project includes an OpenAPI 3.0 spec (openapi.yml).

- View in Swagger Editor
- Use a VS Code Extension to view the openapi.yml content

---

## 📂 Project Structure

```bash
src/
  controllers/       # Route controllers
  services/          # External MM API service calls
  utils/logger.js    # Winston logger config
  app.js             # Express app setup
  server.js          # Entry point
tests/               # Mocha/Chai/Sinon unit tests
openapi.yml          # API specification
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
