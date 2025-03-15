import { jwtDecode } from 'jwt-decode'
import ThermalPrinterModule from 'react-native-thermal-printer'
import moment from 'moment'

async function printQueueNumber (activeQueueNumber, name) {
  try {
    let payload =
      "[C]   Hello there, you are currently in the queue\n" +
      "[L]\n\n" +
      "[C][C]      Your Number:" +
      "[L]\n\n" +
      "[C][C]        <font size='big'><b>"+ activeQueueNumber +"</b></font>" +
      "[L]\n\n\n" +
      "[L]   Serve by: "+ name +"\n" +
      "[L]   "+moment().format('MMMM Do YYYY, h:mm:ss a')+"\n" +
      "[L]\n\n" +
      "[L]\n\n" +
      "[L]\n\n"

    return await ThermalPrinterModule.printBluetooth({ 
      payload,
      printerNbrCharactersPerLine: 38,
      printerWidthMM: 200,
     })
  } catch (error) {
    console.log('printQueueNumber Error:', error)
  }
}

function decodeToken (token) {
  return jwtDecode(token)
}

function formatQueueNumber (number) {
  return String(number).padStart(4, '0')
}

function getDate (format) {
  return moment().format(format)
}

function formatWithCurrency(value, currency = 'PHP') {
  const formatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency,
  })

  const numericValue = parseFloat(value);

  if (Number.isNaN(numericValue)) {
    return 'Invalid number';
  }

  // Return the formatted currency string
  return formatter.format(numericValue);
}

const storage = {
  set (key, value) {
    global.$localStorage.setItem(key, value)
  },

  async get (key) {
    return await global.$localStorage.getItem(key)
  },

  async remove (key) {
    await global.$localStorage.removeItem(key)
  }
}

export {
  printQueueNumber,
  decodeToken,
  formatQueueNumber,
  getDate,
  storage,
  formatWithCurrency
}