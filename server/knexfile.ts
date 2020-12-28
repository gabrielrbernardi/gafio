import path from "path";

try {
    module.exports = {
        development: {
            client: "mysql2",
            connection: {
                database: "gafioDB",
                host: "127.0.0.1",
                // host: "192.168.100.7", //host para conexao pelo docker em maquina local
                // port: "3306",   //porta para conexao com mysql via docker
                user: "root",
                password: "teste123",
                // password: "kutsu12",
                //password: "Dsw04051977@",
                //password: "0000"
            },
            migrations: {
                directory: path.resolve(__dirname, "src", "database", "migrations"),
            },
            useNullAsDefault: true,
        },
    };
} catch (err) {
    console.log(err);
}
