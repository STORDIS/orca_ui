import secureLocalStorage from "react-secure-storage";
export const getIsStaff = () => {
    if (secureLocalStorage.getItem("user_details")?.is_staff) {
        return secureLocalStorage.getItem("user_details")?.is_staff;
    } else {
        return false;
    }
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

export const isValidIPv4 = (ip) => {
    const ipv4Pattern =
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Pattern.test(ip);
};

export const isValidCIDR = (cidr) => {
    const cidrPattern =
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/([0-9]|[1-2][0-9]|3[0-2])$/;
    return cidrPattern.test(cidr);
};

export const areAllIPAddressesValid = (input) => {
    if (input) {
        if (input) {
            const ipAddresses = input?.split(",").map((ip) => ip.trim());
            return ipAddresses.every(
                (ip) => isValidIPv4(ip) || isValidCIDR(ip)
            );
        } else {
            return true;
        }
    } else {
        return true;
    }
};

export const isValidIPv4WithMac = (ipWithCidr) => {
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
        return true;
    }
};