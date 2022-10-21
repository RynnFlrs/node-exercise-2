const fs = require('fs')
const csvjson = require('csvjson')

const titleCase = (str) => str.charAt(0).toUpperCase() + str.substr(1).toLowerCase()

class BioStat {
  constructor(name, sex, age, height, weight) {
    this.name = titleCase(name)
    this.sex = sex
    this.age = Number(age)
    this.height = Number(height)
    this.weight = Number(weight)
  }

  isValidName() {
    return typeof this.name === 'string' && this.name !== undefined
  }

  isValidSex() {
    return typeof this.sex === 'string' && this.sex.length === 1 && 'MF'.includes(this.sex.toUpperCase())
  }

  isValidAge() {
    return !Number.isNaN(this.age) && this.age >= 18
  }

  isValidHeight() {
    return !Number.isNaN(this.height) && this.height > 0
  }

  isValidWeight() {
    return typeof this.weight === 'number'
  }
}

const [, , ...argument] = process.argv
const [flag, name, sex, age, height, weight] = argument

const readCSV = (path) => {
  const data = fs.readFileSync(path, { encoding: 'utf-8', flag: 'r' })
  const optionsToObject = { delimiter: ',', quote: '"' }
  const objectContent = csvjson.toObject(data, optionsToObject)
  const mapObject = new Map()
  objectContent.forEach((object) => {
    mapObject.set(object.name, object)
  })
  return mapObject
}

const writeCSV = (path, statContent) => {
  const arrayContent = [...statContent.values()]
  const optionsToCSV = { delimiter: ',', wrap: false, headers: 'key' }
  const csvContent = csvjson.toCSV(arrayContent, optionsToCSV)
  fs.writeFileSync(path, csvContent)
  return true
}

const validator = (inputData) => {
  if (inputData.isValidName() === false) {
    console.log('Name Invalid')
    process.exit(1)
  }

  if (inputData.isValidSex() === false) {
    console.log('Sex Invalid')
    process.exit(1)
  }
  if (inputData.isValidAge() === false) {
    console.log('Age Invalid')
    process.exit(1)
  }
  if (inputData.isValidHeight() === false) {
    console.log('Height Invalid')
    process.exit(1)
  }
  if (inputData.isValidWeight() === false) {
    console.log('Weight Invalid')
    process.exit(1)
  }
}

const statFinder = (existingStats, statName) => {
  const foundStat = existingStats.get(statName)
  if (!foundStat) {
    console.log(`${statName} Does not exists`)
    process.exit(1)
  }
  return foundStat
}

const createStat = (existingStats, toCreateStat) => {
  if (toCreateStat.length < 6 || toCreateStat.length > 6) {
    console.log('Invalid Number of arguments, All fields must be filled')
    process.exit(1)
  } else {
    const foundStat = existingStats.get(toCreateStat.name)
    if (!foundStat) {
      validator(toCreateStat)
      existingStats.set(toCreateStat.name, toCreateStat)
    }
  }
  return existingStats
}

const readStat = (existingStats, toFindStat) => {
  if (toFindStat.length < 2 || toFindStat.length > 2) {
    console.log('Invalid Number of arguments')
    process.exit(1)
  }
  return statFinder(existingStats, toFindStat.name)
}

const updateStat = (existingStats, toUpdateStat) => {
  if (toUpdateStat.length < 6 || toUpdateStat.length > 6) {
    console.log('Invalid Number of arguments, All fields must be filled')
    process.exit(1)
  } else {
    statFinder(existingStats, toUpdateStat.name)
    validator(toUpdateStat)
    existingStats.set(toUpdateStat.name, toUpdateStat)
  }
  return existingStats
}

const deleteStat = (existingStats, toDeleteStat) => {
  if (toDeleteStat.length < 2 || toDeleteStat.length > 2) {
    console.log('Invalid Number of arguments')
    process.exit(1)
  } else {
    statFinder(existingStats, toDeleteStat.name)
    existingStats.delete(toDeleteStat.name)
  }
  return existingStats
}

const toFullSex = (_rSex) => (_rSex === 'M' ? 'Male' : 'Female')

if (argument.length < 1) {
  console.log('Invalid lack of arguments')
} else {
  const pathBiostats = 'biostats.csv'
  const statsObject = readCSV(pathBiostats)
  switch (flag) {
    case '-c': {
      const newBioSat = new BioStat(titleCase(name), String(sex).toUpperCase(), age, height, weight)
      writeCSV(pathBiostats, createStat(statsObject, newBioSat))
      console.log(`${BioStat.name} succesfully Created`)
      break
    }
    case '-r': {
      const newBioSat = new BioStat(titleCase(name))
      const foundStat = readStat(statsObject, newBioSat)
      console.log(`Name: ${foundStat.name}\nSex: ${toFullSex(foundStat.sex)}\nAge: ${foundStat.age}\nHeight: ${foundStat.height} inches || ${(foundStat.height * 2.54).toFixed(2)} cm\nWeight: ${foundStat.weight}. lbs || ${(foundStat.weight * 0.453592).toFixed(2)} kgs`)
      break
    }
    case '-u': {
      const newBioSat = new BioStat(titleCase(name), String(sex).toUpperCase(), age, height, weight)
      writeCSV(pathBiostats, updateStat(statsObject, newBioSat))
      console.log(`${BioStat.name} succesfully Updated`)
      break
    }
    case '-d': {
      const newBioSat = new BioStat(titleCase(name))
      writeCSV(pathBiostats, deleteStat(statsObject, newBioSat))
      console.log(`${BioStat.name} succesfully Deleted`)
      break
    }
    default:
      console.log(`ERROR Invalid "${flag}" Flag Argument \nUSE ONLY: \n'-c' : To Create/Add Bio\n'-r' : To Read/View Bio\n'-u' : To Update a Bio\n'-d' : To Delete a Bio`)
      process.exit(1)
  }
}
