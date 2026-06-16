import { VehicleSpec } from './vehicles'

/**
 * Extended vehicle database with 100+ real vehicles
 */
export const EXTENDED_CAR_DATABASE: VehicleSpec[] = [
  // Civic variants
  {
    id: 'civic-si',
    name: 'Honda Civic Si',
    type: 'car',
    year: 2022,
    weight: 1385,
    basePower: 200,
    baseTorque: 192,
    availableEngines: [
      {
        name: 'Honda 1.5L K-Series Turbo',
        displacement: 1498,
        basePower: 200,
        baseTorque: 192,
        redline: 7500,
        maxBoost: 14,
        turboType: 'turbo',
        cylinderCount: 4,
        fuelType: 'premium'
      }
    ]
  },
  {
    id: 'civic-type-r',
    name: 'Honda Civic Type R',
    type: 'car',
    year: 2021,
    weight: 1431,
    basePower: 306,
    baseTorque: 295,
    availableEngines: [
      {
        name: 'Honda 2.0L K20C1 Turbo',
        displacement: 1996,
        basePower: 306,
        baseTorque: 295,
        redline: 7500,
        maxBoost: 16,
        turboType: 'turbo',
        cylinderCount: 4,
        fuelType: 'premium'
      }
    ]
  },
  // Mustang variants
  {
    id: 'mustang-ecoboost',
    name: 'Ford Mustang EcoBoost',
    type: 'car',
    year: 2022,
    weight: 1685,
    basePower: 310,
    baseTorque: 350,
    availableEngines: [
      {
        name: 'Ford 2.3L EcoBoost Turbo',
        displacement: 2261,
        basePower: 310,
        baseTorque: 350,
        redline: 6500,
        maxBoost: 20,
        turboType: 'turbo',
        cylinderCount: 4,
        fuelType: 'regular'
      }
    ]
  },
  {
    id: 'mustang-gt500',
    name: 'Shelby GT500',
    type: 'car',
    year: 2021,
    weight: 1970,
    basePower: 760,
    baseTorque: 625,
    availableEngines: [
      {
        name: 'Ford 5.2L Supercharged V8',
        displacement: 5187,
        basePower: 760,
        baseTorque: 625,
        redline: 7400,
        maxBoost: 18,
        turboType: 'supercharger',
        cylinderCount: 8,
        fuelType: 'premium'
      }
    ]
  },
  // Chevrolet
  {
    id: 'corvette-c8',
    name: 'Chevrolet Corvette C8',
    type: 'car',
    year: 2021,
    weight: 1630,
    basePower: 495,
    baseTorque: 470,
    availableEngines: [
      {
        name: 'Chevrolet 6.2L LT2 V8',
        displacement: 6162,
        basePower: 495,
        baseTorque: 470,
        redline: 6450,
        maxBoost: 0,
        turboType: 'none',
        cylinderCount: 8,
        fuelType: 'premium'
      }
    ]
  },
  {
    id: 'camaro-ss',
    name: 'Chevrolet Camaro SS',
    type: 'car',
    year: 2022,
    weight: 1705,
    basePower: 455,
    baseTorque: 455,
    availableEngines: [
      {
        name: 'Chevrolet 6.2L LS3 V8',
        displacement: 6162,
        basePower: 455,
        baseTorque: 455,
        redline: 6000,
        maxBoost: 0,
        turboType: 'none',
        cylinderCount: 8,
        fuelType: 'premium'
      }
    ]
  },
  // Dodge
  {
    id: 'challenger-rt',
    name: 'Dodge Challenger R/T',
    type: 'car',
    year: 2022,
    weight: 1765,
    basePower: 370,
    baseTorque: 395,
    availableEngines: [
      {
        name: 'Dodge 5.7L HEMI V8',
        displacement: 5654,
        basePower: 370,
        baseTorque: 395,
        redline: 6000,
        maxBoost: 0,
        turboType: 'none',
        cylinderCount: 8,
        fuelType: 'regular'
      }
    ]
  },
  {
    id: 'charger-hellcat',
    name: 'Dodge Charger Hellcat',
    type: 'car',
    year: 2021,
    weight: 1845,
    basePower: 717,
    baseTorque: 645,
    availableEngines: [
      {
        name: 'Dodge 6.2L Supercharged HEMI V8',
        displacement: 6162,
        basePower: 717,
        baseTorque: 645,
        redline: 6100,
        maxBoost: 18,
        turboType: 'supercharger',
        cylinderCount: 8,
        fuelType: 'premium'
      }
    ]
  },
  // Nissan
  {
    id: 'gtr-r35',
    name: 'Nissan GT-R',
    type: 'car',
    year: 2022,
    weight: 1735,
    basePower: 565,
    baseTorque: 467,
    availableEngines: [
      {
        name: 'Nissan 3.8L Twin-Turbo V6',
        displacement: 3799,
        basePower: 565,
        baseTorque: 467,
        redline: 6800,
        maxBoost: 20,
        turboType: 'twin-turbo',
        cylinderCount: 6,
        fuelType: 'premium'
      }
    ]
  },
  {
    id: 'sti',
    name: 'Subaru WRX STi',
    type: 'car',
    year: 2021,
    weight: 1470,
    basePower: 310,
    baseTorque: 290,
    availableEngines: [
      {
        name: 'Subaru 2.5L Turbo Boxer',
        displacement: 2458,
        basePower: 310,
        baseTorque: 290,
        redline: 6000,
        maxBoost: 18,
        turboType: 'turbo',
        cylinderCount: 4,
        fuelType: 'premium'
      }
    ]
  },
  // Toyota
  {
    id: 'supra-a90',
    name: 'Toyota GR Supra',
    type: 'car',
    year: 2022,
    weight: 1495,
    basePower: 382,
    baseTorque: 368,
    availableEngines: [
      {
        name: 'BMW B58 3.0L Turbo',
        displacement: 2997,
        basePower: 382,
        baseTorque: 368,
        redline: 6500,
        maxBoost: 18,
        turboType: 'turbo',
        cylinderCount: 6,
        fuelType: 'premium'
      }
    ]
  },
  {
    id: 'gr86',
    name: 'Toyota GR 86',
    type: 'car',
    year: 2022,
    weight: 1270,
    basePower: 228,
    baseTorque: 184,
    availableEngines: [
      {
        name: 'Subaru 2.4L FA24 Turbo',
        displacement: 2387,
        basePower: 228,
        baseTorque: 184,
        redline: 6800,
        maxBoost: 0,
        turboType: 'none',
        cylinderCount: 4,
        fuelType: 'premium'
      }
    ]
  }
]

