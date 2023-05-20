const mainDomain = "https://server.stoievservices.de/workreport"

export const auth = () => { return `${mainDomain}/api/Auth/login` }
export const users = () => { return `${mainDomain}/api/Users` }
export const workers = () => { return `${mainDomain}/api/Workers` }
export const сustomers = () => { return `${mainDomain}/api/Customers` }
export const materials = () => { return `${mainDomain}/api/Materials` }
export const trips = () => { return `${mainDomain}/api/Trips` }
export const unitMeasurement = () => { return `${mainDomain}/api/UnitMeasurement` }
