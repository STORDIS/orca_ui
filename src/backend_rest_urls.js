const host_addr = process.env.REACT_APP_HOST_ADDR_BACKEND || 'http://localhost:8000';

export function getAllDevicesURL() {
    return host_addr + '/devices';
}
export function getAllInterfacesOfDeviceURL(device_ip) {
    return host_addr + '/interfaces/?mgt_ip=' + device_ip
}

export function getAllMclagsOfDeviceURL(device_ip) {
    return host_addr + '/mclags/?mgt_ip=' + device_ip
}

export function getAllBGPOfDeviceURL(device_ip) {
    return host_addr + '/bgp/?mgt_ip=' + device_ip
}

export function getAllPortChnlsOfDeviceURL(device_ip) {
    return host_addr + '/port_chnls/?mgt_ip=' + device_ip
}

export function getDiscoveryUrl() {
    return host_addr + '/discover'
}

export function getPortGroupsURL(device_ip) {
    return host_addr + '/groups/?mgt_ip=' + device_ip
}

export function getVlansURL(device_ip) {
    return host_addr + '/vlans/?mgt_ip=' + device_ip
}

export function postLogin() {
    return host_addr + '/auth/login'
}

export function getUser(user) {
    return host_addr + '/auth/user/' + user
}