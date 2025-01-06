import consola from "consola";
import fs from "fs";

const log_level = [
    ['fatal', 'error', 'warn'],
    ['log', 'info', 'success', 'fail'],
    ['ready', 'start', 'debug', 'box'],
    ['trace'],
    ['verbose'],
    ['silent']
];

function write(path: string, data: string) {
    if(fs.existsSync(path)) {
        fs.appendFileSync(path, '\n' + data);
    } else {
        fs.writeFileSync(path, data);
    }
}

function shouldLog(level: number, log_type: string) {
    let should = false;
    if(level > log_level.length) return true
    for(let i = 0; i <= level; i++) {
        should = log_level[i].includes(log_type) || should;
    }

    return should
}

const log = consola.addReporter({
    log(log) {
        if(log.tag !== 'write') return

        const logging = log.args.length > 0 && shouldLog(log.level, log.type)
        if(!logging) return

        const date = log.date.toLocaleDateString('fr', {
            dateStyle: 'short'
        })
            .replaceAll('/', '-');
        
        const time = log.date.toLocaleTimeString('fr', {
            timeStyle: 'short'
        })
        write(`../data/logs/${date}.txt`, `[${time}] ` + log.args.join(' '));
    }
});

export default log.withTag('write');