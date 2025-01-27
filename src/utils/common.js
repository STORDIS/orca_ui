import secureLocalStorage from "react-secure-storage";
export const getIsStaff = () => {
  if (secureLocalStorage.getItem("user_details")?.is_staff) {
    return secureLocalStorage.getItem("user_details")?.is_staff;
  } else {
    return false;
  }
};

export const isValidIPAddressOrRange = (input) => {
  if (input.includes("-")) {
    const [startIp, endIp] = input.split("-").map((ip) => ip.trim());
    if (isValidIPv4(startIp) && isValidIPv4(endIp)) {
      return "valid";
    } else if (!isValidIPv4(startIp)) {
      return "Invalid starting IP Range";
    } else if (!isValidIPv4(endIp)) {
      return "Invalid ending IP Range";
    }
  } else if (input.includes("/")) {
    if (input) {
      return validateIPAndMask(input);
    } else {
      return "Mask for IP is not Provided";
    }
  } else {
    return "Invalid IP format or range. Range must be 10.10.10.10-10.10.10.20 (separated by hyphen) or subnet 10.10.10.0/24";
  }
};

export const validateIPAndMask = (cidr) => {
  const [ip, mask] = cidr.split("/");

  const ipPattern =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  if (!ip.match(ipPattern)) {
    return "Invalid IP format";
  }

  if (mask !== undefined) {
    const maskValue = parseInt(mask, 10);
    if (isNaN(maskValue) || maskValue < 24 || maskValue > 32) {
      return "Invalid mask range (must be between 24 and 32)";
    }
  }

  return "valid";
};

export const isValidIPv4WithCIDR = (ipWithCidr) => {
  if (ipWithCidr) {
    const ipv4Regex =
      /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/;
    const cidrRegex = /^([0-9]|[12][0-9]|3[0-2])$/;

    const [ip, cidr] = ipWithCidr.split("/");

    if (ipv4Regex.test(ip)) {
      if (cidr === undefined || cidrRegex.test(cidr)) {
        return true;
      }
    }
    return false;
  } else {
    return false;
  }
};

export const isValidCIDR = (cidr) => {
  const cidrPattern =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/([0-9]|[1-2][0-9]|3[0-2])$/;

  // Check if input matches IPv4 CIDR format
  const match = cidr.match(cidrPattern);
  if (!match) return false;

  // Extract the subnet mask and check if it's greater than or equal to 22
  const subnet = parseInt(match[5], 10);
  return subnet >= 22;
};

export const isValidIPv4 = (ip) => {
  const ipv4Pattern =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Pattern.test(ip);
};

export const areAllIPAddressesValid = (input) => {
  if (input) {
    if (input) {
      const ipAddresses = input?.split(",").map((ip) => ip.trim());
      return ipAddresses.every((ip) => isValidIPv4(ip) || isValidCIDR(ip));
    } else {
      return true;
    }
  } else {
    return true;
  }
};
