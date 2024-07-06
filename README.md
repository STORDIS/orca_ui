<p align="center">
<a href="https://hub.docker.com/r/stordis/orca_ui/">
      <img alt="Docker Pulls" src="https://img.shields.io/docker/pulls/stordis/orca_ui?style=for-the-badge&logo=docker&logoColor=white&link=https%3A%2F%2Fhub.docker.com%2Fr%2Fstordis%2Forca_ui" />
    </a>
<a href="https://github.com/stordis/orca_ui/actions">
      <img alt="Tests Passing" src="https://img.shields.io/github/actions/workflow/status/stordis/orca_ui/docker-publish.yml?style=for-the-badge&logo=github&link=https%3A%2F%2Fgithub.com%2FSTORDIS%2Forca_ui%2Factions
      " />
</a>
<a href="https://github.com/stordis/orca_ui/issues">
      <img alt="Issues" src="https://img.shields.io/github/issues/stordis/orca_ui?style=for-the-badge&logo=github&link=https%3A%2F%2Fgithub.com%2FSTORDIS%orca_ui%2Fissues
      " />
</a>
<a href="https://github.com/stordis/orca_ui/graphs/contributors">
      <img alt="GitHub Contributors" src="https://img.shields.io/github/contributors/stordis/orca_ui?style=for-the-badge&logo=github&link=https%3A%2F%2Fgithub.com%2FSTORDIS%orca_ui%2Fgraphs%2Fcontributors" />
</a>
<a href="https://github.com/stordis/orca_ui/pulls?q=">
      <img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/stordis/orca_ui?color=0088ff&style=for-the-badge&logo=github&link=https%3A%2F%2Fgithub.com%2FSTORDIS%orca_ui%2Fpulls" />
</a>
</p>


# ORCA_UI

- [ORCA\_UI](#orca_ui)
  - [Install Dependencies](#install-dependencies)
  - [Configure ORCA Server Address](#configure-orca-server-address)
  - [Run UI](#run-ui)
  - [Run orca\_ui in docker container](#run-orca_ui-in-docker-container)
    - [Create docker image](#create-docker-image)

## Install Dependencies
orca_ui can be started on different OSs, Following is the example to install it on Linux:
```bash
    sudo apt-get install npm
    git clone https://github.com/STORDIS/orca_ui.git
    cd orca_ui
    npm install
```
## Configure ORCA Server Address
If `orca_backend` is running on a different host than the default [localhost:8000](http://localhost:8000), use the `REACT_APP_HOST_ADDR_BACKEND` env variable to set your custom `orca_backend` address as follows:
    
    export REACT_APP_HOST_ADDR_BACKEND="http://<orca_backend_server_address:port>"

## Run UI
    npm start

## Run orca_ui in docker container
Docker image of orca_ui can be created and container can be started as follows:
### Create docker image
First create the docker image as follows:

    cd orca_ui
    docker build -t orca_ui .

If docker image is to be transferred to other machine to run there, first save the image locally, transfer to desired machine and load there as follows:

    docker save -o orca_ui.tar.gz orca_ui:latest
    scp orca_ui.tar.gz <user_name>@host:<path to copy the image>
    ssh <user_name>@host
    cd <path to copy the image>
    docker load -i orca_ui.tar.gz
Docker container can be started as follows:

    docker run -e REACT_APP_HOST_ADDR_BACKEND="http://<orca_backend_server_address:port>" --net="host" orca_ui
