module.exports = {
    name: "Period",
    columns: {
        id: {
            primary: true,
            type: "int",
        },
        season: {
            type: "int"
        },
        start: {
            type: "datetime"
        },
        end: {
            type: "datetime"
       }
    }
};