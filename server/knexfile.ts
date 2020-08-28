import path from "path";

try {
   module.exports = {
      development: {
         client: "mysql",
         connection: {
            // filename: './src/database/gafioDB.sql',
            database: "gafio",
            host: "localhost",
            user: "root",
            password: "kutsu12",
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
