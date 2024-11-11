import * as fsManager from "./fsManager";
import path from "node:path";

const dir = path.join(process.cwd(), "documenti");

fsManager.esamina(dir);