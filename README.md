# react-redux-practice
learn how to use redux with react

# Requirements
You must have docker installed.
To set up SSL using script you will need a bash environment.

# Run
start: from containers/prod run "docker-compose up -d"
stop: from containers/prod run "docker-compose down"

# Development
__Run__:
start: from containers/dev run "docker-compose up -d"
stop: from containers/dev run "docker-compose down"

__Setup__:
* create new repo
* setup project by running "./aspnet-react-redux-setup.sh"

__SSL__:
See generate-cert script. Essentially the script makes yourself a certificate authority (CA) and generates certificates from that authority. Then you can add the CA certificate to your browser SSL certificate authorities.
* run "generate-cert chat devCA ~/CA/" in certificates directory
* add the generated devCA certificate in ~/CA/ to the browser