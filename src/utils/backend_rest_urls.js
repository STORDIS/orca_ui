const host_addr =
    process.env.REACT_APP_HOST_ADDR_BACKEND || "http://localhost:8000";

export function getAllDevicesURL() {
    return host_addr + "/devices";
}
export function getAllInterfacesOfDeviceURL(device_ip) {
    return host_addr + "/interfaces?mgt_ip=" + device_ip;
}

export function getAllMclagsOfDeviceURL(device_ip) {
    return host_addr + "/mclags?mgt_ip=" + device_ip;
}

export function getAllBGPOfDeviceURL(device_ip) {
    return host_addr + "/bgp?mgt_ip=" + device_ip;
}

export function getAllPortChnlsOfDeviceURL(device_ip) {
    return host_addr + "/port_chnls?mgt_ip=" + device_ip;
}

export function getDiscoveryUrl() {
    return host_addr + "/discover";
}

export function getPortGroupsURL(device_ip) {
    return host_addr + "/groups?mgt_ip=" + device_ip;
}

export function getVlansURL(device_ip) {
    return host_addr + "/vlans?mgt_ip=" + device_ip;
}

export function postLogin() {
    return host_addr + "/auth/login";
}

export function getUser(user) {
    return host_addr + "/auth/user/" + user;
}

export function deleteVlanMembersURL(device_ip) {
    return host_addr + "/vlan_mem_delete?mgt_ip=" + device_ip;
}

export function gptCompletionsURL(formate) {
    return host_addr + "/orcask/completions?response_format=" + formate;
}

export function logPanelURL() {
    return host_addr + "/logs/all/1?size=1000";
}

export function logPanelDeleteURL() {
    return host_addr + "/logs/delete";
}

export function deleteDevicesURL(device_ip) {
    return host_addr + "/del_db?mgt_ip=" + device_ip;
}

export function getOrcAskHistoryURL() {
    return host_addr + "/orcask/history";
}
export function deleteOrcAskHistoryURL() {
    return host_addr + "/orcask/history/delete";
}

export function bookmarkURL() {
    return host_addr + "/orcask/bookmark";
}

export function bookmarkDeleteAllURL() {
    return host_addr + "/orcask/bookmark/delete-all";
}