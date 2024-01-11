# ORCA_UI
## Install Dependencies
    sudo apt-get install npm
    git clone https://github.com/STORDIS/orca_ui.git
    cd orca_ui
    npm install
## Configure Server
If orca_backend running on different host than default which is [localhost:8000](http://localhost:8000/'), configre host_addr in file [backend_rest_urls.js](src/backend_rest_urls.js)

## Run UI
    npm start