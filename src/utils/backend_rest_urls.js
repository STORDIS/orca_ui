const host_addr =
    process.env.REACT_APP_HOST_ADDR_BACKEND || "http://localhost:8000";

// auth urls
export function getUserDetailsURL(user) {
    return host_addr + "/auth/user/" + user;
}

export function postLogin() {
    return host_addr + "/auth/login";
}

export function getUser(user) {
    return host_addr + "/auth/user/" + user;
}

// ethernet urls
export function getAllInterfacesOfDeviceURL(device_ip) {
    return host_addr + "/interfaces?mgt_ip=" + device_ip;
}
export function breakoutURL(device_ip) {
    return host_addr + "/breakout?mgt_ip=" + device_ip;
}

export function subInterfaceURL() {
    return host_addr + "/subinterface";
}

// mclag urls
export function getAllMclagsOfDeviceURL(device_ip) {
    return host_addr + "/mclags?mgt_ip=" + device_ip;
}

export function deleteMclagsMemberURL(device_ip) {
    return host_addr + "/delete_mclag_members";
}

// bgp urls
export function getAllBGPOfDeviceURL(device_ip) {
    return host_addr + "/bgp?mgt_ip=" + device_ip;
}

// portgroup urls
export function getPortGroupsURL(device_ip) {
    return host_addr + "/groups?mgt_ip=" + device_ip;
}

// port channel urls
export function deletePortchannelEthernetMemberURL() {
    return host_addr + "/port_chnl_mem_ethernet";
}

export function deletePortchannelVlanMemberURL() {
    return host_addr + "/port_channel_member_vlan";
}

export function deletePortchannelVlanMemberAllURL() {
    return host_addr + "/port_chnl_vlan_member_remove_all";
}

export function getAllPortChnlsOfDeviceURL(device_ip) {
    return host_addr + "/port_chnls?mgt_ip=" + device_ip;
}

export function deletePortchannelIpURL(device_ip) {
    return host_addr + "/port_chnl_ip_remove";
}

// vlan urls
export function getVlansURL(device_ip) {
    return host_addr + "/vlans?mgt_ip=" + device_ip;
}

export function removeVlanIp() {
    return host_addr + "/vlan_ip_remove";
}

export function deleteVlanMembersURL(device_ip) {
    return host_addr + "/vlan_mem_delete?mgt_ip=" + device_ip;
}

// stp urls
export function stpURL(device_ip) {
    return host_addr + "/stp?mgt_ip=" + device_ip;
}

// orcask urls
export function gptCompletionsURL(formate) {
    return host_addr + "/orcask/completions?response_format=" + formate;
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

// devices urls
export function getDiscoveryUrl() {
    return host_addr + "/discover";
}

export function deleteDevicesURL() {
    return host_addr + "/del_db";
}

export function getAllDevicesURL() {
    return host_addr + "/devices";
}

export function installSonicURL() {
    return host_addr + "/install_image"
}

export function switchImageURL() {
    return host_addr + "/switch_image"
}

// other urls

export function logPanelURL() {
    return host_addr + "/logs/all/1?size=1000";
}

export function logPanelDeleteURL() {
    return host_addr + "/logs/delete";
}

export function syncURL() {
    return host_addr + "/discover/feature";
}

export function sheduleURL(selectedDeviceIp) {
    return host_addr + "/discover/schedule?mgt_ip=" + selectedDeviceIp;
}

// ----------------
