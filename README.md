# ORCA_UI
## Install Dependencies
    sudo apt-get install npm
    git clone https://github.com/STORDIS/orca_ui.git
    cd orca_ui
    npm install
## Configure Server
If `orca_backend` is running on a different host than the default [localhost:8000](http://localhost:8000), use the `REACT_APP_HOST_ADDR_BACKEND` env variable to set your custom host address of the backend.

To do this either create a `.env` file (check `.env.sample` for an example) or [set it temporarily in the shell](https://create-react-app.dev/docs/adding-custom-environment-variables/#adding-temporary-environment-variables-in-your-shell) you will use to start the UI. 

## Run UI
    npm start