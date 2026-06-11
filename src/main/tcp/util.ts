export function decimalToHexString(num: number): string {
  // Convert the number to a hexadecimal string
  let hexString = num.toString(16)

  // Ensure the result is not longer than 4 characters
  if (hexString.length > 4) {
    // Option 1: Throw an error
    throw new Error("Hexadecimal representation exceeds maximum length of 4.")
  }

  // Optionally, pad the string to ensure it has a minimum length of 4 characters
  hexString = hexString.padStart(4, '0')

  return hexString.toUpperCase()
}

export function hexStringToDecimal(hexString: string): number {
  try {
    return parseInt(hexString, 16)
  } catch (err) {
    console.warn(err)
    return 0
  }
}