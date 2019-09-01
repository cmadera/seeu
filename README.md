# Overview

# Install

## Environment
## Ubuntu Alias ##
vi .bashrc
```
alias get='sudo apt-get install -y'
alias df='df -h'
alias ls='ls -la'
alias upgrade='sudo apt-get update -y && sudo apt-get upgrade -y'
alias cdwww='cd /var/www/html'
alias myip='curl ifconfig.me'
```
get curl

## CentOS Alias ##
vi .bashrc
```
alias get='sudo yum install -y'
alias df='df -h'
alias ls='ls -la'
alias upgrade='sudo yum update -y'
alias cdwww='cd /var/www/html'
alias myip='curl ifconfig.me'
```
get curl

### Get Dev
```
  get nodejs
  get git
  get npm
  get code
```
### Get SeeU
```
  cd ~
  mkdir dev
  cd ~/dev
  git clone https://github.com/cmadera/seeu.git
  git config --global user.email "user@gmail.com"
  git config --global user.name "User name"
  git commit -a
  git push origin master
```
### Firebase
```
  // Firebase local install 
  sudo npm install -g firebase-tools
  sudo npm install -g firebase-functions
  sudo npm install -g firebase-admin

  // Deploy
  firebase deploy --only hosting

  // Server emulator
  firebase serve --only hosting
```
## CRUDs
``` 
Things
Types
Attribute
Config
``` 

## Admin
### Reports
Users

## TODO
``` 
- Realtime monitoring based on things CRUD
``` 
