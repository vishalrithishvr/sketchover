// Address validation for the shipping step.
//
// The aim is to catch addresses a courier could not act on: a two-letter city, a
// five-digit PIN, a PIN that belongs to a different state, a phone number that
// cannot exist. Everything is checked against the value the shopper typed, so a
// field only turns invalid once it is genuinely wrong.

// Indian PIN codes are regional: the first two digits identify the postal circle,
// which in turn pins down the state. Used to catch PIN/state mismatches.
const PIN_PREFIX_STATES = {
  11: ['Delhi'],
  12: ['Haryana'], 13: ['Haryana'],
  14: ['Punjab'], 15: ['Punjab'], 16: ['Punjab', 'Chandigarh'],
  17: ['Himachal Pradesh'],
  18: ['Jammu and Kashmir', 'Ladakh'], 19: ['Jammu and Kashmir', 'Ladakh'],
  20: ['Uttar Pradesh', 'Uttarakhand'], 21: ['Uttar Pradesh'], 22: ['Uttar Pradesh'],
  23: ['Uttar Pradesh'], 24: ['Uttar Pradesh', 'Uttarakhand'], 25: ['Uttar Pradesh', 'Uttarakhand'],
  26: ['Uttar Pradesh'], 27: ['Uttar Pradesh'], 28: ['Uttar Pradesh'],
  30: ['Rajasthan'], 31: ['Rajasthan'], 32: ['Rajasthan'], 33: ['Rajasthan'], 34: ['Rajasthan'],
  36: ['Gujarat'], 37: ['Gujarat'], 38: ['Gujarat'],
  39: ['Gujarat', 'Daman and Diu', 'Dadra and Nagar Haveli'],
  40: ['Maharashtra', 'Goa'], 41: ['Maharashtra'], 42: ['Maharashtra'],
  43: ['Maharashtra'], 44: ['Maharashtra'],
  45: ['Madhya Pradesh'], 46: ['Madhya Pradesh'], 47: ['Madhya Pradesh'],
  48: ['Madhya Pradesh', 'Chhattisgarh'], 49: ['Chhattisgarh', 'Madhya Pradesh'],
  50: ['Telangana'], 51: ['Andhra Pradesh'], 52: ['Andhra Pradesh', 'Telangana'],
  53: ['Andhra Pradesh'],
  56: ['Karnataka'], 57: ['Karnataka'], 58: ['Karnataka'], 59: ['Karnataka'],
  60: ['Tamil Nadu', 'Puducherry'], 61: ['Tamil Nadu'], 62: ['Tamil Nadu'],
  63: ['Tamil Nadu'], 64: ['Tamil Nadu'],
  67: ['Kerala'], 68: ['Kerala', 'Lakshadweep'], 69: ['Kerala'],
  70: ['West Bengal'], 71: ['West Bengal'], 72: ['West Bengal'],
  73: ['West Bengal', 'Sikkim'], 74: ['West Bengal', 'Andaman and Nicobar Islands'],
  75: ['Odisha'], 76: ['Odisha'], 77: ['Odisha'],
  78: ['Assam'],
  79: ['Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Tripura'],
  80: ['Bihar'], 81: ['Bihar'], 82: ['Bihar', 'Jharkhand'],
  83: ['Jharkhand'], 84: ['Bihar'], 85: ['Bihar'],
}

// Every state and union territory, so a typo like "Tamilnaadu" is caught.
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

// Districts of Tamil Nadu — the home state, where most orders land.
export const TN_DISTRICTS = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul',
  'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai',
  'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
  'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni',
  'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur',
  'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar',
]

// Chennai city PIN range — used to cross-check the city and district.
const CHENNAI_PIN_RANGE = [600001, 600130]

const norm = (v) => (v || '').trim()
const loose = (v) => norm(v).toLowerCase().replace(/[^a-z]/g, '')

