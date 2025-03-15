import { NetworkInfo } from "react-native-network-info"
import NetInfo from "@react-native-community/netinfo"
import Zeroconf from "react-native-zeroconf"
import RNPing from "react-native-ping"

const useNetworkInfo = () => {

  // NetInfo.fetch().then(state => {
  //   console.log("Device IPv4 Address:", state.details);
  // })

  // const zeroconf = new Zeroconf();
  // zeroconf.scan("http", "tcp", "local"); // Start searching

  // zeroconf.on("resolved", service => {
  //   console.log("Found Device:", service.name, service.host, service.addresses);
  // });

  // zeroconf.on("stop", () => console.log("Scan stopped."))

  async function scanNetwork() {
    console.log('scanning start-----')
    const baseIP = "192.168.1."; // Adjust based on your network
    const promises = [];
  
    for (let i = 1; i <= 255; i++) {
      const ip = `${baseIP}${i}`;
      const promise = RNPing.start(ip, { timeout: 1000 })
        .then(ms => console.log(`Device Found at: ${ip} (Ping: ${ms}ms)`))
        .catch(() => {}); // Ignore unreachable IPs
      promises.push(promise);
    }
  
    await Promise.all(promises); // Run all pings in parallel
    console.log("Network scan completed!");
  }
  
  scanNetwork()


  return {
    networkInfo: async () => {
      // const name = await NetworkInfo.getHostname()
      const ipv4 = await NetworkInfo.getIPV4Address()

      return {
        ipv4
      }
    }
  }
}

export { useNetworkInfo }