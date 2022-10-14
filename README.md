# node-exercise-2

Create a command-line program that implements CRUD using a CSV file as a data source.

## The CSV File
You will use the existing [biostats.csv](biostats.csv) as your initial data source.
The default file content is as follows:

```
"name",     "sex", "age", "height", "weight"
"Alex",       "M",   41,       74,      170
"Bert",       "M",   42,       68,      166
"Carl",       "M",   32,       70,      155
"Dave",       "M",   39,       72,      167
"Elly",       "F",   30,       66,      124
"Fran",       "F",   33,       66,      115
"Gwen",       "F",   26,       64,      121
"Hank",       "M",   30,       71,      158
"Ivan",       "M",   53,       72,      175
"Jake",       "M",   32,       69,      143
"Kate",       "F",   47,       69,      139
"Luke",       "M",   34,       72,      163
"Myra",       "F",   23,       62,       98
"Neil",       "M",   36,       75,      160
"Omar",       "M",   38,       70,      145
"Page",       "F",   31,       67,      135
"Quin",       "M",   29,       71,      176
"Ruth",       "F",   28,       65,      131
```

Use NPM package [csvjson](https://www.npmjs.com/package/csvjson) to read and write CSV files.

## The Command-Line Program
The command-line program will be called `bio.js`. The program will accept 4 possible options as it's first argument.

- `-c` - to create/add a new bio to the CSV file
- `-r` - to read/view an existing bio
- `-u` - to update an existing bio
- `-d` - to delete an existing bio

Optionally use [yargs](https://www.npmjs.com/package/yargs) to process command line args

> NOTE: Elements in the `process.argv` array are ALWAYS type string. If you need to use them as any other type you'll need to convert them accordingly.

### Create/Add with `-c`
Your program will allow the creation of a new bio using the following command format.

```
node bio.js -c <name> <sex> <age> <height> <weight>
```

Where:
- `name` is a string corresponding the the person's name. Case insensitive duplicates are NOT allowed. Will be converted to capital case before they're stored.
- `sex` is a string corresponding the the person's sex. Only "f", "F", "m" and "M" will be accepted. Will be converted to uppercase before they're stored.
- `age` is a number corresponding to the person's age. Will only accept numbers greater than or equal to 18.
- `height` is a number corresponding to the person's height in inches
- `weight` is a number corresponding to the person's weight in pounds

Error conditions:
- Name already exist
- Incorrect sex
- Age not a number or underaged
- Height not a number
- Weight not a number

### Read/View with `-r`
Your program will search for and display the bio of a specified name.

```
node bio.js -c <name>
```

Where:
- `name` is a string corresponding the the person's name. Search will be conducted in a case insensitive manner.

Output will include the person's:
- name (as stored in the CSV file)
- sex (full word)
- age
- height (in both inches and centimeters)
- weight (in both pounds and kilos)

(Get creating with the format)

### Update with `-u`
Your program will allow updating an existing buil

```
node bio.js -u <name> <sex> <age> <height> <weight>
```

Where:
- `name` is a string corresponding the name of the person that will be updated. Search will be conducted in a case insensitive manner.
- `sex` is a string corresponding the the person's sex. Only "f", "F", "m" and "M" will be accepted. Will be converted to uppercase before they're stored.
- `age` is a number corresponding to the person's age. Will only accept numbers greater than or equal to 18.
- `height` is a number corresponding to the person's height in inches
- `weight` is a number corresponding to the person's weight in pounds

Error conditions:
- Name doesn't exist
- Incorrect sex
- Age not a number or underaged
- Height not a number
- Weight not a number

> NOTE: All fields must be specified and updated accordingly.

### Delete with `-d`
Your program will search for and delete the bio of a specified name.

```
node bio.js -d <name>
```

Where:
- `name` is a string corresponding the name of the person that will be deleted. Search will be conducted in a case insensitive manner.

Error conditions:
- Name doesn't exist

## Other considerations
You should create functions to:
- create a Bio object based on name, sex, age, height and weight
- create a bio
  - accepts existing array of bios and new bio object
  - returns new array of bios
- Reads bio
  - accepts name
  - returns Bio object or Null if not found
- update a bio
  - accepts existing bio array and updated bio object
  - returns new array of bios
- delete a bio
  - accepts a name and existing bio array
  - returns new bio array
- read CSV file
  - accepts file path
  - returns bio array
- writes a CSV file
  - accepts file path and bio array
  - returns Boolean indicating success or failure
  