const PLACE_RE = /^[A-Za-z][A-Za-z\s.'()-]{1,48}$/
const NAME_RE = /^[A-Za-z][A-Za-z\s.'-]{1,39}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/

// Only Indian addresses are serviceable today.
const isIndia = (v) => ['india', 'bharat', 'in', 'ind'].includes(loose(v))

const matchesKnown = (value, list) => list.some(item => loose(item) === loose(value))

export const isChennaiPin = (pin) => {
  const n = Number(norm(pin))
  return n >= CHENNAI_PIN_RANGE[0] && n <= CHENNAI_PIN_RANGE[1]
}

// True when the order ships inside Chennai, which gets the faster delivery promise.
export const isChennaiAddress = (address = {}) =>
  isChennaiPin(address.postalCode) ||
  loose(address.city) === 'chennai' ||
  loose(address.district) === 'chennai'

export const validateAddress = (form = {}) => {
  const errors = {}

  if (!norm(form.firstName)) errors.firstName = 'First name is required.'
  else if (!NAME_RE.test(norm(form.firstName))) errors.firstName = 'Use letters only, at least 2 characters.'

  if (!norm(form.lastName)) errors.lastName = 'Last name is required.'
  else if (!NAME_RE.test(norm(form.lastName))) errors.lastName = 'Use letters only, at least 2 characters.'

  const street = norm(form.street)
  if (!street) errors.street = 'Street and area are required.'
  else if (street.length < 6) errors.street = 'Give the door / street number and the area.'

  const country = norm(form.country)
  if (!country) errors.country = 'Country is required.'
  else if (!isIndia(country)) errors.country = 'We ship within India only — enter India.'

  const pin = norm(form.postalCode)
  if (!pin) errors.postalCode = 'Postal code is required.'
  else if (!/^\d{6}$/.test(pin)) errors.postalCode = 'An Indian PIN code is exactly 6 digits.'
  else if (!/^[1-8]/.test(pin)) errors.postalCode = 'No Indian PIN code starts with that digit.'

  const pinIsValid = !errors.postalCode
  const pinStates = pinIsValid ? PIN_PREFIX_STATES[Number(pin.slice(0, 2))] : undefined
  if (pinIsValid && !pinStates) errors.postalCode = 'That PIN code is not in use.'

  const state = norm(form.state)
  if (!state) errors.state = 'State is required.'
  else if (!matchesKnown(state, INDIAN_STATES)) errors.state = 'Enter a state or union territory as spelled on the list.'
  else if (pinStates && !pinStates.some(s => loose(s) === loose(state))) {
    errors.state = `PIN ${pin} is in ${pinStates[0]} — check the PIN code or the state.`
  }

  const city = norm(form.city)
  if (!city) errors.city = 'City or town is required.'
  else if (!PLACE_RE.test(city)) errors.city = 'Use letters only, at least 2 characters.'
  else if (pinIsValid && isChennaiPin(pin) && loose(city) !== 'chennai' && loose(city) !== 'madras') {
    errors.city = `PIN ${pin} is a Chennai code — enter Chennai, or correct the PIN.`
  }

  const district = norm(form.district)
  const stateIsTN = loose(state) === loose('Tamil Nadu')
  if (!district) errors.district = 'District is required.'
  else if (!PLACE_RE.test(district)) errors.district = 'Use letters only, at least 2 characters.'
  else if (stateIsTN && !matchesKnown(district, TN_DISTRICTS)) {
    errors.district = 'Not a Tamil Nadu district — check the spelling.'
  } else if (pinIsValid && isChennaiPin(pin) && loose(district) !== 'chennai') {
    errors.district = `PIN ${pin} falls in Chennai district.`
  }

  const email = norm(form.email)
  if (!email) errors.email = 'Email address is required.'
  else if (!EMAIL_RE.test(email)) errors.email = 'Enter a working email, like name@example.com.'

  const phone = norm(form.phone).replace(/[\s()-]/g, '').replace(/^(\+91|0091|91|0)/, '')
  if (!norm(form.phone)) errors.phone = 'Mobile number is required.'
  else if (!/^\d{10}$/.test(phone)) errors.phone = 'Enter the 10-digit mobile number.'
  else if (!/^[6-9]/.test(phone)) errors.phone = 'Indian mobile numbers start with 6, 7, 8 or 9.'

  return errors
}
