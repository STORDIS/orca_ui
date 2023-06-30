const host_addr='http://localhost:8000/'

export function getAllDevicesURL() {
    return host_addr + '/devices';
}
export function getAllInterfacesOfDeviceURL(device_ip) {
    return host_addr + '/interfaces/?mgt_ip=' + device_ip
}

export function getAllMclagsOfDeviceURL(device_ip) {
    return host_addr + '/mclags/?mgt_ip=' + device_ip
}

export function getAllPortChnlsOfDeviceURL(device_ip) {
    return host_addr + '/port_chnls/?mgt_ip=' + device_ip
}

export function getDiscoveryUrl() {
    return host_addr + 'discover'
}

