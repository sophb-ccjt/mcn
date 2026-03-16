function handle() {
    try {
        const parsed = MCN.parse(input.value);
        const str =
`Variables:
${Object.entries(parsed.vars).length > 0 ?
    Object.entries(parsed.vars)
        .map(v => `"${v[0]}": ${v[1]}`)
        .join('\n\n')
    :
        '(none)'
}

Algorithms:
${parsed.algs.join('\n\n')}

Expanded Algorithms:
${parsed.expAlgs.join('\n\n')}`

        output.value = str;
    } catch (err) {
        output.value = `Error:\n${err?.message ?? err}`;
    }
}
input.addEventListener('input', handle);
document.addEventListener('load', handle);