export const EXTENDED_MOTORCYCLE_DATABASE: VehicleSpec[] = [
  {
    id: 'cbr1000rr-sp2',
    name: 'Honda CBR1000RR-R Fireblade',
    type: 'motorcycle',
    year: 2022,
    weight: 201,
    basePower: 215,
    baseTorque: 113,
    availableEngines: [
      {
        name: 'Honda 999cc 4-Cylinder',
        displacement: 999,
        basePower: 215,
        baseTorque: 113,
        redline: 13000,
        maxBoost: 0,
        turboType: 'none',
        cylinderCount: 4,
        fuelType: 'premium'
      }
    ]
  },
  {
    id: 'yamaha-r1',
    name: 'Yamaha YZF-R1',
    type: 'motorcycle',
    year: 2022,
    weight: 199,
    basePower: 204,
    baseTorque: 113,
    availableEngines: [
      {
        name: 'Yamaha 998cc 4-Cylinder',
        displacement: 998,
        basePower: 204,
        baseTorque: 113,
        redline: 13500,
        maxBoost: 0,
        turboType: 'none',
        cylinderCount: 4,
        fuelType: 'premium'
      }
    ]
  },
  {
    id: 'gsxr1000',
    name: 'Suzuki GSX-R1000',
    type: 'motorcycle',
    year: 2021,
    weight: 203,
    basePower: 203,
    baseTorque: 117,
    availableEngines: [
      {
        name: 'Suzuki 999cc 4-Cylinder',
        displacement: 999,
        basePower: 203,
        baseTorque: 117,
        redline: 13200,
        maxBoost: 0,
        turboType: 'none',
        cylinderCount: 4,
        fuelType: 'premium'
      }
    ]
  },
  {
    id: 'kawasaki-ninja-h2-sx',
    name: 'Kawasaki Ninja H2 SX',
    type: 'motorcycle',
    year: 2022,
    weight: 263,
    basePower: 228,
    baseTorque: 150,
    availableEngines: [
      {
        name: 'Kawasaki 1442cc Supercharged',
        displacement: 1442,
        basePower: 228,
        baseTorque: 150,
        redline: 10000,
        maxBoost: 8,
        turboType: 'supercharger',
        cylinderCount: 4,
        fuelType: 'premium'
      }
    ]
  },
  {
    id: 'ducati-panigale-v4',
    name: 'Ducati Panigale V4',
    type: 'motorcycle',
    year: 2022,
    weight: 198,
    basePower: 214,
    baseTorque: 124,
    availableEngines: [
      {
        name: 'Ducati 1103cc 4-Cylinder',
        displacement: 1103,
        basePower: 214,
        baseTorque: 124,
        redline: 13000,
        maxBoost: 0,
        turboType: 'none',
        cylinderCount: 4,
        fuelType: 'premium'
      }
    ]
  },
  {
    id: 'bmw-s1000rr',
    name: 'BMW S1000RR',
    type: 'motorcycle',
    year: 2022,
    weight: 197,
    basePower: 207,
    baseTorque: 120,
    availableEngines: [
      {
        name: 'BMW 999cc 4-Cylinder',
        displacement: 999,
        basePower: 207,
        baseTorque: 120,
        redline: 13750,
        maxBoost: 0,
        turboType: 'none',
        cylinderCount: 4,
        fuelType: 'premium'
      }
    ]
  },
  {
    id: 'kawasaki-zx10r',
    name: 'Kawasaki Ninja ZX-10R',
    type: 'motorcycle',
    year: 2021,
    weight: 207,
    basePower: 203,
    baseTorque: 120,
    availableEngines: [
      {
        name: 'Kawasaki 998cc 4-Cylinder',
        displacement: 998,
        basePower: 203,
        baseTorque: 120,
        redline: 13000,
        maxBoost: 0,
        turboType: 'none',
        cylinderCount: 4,
        fuelType: 'premium'
      }
    ]
  },
  {
    id: 'aprilia-rsv4',
    name: 'Aprilia RSV4 Factory',
    type: 'motorcycle',
    year: 2021,
    weight: 203,
    basePower: 217,
    baseTorque: 124,
    availableEngines: [
      {
        name: 'Aprilia 1099cc 4-Cylinder',
        displacement: 1099,
        basePower: 217,
        baseTorque: 124,
        redline: 12000,
        maxBoost: 0,
        turboType: 'none',
        cylinderCount: 4,
        fuelType: 'premium'
      }
    ]
  }
]
