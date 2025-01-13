export const predefinedBookMarks = [
  {
    prompt: "get all device details",
  },
  {
    prompt: "get device details",
  },
  {
    prompt: "get vlans for ip ",
  },
  {
    prompt: "get port channels for ip ",
  },
];

export const temp = {
  id: 33,
  timestamp: "1736753090.287536",
  user_key: "Token 29dbe76d957228165dcf53ca9df85a0e0b7baf88",
  prompt: "test prompt",
  prompt_response: {
    enable_all_ifs: {
      success:
        "All interfaces on device with IP 10.10.229.111 enabled successfully.",
      fail: "",
    },

    // default_message:
    //   "I am, ORCAsk AI developed to assist you. How can I help you?",
    // get_device_details: {
    //   result: {
    //     img_name: "SONiC-OS-4.2.2-Enterprise_Base",
    //     mgt_intf: "Management0",
    //     mgt_ip: "10.10.229.111",
    //     hwsku: "DellEMC-S5248f-P-25G-DPB",
    //     mac: "0c:ef:c7:44:00:0a",
    //     platform: "x86_64-kvm_x86_64-r0",
    //     type: "LeafRouter",
    //     system_status: "System is ready",
    //     image_list: [
    //       "SONiC-OS-4.2.2-Enterprise_Base",
    //       "SONiC-OS-4.4.0-Enterprise_Base",
    //     ],
    //     element_id_property: "4:fb528b4a-ddb0-471a-96cd-8ff713a361e1:67",
    //   },
    // },
    // get_vlan: {
    //   result: [
    //     {
    //       vlanid: 1,
    //       name: "Vlan1",
    //       mtu: 9000,
    //       oper_status: "down",
    //       autostate: null,
    //       ip_address: null,
    //       sag_ip_address: null,
    //       enabled: false,
    //       description: null,
    //       element_id_property: "4:fb528b4a-ddb0-471a-96cd-8ff713a361e1:87",
    //       members: [],
    //     },
    //   ],
    //   get_desc: "Details of VLAN on device with IP 10.10.229.111 retrieved.",
    // },
    // get_port_chnl: {
    //   result: [
    //     {
    //       lag_name: "PortChannel101",
    //       active: true,
    //       admin_sts: "up",
    //       mtu: 9100,
    //       name: "lacp",
    //       fallback_operational: true,
    //       oper_sts: "down",
    //       speed: "0",
    //       oper_sts_reason: null,
    //       static: false,
    //       fallback: false,
    //       fast_rate: false,
    //       min_links: 1,
    //       description: null,
    //       graceful_shutdown_mode: "DISABLE",
    //       ip_address: null,
    //       vlan_members: {},
    //       element_id_property: "4:fb528b4a-ddb0-471a-96cd-8ff713a361e1:46",
    //     },
    //     {
    //       lag_name: "PortChannel1",
    //       active: true,
    //       admin_sts: "up",
    //       mtu: 9100,
    //       name: "lacp",
    //       fallback_operational: true,
    //       oper_sts: "down",
    //       speed: "0",
    //       oper_sts_reason: "ALL_LINKS_DOWN",
    //       static: false,
    //       fallback: null,
    //       fast_rate: null,
    //       min_links: null,
    //       description: null,
    //       graceful_shutdown_mode: null,
    //       ip_address: null,
    //       vlan_members: {},
    //       element_id_property: "4:fb528b4a-ddb0-471a-96cd-8ff713a361e1:45",
    //     },
    //   ],
    //   get_desc:
    //     "Details of port channel on device with IP 10.10.229.111 retrieved.",
    // },
    // enable_all_ifs: [
    //   {
    //     args: {
    //       device_ip: "10.10.229.111",
    //     },
    //     confirmation_desc:
    //       "Operation 1: - All interfaces will be enabled on the device with IP address 10.10.229.111.",
    //   },
    // ],
    // request_for_confirmation:
    //   "I need your confirmation for the above operation.",
    // del_port_chnl: [
    //   {
    //     missing_args: {
    //       device_ip: null,
    //     },
    //     assigned_args: {
    //       chnl_name: "portchanel101",
    //     },
    //     description:
    //       "del_port_chnl Deletes a port channel from a device,\nand triggers the discovery of the port channel on the device to keep database up to date.\n\nArgs:\n    device_ip (str): The IP address of the device.\n    chnl_name (str, optional): The name of the port channel to delete. Defaults to None.\n\nReturns:\n    None",
    //     missing_args_desc:
    //       "Operation 1: - Deleting a port channel cannot proceed as it needs the 'device IP' along with the channel name portchanel101.",
    //   },
    // ],
    // request_missing_args:
    //   "Please provide the missing information to let me proceed.",
  },
  model_name: "gpt-4o",
};
