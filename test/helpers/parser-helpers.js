module.exports.getLocation = function (startLine, startCol, endLine, endCol) {
    return {
        start: {
            line: startLine,
            column: startCol
        },
        end: {
            line: endLine,
            column: endCol
        }
    };
};
