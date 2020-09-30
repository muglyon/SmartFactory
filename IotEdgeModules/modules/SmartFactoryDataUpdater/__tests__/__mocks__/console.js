function format(entry) {
    if (typeof entry === "object") {
        try {
            return JSON.stringify(entry);
        } catch (e) { }
    }

    return entry;
}

function log(...msgs) {
    process.stdout.write(msgs.map(format).join(" ") + "\n");
}

module.exports = {
    log,
    warn: log,
    error: log
};