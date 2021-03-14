import path from "path";

try {
    module.exports = {
        development: {
            client: "mysql2",
            connection: {
                database: "gafioDB",
                //host: "18.208.110.189",
                // host: "3.88.186.254",
                host: "http://ec2-3-88-186-254.compute-1.amazonaws.com",
                // host: "127.0.0.1",
                // host: "192.168.100.7", //host para conexao pelo docker em maquina local
                // port: "3307",   //porta para conexao com mysql via docker
                user: "root",
                //password: "teste123",
                // password: "kutsu12",
                password: "teste123",
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
