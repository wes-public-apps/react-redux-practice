# !/bin/bash

npx create-react-app chat-client --template typescript
cd chat-client
npm install redux react-redux
npm install --save-dev @types/redux @types/react-redux
cd ..
dotnet new web -o chat-server
mkdir containers
mkdir certificates
cd containers
mkdir containers/dev
mkdir containers/prod
cd ../certificates
generate-cert.sh chat-server
generate-cert.sh chat-client
