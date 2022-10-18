const fs = require('fs')
const csvjson = require('csvjson')

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
    console.log(`Invalid "${age}" is invalid. Only ages 18 and above.`)
    process.exit(1)
  }
}

const checkIsNum = (inputNum) => {
  if (Number.isNaN(inputNum)) {
    console.log(`Invalid "${inputNum}" is invalid. Only number types.`)
    process.exit(1)
  }
}

const createFlag = (inputName, objectContent, path) => {
  const createElement = {}
  if (argument.length < 6 || argument.length > 6) {
    console.log('Invalid Number of arguments, All fields must be filled')
    process.exit(1)
  } else if (!(isNamePresent(inputName, objectContent)).first === true) {
    createElement.name = (name.charAt(0).toUpperCase() + name.slice(1))
    if ((checkerSex(sex)) === true && (!(checkerAge(Number(age))) === true)
    && (!checkIsNum(Number(height))) && (!checkIsNum(Number(weight)))) {
      createElement.sex = sex.toUpperCase()
      createElement.age = age
      createElement.height = height
      createElement.weight = weight
    }
    objectContent.push(createElement)
    writeCSV(path, objectContent)
    console.log(`Added Bio:\nName: ${createElement.name}\nSex: ${createElement.sex}\nAge: ${createElement.age}\nHeight: ${createElement.height} inchs\nWeight: ${createElement.weight} lbs`)
  } else {
    console.log(`${name} already exists`)
    process.exit(1)
  }
}

const readFlag = (inputName, objectContent) => {
  if (argument.length < 2 || argument.length > 2) {
    console.log('Invalid Number of arguments')
    process.exit(1)
  } else if (isNamePresent(inputName, objectContent).first === true) {
    const foundPerson = (isNamePresent(inputName, objectContent)).second
    const toFullSex = (_rSex) => (_rSex === 'M' ? 'Male' : 'Female')
    console.log(`Name: ${foundPerson.inputName}\nSex: ${toFullSex(foundPerson.sex)}\nAge: ${foundPerson.age}\nHeight: ${foundPerson.height} inches, ${foundPerson.height * 2.54} cm\nWeight: ${foundPerson.weight} lbs, ${foundPerson.weight * 0.453592} kgs`)
  } else {
    console.log(`${inputName} not Found.`)
  }
  return objectContent
}

const updateFlag = (inputName, objectContent, path) => {
  const updateElement = {}
  if (argument.length < 6 || argument.length > 6) {
    console.log('Invalid Number of arguments, All fields must be filled')
    process.exit(1)
  } else if ((isNamePresent(inputName, objectContent)).first === true) {
    const foundPerson = (isNamePresent(inputName, objectContent)).second
    updateElement.name = (name.charAt(0).toUpperCase() + name.slice(1))
    if ((checkerSex(sex)) === true && !(checkerAge(Number(age))) === true
    && (!checkIsNum(Number(height))) && (!checkIsNum(Number(weight)))) {
      updateElement.sex = sex.toUpperCase()
      updateElement.age = age
      updateElement.height = height
      updateElement.weight = weight
    }
    const foundAtIndex = objectContent.indexOf(foundPerson)
    objectContent.splice(foundAtIndex, 1, updateElement)
    writeCSV(path, objectContent)
    console.log(`Updated biostats.csv file.\nAdded Bio:\nName: ${updateElement.name}\nSex: ${updateElement.sex}\nAge: ${updateElement.age}\nHeight: ${updateElement.height} inchs\nWeight: ${updateElement.weight} lbs`)
  } else {
    console.log(`${inputName} not found`)
    process.exit(1)
  }
  return objectContent
}

const deleteFlag = (inputName, objectContent, path) => {
  if (argument.length < 2 || argument.length > 2) {
    console.log('Invalid Number of arguments')
    process.exit(1)
  } else if ((isNamePresent(inputName, objectContent)).first === true) {
    const foundPerson = (isNamePresent(inputName, objectContent)).second
    objectContent.splice(foundPerson, 1)
    console.log(`Successfuly Deleted Bio Stats of ${name}`)
    writeCSV(path, objectContent)
  } else {
    console.log(`${name} not Found.`)
  }
  return objectContent
}

if (argument.length < 1) {
  console.log('Invalid lack of arguments')
} else {
  const pathBiostats = 'biostats.csv'
  const objectContent = readCSV(pathBiostats)

  switch (flag) {
    case '-c':
      console.log(`Creating ${name} ...`)
      createFlag(name, objectContent, pathBiostats)
      break
    case '-r':
      console.log(`Reading ${name} bio ...`)
      readFlag(name, objectContent)
      break
    case '-u':
      console.log(`Updating ${name} bio ...`)
      updateFlag(name, objectContent, pathBiostats)
      break
    case '-d':
      console.log(`Deleting ${name} bio ...`)
      deleteFlag(name, objectContent, pathBiostats)
      break
    default:
      console.log(`ERROR Invalid "${flag}" Flag Argument \nUSE ONLY: \n'-c' : To Create/Add Bio\n'-r' : To Read/View Bio\n'-u' : To Update a Bio\n'-d' : To Delete a Bio`)
      process.exit(1)
  }
}
