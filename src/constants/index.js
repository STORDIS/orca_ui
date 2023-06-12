//urls are taken from orca_backend/network/url.py
export const ALL_DEVICE_URL = "http://localhost:8000/devices/";
//Following URLs are sample and device IP and other hardcoded params should be repalced with placeholders.
export const DEVICE_ALL_INTERFACE_URL="http://localhost:8000/interfaces/?mgt_ip=10.10.130.12";
export const DEVICE_INTERFACE_URL="http://localhost:8000/interfaces/?mgt_ip=10.10.130.12&intfc_name=Ethernet56";
export const DEVICE_ALL_PORT_CHNLS_URL="http://localhost:8000/port_chnls/?mgt_ip=10.10.130.12";
export const DEVICE_PORT_CHNL_URL="http://localhost:8000/port_chnls/?mgt_ip=10.10.130.10&chnl_name=PortChannel100";
export const DEVICE_ALL_MCLAGS_URL="http://localhost:8000/mclags/?mgt_ip=10.10.130.12";
export const DEVICE_MCLAG_URL="http://localhost:8000/mclags/?mgt_ip=10.10.130.10&domain_id=1";
export const DISCOVERY_URL="http://localhost:8000/discover";
