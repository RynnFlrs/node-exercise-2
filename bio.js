const fs = require('fs')
const csvjson = require('csvjson')

class BioStat {
  constructor(name, sex, age, height, weight) {
    this.name = (typeof name === 'string' ? name.toLowerCase() : name)
    this.sex = sex
    this.age = Number(age)
    this.height = Number(height)
    this.weight = Number(weight)
  }
}

const [, , ...argument] = process.argv
const [flag, name, sex, age, height, weight] = argument

const readCSV = (path) => {
  const data = fs.readFileSync(path, { encoding: 'utf-8', flag: 'r' })
  const optionsToObject = { delimiter: ',', quote: '"' }
  const objectContent = csvjson.toObject(data, optionsToObject)
  return objectContent
}

const writeCSV = (path, objectContent) => {
  const optionsToCSV = { delimiter: ',', wrap: false, headers: 'key' }
  const csvContent = csvjson.toCSV(objectContent, optionsToCSV)
  fs.writeFileSync(path, csvContent)
  return true
}

const isNamePresent = (inputName, arr) => {
  const profile = arr.find((person) => (inputName.toLowerCase() === (person.name).toLowerCase()))
  if ((profile) !== undefined) {
    return { first: true, second: profile }
  }
  return false
}

const checkerSex = (inputSex) => {
  switch (inputSex) {
    case 'm': case 'M':
      return true
    case 'f': case 'F':
      return true
    default:
      console.log(`ERROR Invalid "${inputSex}" Sex Argument \nUSE ONLY: \n'M' : Male\n'F' : Female`)
      process.exit(1)
  }
  return undefined
}

const checkerAge = (inputAge) => {
  if (Number.isNaN(inputAge) || inputAge < 18) {
    console.log(`Invalid "${inputAge}" is invalid. Only ages 18 and above.`)
    process.exit(1)
  }
}

const checkIsNum = (inputNum) => {
  if (Number.isNaN(inputNum) || inputNum < 0) {
    console.log(`Invalid "${inputNum}" is invalid. Only number types.`)
    process.exit(1)
  }
}

const createFlag = (inputArgs, objectContent, path) => {
  const createElement = {}
  if (argument.length < 6 || argument.length > 6) {
    console.log('Invalid Number of arguments, All fields must be filled')
    process.exit(1)
  } else if (!(isNamePresent(inputArgs.name, objectContent)).first === true) {
    createElement.name = ((inputArgs.name).charAt(0).toUpperCase() + (inputArgs.name).slice(1))
    if ((checkerSex(inputArgs.sex)) === true && (!(checkerAge(inputArgs.age)))
    && (!checkIsNum(inputArgs.height)) && (!checkIsNum(inputArgs.weight))) {
      createElement.sex = (inputArgs.sex).toUpperCase()
      createElement.age = inputArgs.age
      createElement.height = inputArgs.height
      createElement.weight = inputArgs.weight
    }
    objectContent.push(createElement)
    writeCSV(path, objectContent)
    console.log(`Added Bio:\nName: ${createElement.name}\nSex: ${createElement.sex}\nAge: ${createElement.age}\nHeight: ${createElement.height} inchs\nWeight: ${createElement.weight} lbs`)
  } else {
    console.log(`${inputArgs.name} already exists`)
    process.exit(1)
  }
  return objectContent
}

const readFlag = (inputArgs, objectContent) => {
  if (argument.length < 2 || argument.length > 2) {
    console.log('Invalid Number of arguments')
    process.exit(1)
  } else if (isNamePresent(inputArgs.name, objectContent).first === true) {
    const foundPerson = (isNamePresent(inputArgs.name, objectContent)).second
    const toFullSex = (_rSex) => (_rSex === 'M' ? 'Male' : 'Female')
    console.log(`Name: ${foundPerson.name}\nSex: ${toFullSex(foundPerson.sex)}\nAge: ${foundPerson.age}\nHeight: ${foundPerson.height} inches, ${foundPerson.height * 2.54} cm\nWeight: ${foundPerson.weight} lbs, ${foundPerson.weight * 0.453592} kgs`)
  } else {
    console.log(`${inputArgs.name} not Found.`)
  }
  return objectContent
}

const updateFlag = (inputArgs, objectContent, path) => {
  const updateElement = {}
  if (argument.length < 6 || argument.length > 6) {
    console.log('Invalid Number of arguments, All fields must be filled')
    process.exit(1)
  } else if ((isNamePresent(inputArgs.name, objectContent)).first === true) {
    const foundPerson = (isNamePresent(inputArgs.name, objectContent)).second
    updateElement.name = ((inputArgs.name).charAt(0).toUpperCase() + (inputArgs.name).slice(1))
    if ((checkerSex(inputArgs.sex)) === true && (!(checkerAge(inputArgs.age)))
    && (!checkIsNum(inputArgs.height)) && (!checkIsNum(inputArgs.weight))) {
      updateElement.sex = (inputArgs.sex).toUpperCase()
      updateElement.age = inputArgs.age
      updateElement.height = inputArgs.height
      updateElement.weight = inputArgs.weight
    }
    const updatedContent = objectContent.filter((person) => person !== foundPerson)
    updatedContent.push(updateElement)
    writeCSV(path, updatedContent)
    console.log(`Updated biostats.csv file.\nAdded Bio:\nName: ${updateElement.name}\nSex: ${updateElement.sex}\nAge: ${updateElement.age}\nHeight: ${updateElement.height} inchs\nWeight: ${updateElement.weight} lbs`)
  } else {
    console.log(`${inputArgs.name} not found`)
    process.exit(1)
  }
  return objectContent
}

const deleteFlag = (inputArgs, objectContent, path) => {
  if (argument.length < 2 || argument.length > 2) {
    console.log('Invalid Number of arguments')
    process.exit(1)
  } else if ((isNamePresent(inputArgs.name, objectContent)).first === true) {
    const foundPerson = (isNamePresent(inputArgs.name, objectContent)).second
    const deletedContent = objectContent.filter((person) => person !== foundPerson)
    console.log(`Successfuly Deleted Bio Stats of ${inputArgs.name}`)
    writeCSV(path, deletedContent)
  } else {
    console.log(`${inputArgs.name} not Found.`)
  }
  return objectContent
}

if (argument.length < 1) {
  console.log('Invalid lack of arguments')
} else {
  const pathBiostats = 'biostats.csv'
  const objectContent = readCSV(pathBiostats)
  // console.log(objectContent)
  switch (flag) {
    case '-c':
      console.log(`Creating ${name} ...`)
      createFlag(new BioStat(name, sex, age, height, weight), objectContent, pathBiostats)
      break
    case '-r':
      console.log(`Reading ${name} bio ...`)
      readFlag(new BioStat(name), objectContent)
      break
    case '-u':
      console.log(`Updating ${name} bio ...`)
      updateFlag(new BioStat(name, sex, age, height, weight), objectContent, pathBiostats)
      break
    case '-d':
      console.log(`Deleting ${name} bio ...`)
      deleteFlag(new BioStat(name), objectContent, pathBiostats)
      break
    default:
      console.log(`ERROR Invalid "${flag}" Flag Argument \nUSE ONLY: \n'-c' : To Create/Add Bio\n'-r' : To Read/View Bio\n'-u' : To Update a Bio\n'-d' : To Delete a Bio`)
      process.exit(1)
  }
}
