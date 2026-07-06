#!/bin/bash

# IDEAL Service & Appointment Management Platform Startup Script
echo "=========================================================="
echo "Starting IDEAL Platform dev servers..."
echo "=========================================================="

# Determine project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$PROJECT_DIR/app"
BACKEND_DIR="$PROJECT_DIR/backend"

# Start Backend
if [ -d "$BACKEND_DIR" ]; then
  echo "Starting Spring Boot backend..."
  cd "$BACKEND_DIR" || exit 1
  export JAVA_HOME=/home/sak/.vscode/extensions/redhat.java-1.54.0-linux-x64/jre/21.0.10-linux-x86_64
  export PATH=$JAVA_HOME/bin:$PATH
  ./mvnw spring-boot:run &
  BACKEND_PID=$!
else
  echo "Warning: Backend directory not found at $BACKEND_DIR"
fi

if [ ! -d "$APP_DIR" ]; then
  echo "Error: Next.js app directory not found at $APP_DIR"
  if [ -n "$BACKEND_PID" ]; then kill $BACKEND_PID; fi
  exit 1
fi

cd "$APP_DIR" || exit 1

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies first..."
  npm install
fi

echo ""
echo "Access the web pages at:"
echo "  - Landing / Welcome Page: http://localhost:3000"
echo "  - Login Page:             http://localhost:3000/login"
echo "  - Register Page:          http://localhost:3000/register"
echo "  - Provider Dashboard:     http://localhost:3000/dashboard"
echo "  - Customer Booking:       http://localhost:3000/booking"
echo "  - Payment Checkout:       http://localhost:3000/payment"
echo ""
echo "Press Ctrl+C to stop both frontend and backend servers."
echo "=========================================================="

# Cleanup function to kill backend when script exits
cleanup() {
  echo -e "\nStopping servers..."
  if [ -n "$BACKEND_PID" ]; then
    kill $BACKEND_PID 2>/dev/null
  fi
  exit 0
}

trap cleanup INT TERM EXIT

npm run dev
