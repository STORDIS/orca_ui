# ORCA_UI

- [ORCA\_UI](#orca_ui)
  - [Install Dependencies](#install-dependencies)
  - [Configure Server](#configure-server)
  - [Run UI](#run-ui)
  - [Run orca\_ui in docker container](#run-orca_ui-in-docker-container)
    - [Create docker image](#create-docker-image)

## Install Dependencies
orca_ui can be started on different OSs, Followign is the example to install it on Linux:
```bash
    sudo apt-get install npm
    git clone https://github.com/STORDIS/orca_ui.git
    cd orca_ui
    npm install
```
## Configure Server
If `orca_backend` is running on a different host than the default [localhost:8000](http://localhost:8000), use the `REACT_APP_HOST_ADDR_BACKEND` env variable to set your custom `orca_backend` address.

To do this either create a `.env` file (check `.env.sample` for an example) or [set it temporarily in the shell](https://create-react-app.dev/docs/adding-custom-environment-variables/#adding-temporary-environment-variables-in-your-shell) you will use to start the UI.
For example on Linux - 
```bash
export REACT_APP_HOST_ADDR_BACKEND="http://10.10.131.6:8000"

```

## Run UI
```bash
    npm start
```

## Run orca_ui in docker container
Docker image of orca_ui can be created and container can be started as follows:
### Create docker image
First create the docker image as follows:
```bash
    cd orca_ui
    docker build -t orca_ui .
```
If docker image is to be transferred to other machine to run there, first save the image locally, transfer to desired machine and load there as follows:
```bash
    docker save -o orca_ui.tar.gz orca_ui:latest
    scp orca_ui.tar.gz <user_name>@host:<path to copy the image>
    ssh <user_name>@host
    cd <path to copy the image>
    docker load -i orca_ui.tar.gz
```
Docker container can be started as follows:
```bash
    docker run --net="host" orca_ui
```
