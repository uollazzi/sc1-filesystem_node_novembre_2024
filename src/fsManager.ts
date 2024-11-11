import path from "node:path";
import { readdirSync, statSync } from "node:fs";
import { DateTime } from "luxon";
import chalk from "chalk";

const adesso = DateTime.local();

export const esamina = (dir: string, livello: number = 0) => {
    logDirectory(dir, livello);

    let files: string[] = [];
    let subDirs: string[] = [];

    const entities = readdirSync(dir, { withFileTypes: true });

    subDirs = entities
        .filter(dirent => dirent.isDirectory())
        .map(directory => directory.name);

    for (const subDir of subDirs) {
        esamina(path.join(dir, subDir), livello + 1);
    }

    files = entities
        .filter(dirent => dirent.isFile())
        .map(file => file.name);

    for (const file of files) {
        logFile(path.join(dir, file), livello + 1);
    }
}

const logDirectory = (dir: string, livello: number) => {
    console.log(chalk.green(`${getSeparatore(livello)}${path.basename(dir)}`));
}

const logFile = (file: string, livello: number) => {
    const modTime = DateTime.fromMillis(statSync(file).mtimeMs);

    const t = adesso.diff(modTime, "minute");

    let logString = `${getSeparatore(livello)}${path.basename(file)} (${Math.floor(t.minutes)} minuti fa)`;

    if (t.minutes < 5) {
        logString = chalk.magenta(logString);
    } else if (t.minutes < 30) {
        logString = chalk.yellow(logString);
    }

    console.log(logString);
}

const getSeparatore = (livello: number) => {
    // let sep = "|   ".repeat(livello);

    let sep = "";

    for (let i = 0; i < livello; i++) {
        sep += "|   ";
    }

    sep += "|-- ";

    return sep;
}