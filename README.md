# Overview

# Install

## Environment

### Visual Studio Code
https://code.visualstudio.com/

### Node Js
https://nodejs.org/en/download/

### Git
https://git-scm.com/download/gui/
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
  npm install -g firebase-tools

  // Deploy
  firebase deploy --only hosting

  // Server emulator
  firebase serve --only hosting
```
# seeu

## Referentials
### Things
### Users
### Places
### Things types

## Integrations
```
 Users have Things
 Users use Devices
 Things are monitored
 Things types have properties
 Properties have unit measures
 Properties have valid values
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
- On/off on the same screen
- Use connection status to allow on/off
- Update Device Status after on/off
- Realtime monitoring based on things CRUD
``` 
