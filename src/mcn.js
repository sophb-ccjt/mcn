/* MCN (Macro-based Cube Notation) */
function MCNwrapper() {
    // base patterns
    const primitive = '[UDFBLRudfblrMESxyz]w?';
    const count = '[2-9][0-9]*';
    const space = '[ \\t]';
    const macroName = '[^{}=\\r\\n\\f]+';
    const macro = `\\{${macroName}\\}`;
    const alg = `(?:${space}*\\(?${space}*(?:${primitive}|${macro})(?:${count})?'?${space}*(?:\\)(?:${count})?)?${space}*)+${space}*`;
    
    // regexes
    const commentRegex = /^#[^\r\n\f]*/;
    
    const moveRegex = new RegExp(`(?:${count}(?:-${count})?)?${primitive}(?:${count})?'?`);
    
    const macroRegex = /\{[^{}=\r\n\f]+\}/g,
        macroCapRegex = /\{([^{}=\r\n\f]+)\}/g,
        macroDefRegex =
            new RegExp(`^${space}*(${macroName})${space}*=${space}*(${alg})`);
    
    const algRegex = new RegExp(`^${alg}$`);
    
    
    // values
    const noDef = '∅';
    const consolePrefix = '[MCN]:';
    
    // helpers
    function cloneRegex(regex) {
        return new RegExp(regex.source, regex.flags);
    }
    function log(...args) {
        console.log(...[consolePrefix, ...args]);
    }
    function warn(...args) {
        console.warn(...[consolePrefix, ...args]);
    }
    function error(...args) {
        console.error(...[consolePrefix, ...args]);
    }
    
    // functions
    function getVars(alg) {
        const regexClone = cloneRegex(macroCapRegex);
        const matches = [...alg.matchAll(regexClone)];
        const vars = matches.map(m => m[1].trim());
        return vars;
    }
    function expandAlg(alg, vars = {}) {
        const maxLoops = 128;
        let loops = 0;
        let prev;
        let expAlg = alg;

        do {
            prev = expAlg;
            expAlg = expAlg.replace(cloneRegex(macroCapRegex), (_, name) => {
                name = name.trim();
                if (vars[name] != null) {
                    return vars[name];
                } else {
                    warn(`Undefined macro "${name}" detected while expanding.`);
                    return noDef;
                }
            });
            loops++
        } while (expAlg !== prev && loops < maxLoops);

        if (loops === maxLoops) {
            error(`Macro expansion limit reached (${maxLoops} loops). Possible recursion?`)
            return alg;
        }
        return expAlg;
    }
    function parseMCN(mcnText) {
        try {
            const lines = mcnText.split(/\r?\n/).map(v => v.trim());
        
            // output values
            const vars = {};
            let algs = [], expAlgs;
        
            // parser loop
            for (const line of lines) {
                if (commentRegex.test(line) || line.trim().length === 0)
                    continue;
        
                const cleanLine = line.replace(/#.*$/, '').trim();
        
                if (macroDefRegex.test(cleanLine)) {
                    const match = macroDefRegex.exec(cleanLine);
                    if (match) {
                        const groups = match.slice(1).map(v => v.trim());
            
                        vars[groups[0]] = groups[1];
                    }
                    continue;
                }
                if (algRegex.test(cleanLine)) {
                    algs.push(cleanLine);
                }
            }
            expAlgs = algs.map(alg => expandAlg(alg, vars));
            return {
                vars,
                algs,
                expAlgs
            }
        } catch (err) {
            error(err?.message ?? err);
            throw err;
        }
    }
    async function parseMCNFile(relPath) {
        if (typeof require !== 'undefined') {
            const fs = require('fs').promises;
            return fs.readFile(relPath, 'utf8')
                .then(parseMCN)
                .catch(err => {
                    error('Error reading file:', err);
                });
        } else {
            return Promise.reject(new Error('"require" is missing'))
        }
    }
    
    return {
        parseMCN,
        expandAlg,
        getVars,
        moveRegex,
        algRegex,
        macroRegex,
        parseMCNFile,
        version: '1.0.0'
    };
}

const MCN = MCNwrapper();
if (typeof module !== 'undefined') {
    // CommonJS
    module.exports = {
        MCN,
        ...MCN
    };
} else {
    // Browser
    delete MCN.parseMCNFile;
}
Object.freeze(MCN);
