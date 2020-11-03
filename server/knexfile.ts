import path from "path";

try {
    module.exports = {
        development: {
            client: "mysql2",
            connection: {
                // filename: './src/database/gafioDB.sql',
                database: "gafioDB",
                host: "localhost",
                user: "root",
                password: "0000",
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
