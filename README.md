<p align="center">
<a href="https://hub.docker.com/r/stordis/orca_ui/">
      <img alt="Docker Pulls" src="https://img.shields.io/docker/pulls/stordis/orca_ui?style=for-the-badge&logo=docker&logoColor=white&link=https%3A%2F%2Fhub.docker.com%2Fr%2Fstordis%2Forca_ui"/>
</a>
<a href="https://github.com/stordis/orca_ui/actions">
      <img alt="Tests Passing" src="https://img.shields.io/github/actions/workflow/status/stordis/orca_ui/docker-publish.yml?style=for-the-badge&logo=github&link=https%3A%2F%2Fgithub.com%2FSTORDIS%2Forca_ui%2Factions"/>
</a>
<a href="https://github.com/stordis/orca_ui/issues">
      <img alt="Issues" src="https://img.shields.io/github/issues/stordis/orca_ui?style=for-the-badge&logo=github&link=https%3A%2F%2Fgithub.com%2FSTORDIS%orca_ui%2Fissues"/>
</a>
<a href="https://github.com/stordis/orca_ui/graphs/contributors">
      <img alt="GitHub Contributors" src="https://img.shields.io/github/contributors/stordis/orca_ui?style=for-the-badge&logo=github&link=https%3A%2F%2Fgithub.com%2FSTORDIS%orca_ui%2Fgraphs%2Fcontributors"/>
</a>
<a href="https://github.com/stordis/orca_ui/pulls?q=">
      <img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/stordis/orca_ui?color=0088ff&style=for-the-badge&logo=github&link=https%3A%2F%2Fgithub.com%2FSTORDIS%orca_ui%2Fpulls"/>
</a>
<a href="https://github.com/STORDIS/orca_ui?tab=Apache-2.0-1-ov-file#readme">
      <img alt="GitHub License" src="https://img.shields.io/github/license/stordis/orca_ui?style=for-the-badge"/>
</a>
</p>


# ORCA_UI
ORCA UI is a web application that provides a user interface for interacting with [ORCA Backend](https://github.com/STORDIS/orca_backend). It is built using React. ORCA UI allows users to view the network topology, manage devices, and do various configurations.
- [ORCA\_UI](#orca_ui)
  - [Quick Start](#quick-start)
  - [Running ORCA UI from source](#running-orca-ui-from-source)
    - [Install Dependencies](#install-dependencies)
    - [Configure ORCA Server Address](#configure-orca-server-address)
    - [Run UI](#run-ui)
  - [Build and install orca\_ui docker image from source](#build-and-install-orca_ui-docker-image-from-source)
    - [Build orca\_ui docker image](#build-orca_ui-docker-image)
    - [Run orca\_ui docker container](#run-orca_ui-docker-container)

## Quick Start
ORCA UI can be started easily by just running a docker container, as follows :
        
    docker run --name orca_ui -e REACT_APP_HOST_ADDR_BACKEND="http://<orca_backend_ip:port>" --net="host" -d stordis/orca_ui:latest

To verify that container has successfully started, try to access http://<server_ip>:3000/ and log in with default user/password- admin/admin which is by default created in backend container. To know how to quick start with orca_backend refer to [ORCA Backend](https://github.com/STORDIS/orca_backend) quick start section. 

Thats it, If thats enough, rest of the steps below can be skipped and now discover your first device by clicking "Discover Network" button on the top right corner of ORCA UI. Else, refer below for more details about build and installation of ORCA UI.

## Running ORCA UI from source
To run ORCA UI from source, follow these steps:

### Install Dependencies
orca_ui can be started on different OSs, Following is the example to install it on Linux:
```bash
    sudo apt-get install npm
    git clone https://github.com/STORDIS/orca_ui.git
    cd orca_ui
    npm install
```
### Configure ORCA Server Address
If `orca_backend` is running on a different host than the default [localhost:8000](http://localhost:8000), use the `REACT_APP_HOST_ADDR_BACKEND` env variable to set your custom `orca_backend` address as follows:
    
    export REACT_APP_HOST_ADDR_BACKEND="http://<orca_backend_server_address:port>"

### Run UI
    npm start

## Build and install orca_ui docker image from source

Docker image of orca_ui can be created and container can be started as follows:
### Build orca_ui docker image
Create orca_ui docker image as follows:

    cd orca_ui
    docker build -t orca_ui .

If docker image is to be transferred to other machine to run there, first save the image locally, transfer to desired machine and load there as follows:

    docker save -o orca_ui.tar.gz orca_ui:latest
    scp orca_ui.tar.gz <user_name>@host:<path to copy the image>
    ssh <user_name>@host
    cd <path to copy the image>
    docker load -i orca_ui.tar.gz
### Run orca_ui docker container
orca_ui docker container can be started as follows:

    docker run -e REACT_APP_HOST_ADDR_BACKEND="http://<orca_backend_server_address:port>" --net="host" orca_ui
