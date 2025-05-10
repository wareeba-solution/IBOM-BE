module.exports = {
    development: {
      username: "postgres",
      password: "postgres",
      database: "akwaibom_health",
      host: "localhost",
      port: 5432,
      dialect: "postgres",
      timezone: "+01:00"
    },
    test: {
      username: "postgres",
      password: "postgres",
      database: "akwaibom_health_test",
      host: "localhost",
      dialect: "postgres"
    },
    production: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      dialect: "postgres",
      logging: false
    }
  }