#!/usr/bin/env node
//
// Konzolna NodeJS aplikacija, ki omogoca uporabniku iskanje po imeniku. Uporabnika povprasa
// ali zeli nadaljevati z iskanjem, po imenu datoteke (lahko jo vnese kot parameter ob zagonu)
// po kateri iscemo, po filtru (iskalni niz) in po poljih po katerih naj iscemo. Rezultati se
// nato obarvano izpisejo na zaslon.
//
// Spletne tehnologije, mag R-IT, 2018
//
// @author David Rubin

const XLSX = require('xlsx');
const inquirer = require('inquirer');
const chalk = require('chalk');
const dialog = require('dialog');
const program = require('commander');

// Vprasanje, ki ga dodamo v kolikor se ob zagonu ne poda ime datoteke
const filenameQ = {
    type: 'input',
    name: 'fileName',
    message: 'Ime datoteke:',
    default: 'MojImenik.xlsx',
};

// Splosna vprasanja za filtriranje po imeniku
const questions = [
    {
        type: 'list',
        name: 'searchConfirm',
        message: 'Želite potrditi iskanje?',
        default: 'No',
        choices: [
            'Yes',
            'No'
        ],
        filter: answer => {
            // Uporabi filter, da preveris ali je potrebno ugasniti program
            // (v primeru da je odgovor 'No'), validate ne dela na list
            if (answer == 'No')
                process.exit(0);
        },
    },
    {
        type: 'input',
        name: 'searchFilter',
        message: 'Vpišite filter:',
    },
    {
        type: 'checkbox',
        name: 'searchFields',
        message: 'Po katerih poljih želite iskati?',
        choices: [
            {
                name: 'Ime',
            },
            {
                name: 'Priimek',
            },
            {
                name: 'Številka',
            },
        ],
        validate: answer => {
            // Izbere naj vsaj eno polje
            if (answer.length < 1) {
                return 'Prosim izberite vsaj eno polje.';
            }
            return true;
        },
    },
];

// Commander opcije (verzija, help, --file <ime datoteke>)
program
  .version('0.1.0')
  .option('-f, --file <file>', 'The phonebook filename')
  .parse(process.argv);

// Ce uporabnik ob zagonu ni podal znacke -f, med vprasanju se vprasaj za ime datoteke
if (!program.file) {
    questions.splice(1, 0, filenameQ);
}

// Uporabniku postavi vprasanja, in v callback poberi odgovore
inquirer.prompt(questions).then( answers => {
    // V kolikor je bilo ime datoteke nastavljeno ob zagonu ga dodaj med odgovore
    if (!answers.fileName) {
        answers.fileName = program.file;
    }
    // Preberi XLSX datoteko in jo shrani v data
    let wb = XLSX.readFile(answers.fileName);
    let data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {header:1});

    // V imeniku odstrani header, tega shrani loceno
    // header tudi prepisi v dict, kjer glede na ime polja dobimo pozicijo stolpca
    const header = {}
    for (let i=0; i<data[0].length; i++) {
        header[data[0][i]] = i;
    }
    // Imenik loci od headerja in ga shrani v novo spremenljivko
    const phonebook = data.slice(1, data.length);
    
    // Preveri ali je iskalni filter vecji od 0 (ali sploh iscemo s cem)
    // V kolikor je 0 izpisi celoten imenik
    if (answers.searchFilter.length > 0) {
        lookForPeople(phonebook, header, answers.searchFields, answers.searchFilter).then( result => {
            // Ce ni bilo najdene osebe, obvesti uporabnika z dialogom
            if (result.noMatch) {
                dialog.info("Ni bilo zadetkov", 'Obvestilo');
            }
        });
    } else {
        // Uporabnik je podal prazno polje za filter, privzemi da zeli izpisati vse osebe v imeniku
        phonebook.forEach(person => {
            personStr = " ";
            for (col in person) {
                personStr += person[col];
                personStr += ' ';
            }
            console.log(personStr);
        });
    }
});

// V imeniku isce po podanih stolpcih za iskanim nizom
// Iskani niz obarva rdece s rumenim ozadjem in ga podcrta znotraj vrstice
// Izpise samo vrstice, kjer je bil iskani niz najden
async function lookForPeople(phonebook, header, searchFields, searchFilter) {
    let noMatch = true; // ali je sploh katera oseba v imeniku najdena?
    phonebook.forEach(person => {
        // Preleti osebe v imeniku, in glede na izbrana iskalna polja in filtre isci in izpisuj
        let personPrint = ""; // String katerega sestavljamo za osebo, ce je bilo kaj najdeno
        let personMatch = false; // Ali se iskani niz pojavi pri osebi?
        for (var col in header) {
            let i = header[col]; // index stolpca            
            if (searchFields.includes(col)) {
                // Uporabnik zeli iskati po tem polju

                // Spremeni v string in indeksiraj stringe
                person[i] = person[i].toString()
                let pos = 0;
                let oldPos = 0;
                let indices = [];
                // Isci po celem stringu kje se nahajajo pozicije
                while ((pos = person[i].indexOf(searchFilter, oldPos)) > -1) {
                    indices.push(pos);
                    oldPos = pos + searchFilter.length;
                }
                oldPos = 0;
                // Barvaj stringe, kjer so bile najdene pozicije
                for (let j=0; j<indices.length; j++) {
                    personMatch = true;
                    noMatch = false;
                    // Pridobi substr od nepobarvanega dela
                    personPrint += person[i].substr(oldPos, indices[j] - oldPos);
                    // Pridobi del, ki ga je treba pobarvat
                    personPrint += chalk.yellow(
                        chalk.underline(
                        chalk.bold(
                        chalk.bgMagenta(
                            person[i].substr(indices[j], searchFilter.length)
                        ))));
                    // Popravi staro pozicijo na zaden char zapisan v newPerson
                    oldPos = indices[j] + searchFilter.length;
                }
                // V kolikor je za zadnjo najdeno pozicijo se kaj, dodaj v string (nepobarvano)
                if (oldPos < person[i].length) {
                    personPrint += person[i].substr(oldPos, person[i].length - oldPos);
                }
                personPrint += " "
            } else {
                // Vseeno dodaj stolpec v string, v primeru da se isce po ostalih stolpcih
                personPrint += person[i] + " ";
            }
        }
        if (personMatch) {
            // Izpisi trenuten personPrint kot zadetek (pobarvani deli vkljuceni)
            console.log(personPrint);
        }
    });
    // Obvesti ali je bil kdo najden
    let result = {"noMatch": noMatch};
    return result;
}