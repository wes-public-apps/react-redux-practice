# !/bin/bash

# This script is meant to initialize a custom secure project that uses an ASP.NET backend, React on Typescript frontend, and runs on docker.

AppName=$1

#Create React Client
npx create-react-app $AppName-client --template typescript
cd $AppName-client
npm install redux react-redux
npm install --save-dev @types/redux @types/react-redux        #add redux
npm install @microsoft/signalr @types/node                    #add signalr
npm install @azure/msal-browser                               #add azure ad

#Create ASP.NET Backend
cd ..
dotnet new web -o $AppName-server
cd $AppName-server
cat << EOF >> .gitignore
#Binary files
[Oo]bj/
[Bb]in/
EOF
cd ..

#Set up SSL
mkdir certificates
cat << EOF >> .gitignore
#SSL Files
[Cc]ertificates/
EOF
cd certificates
../generate-cert $AppName devCA ~/CA/ #see generate-cert script
cd ..

#Set up docker
mkdir containers
mkdir containers/dev
mkdir containers/prod
>containers/dev/docker-compose.yml cat << EOF
services:
  client:
    image: node:latest
    working_dir: /client
    volumes: 
      - ../../certificates:/https:ro
      - ../../$AppName-client:/client
    env_file: 
      - client.env
    command: ["npm","start"]
    networks:
      webapp:
        ipv4_address: 172.20.0.3

  server:
    image: mcr.microsoft.com/dotnet/sdk:5.0
    working_dir: /server
    env_file:
      - server.env
    volumes:
      - ../../certificates:/https:ro
      - ../../$AppName-server:/server
    command: ["dotnet","watch","run"]
    networks:
      webapp:
        ipv4_address: 172.20.0.2

networks:
  webapp:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
          gateway: 172.20.0.1
EOF
>containers/dev/client.env cat <<-EOF
#Applciation
PORT=443
BACKEND_URL=https://172.20.0.2:44351

#SSL
HTTPS=true
SSL_CRT_FILE=/https/$AppName.crt
SSL_KEY_FILE=/https/$AppName.key
EOF
>containers/dev/server.env cat <<-EOF
ASPNETCORE_ENVIRONMENT=Development

#Project
ASPNETCORE_URLS=https://+:44351;http://+:8051
FRONTEND_LOCATION=https://172.20.0.3

#SSL
ASPNETCORE_Kestrel__Certificates__Default__Path=/https/$AppName.crt
ASPNETCORE_Kestrel__Certificates__Default__KeyPath=/https/$AppName.key
EOF

#Add Design Document Location
mkdir design
