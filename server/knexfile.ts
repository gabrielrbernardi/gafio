import path from 'path';

module.exports = {
    development:{
        client: 'mysql',
        connection: {
            filename: './src/database/gafioDB.sql',
            database : 'gafioDB',
            host : '127.0.0.1',
            user : 'root',
            password : 'teste123',
        },
        migrations:{
            directory: path.resolve(__dirname, 'src', 'database', 'migrations')
        },
        useNullAsDefault: true
    }
}