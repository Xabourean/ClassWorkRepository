import mysql from "mysql2/promise";
import City from "../Models/City.mjs";
//import Country from "../models/country.mjs";

class DatabaseController{
  conn;

  constructor(conn) {
    this.conn = conn;
  }

  /* Establish database connection and return the instance */
  static async connect() {
    const conn = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: 'user',
        password: 'password',
        database: 'world',
        port: "3306",
    });

    return new DatabaseController(conn);
  }

  /* Get a list of all cities */
  async getCities() {
    try {
      // Fetch cities from database
      const data = await this.conn.execute("SELECT * FROM city LIMIT 10;");
      return data;
    } catch (err) {
      // Handle error...
      console.error(err);
      return undefined;
    }
  }


  async getCountries() {
    try {
      // Fetch cities from database
      const data = await this.conn.execute(
        "SELECT Code, Name, Continent, Region, SurfaceArea, IndepYear, Population, Capital FROM country LIMIT 30;"
      );
      return data;
    } catch (err) {
      // Handle error...
      console.error(err);
      return undefined;
    }
  }

  async getCountriesStartWith(Name) {
    try {
      // Fetch cities from database
      const data = await this.conn.execute(
        `SELECT Code, Name, Continent, Region, SurfaceArea, IndepYear, Population, Capital FROM country WHERE Name LIKE '${Name}%' `
      );
      return data;
    } catch (err) {
      // Handle error...
      console.error(err);
      return undefined;
    }
  }

  async getCounty(Name) {
    try {
      // Fetch cities from database
      const data = await this.conn.execute(
        `SELECT Code, Name, Continent, Region, SurfaceArea, IndepYear, Population, Capital FROM country WHERE Name='${Name}';`
      );
      return data;
    } catch (err) {
      // Handle error...
      console.error(err);
      return undefined;
    }
  }

  async deleteCountry(Name) {
    try {
      // //Part 1
      // console.log("DataBase/ Name");
      // console.log(Name);
      // console.log();
      // const sql1 = `SELECT Code FROM country WHERE Name='${Name}';`;
      // const data = await this.conn.execute(sql1);
      // const Code = data[0][0].Code;
      // console.log("DataBase/ Code");
      // console.log(Code);

      // console.log();


      // //Part 2
      // const sql2 = `DELETE FROM countrylanguage WHERE CountryCode='${Code}';`;
      // const r1 = await this.conn.execute(sql2);
      // console.log(r1);

      //Part 3
      const sql = `DELETE FROM country WHERE Name='${Name}';`;
      const r2 = await this.conn.execute(sql);
      console.log(r2);
      return data;
    } catch (err) {
      // Handle error...
      console.error(err);
      return undefined;
    }
  }

  /* Get a particular city by ID, including country information */
  async getCity(cityId) {
    const sql = `
        SELECT city.*, country.Name AS Country, country.Region, country.Continent, country.Population as CountryPopulation
        FROM city
        INNER JOIN country ON country.Code = city.CountryCode
        WHERE city.ID = ${cityId}
    `;
    const [rows, fields] = await this.conn.execute(sql);
    /* Get the first result of the query (we're looking up the city by ID, which should be unique) */
    const data = rows[0];
    const city = new City(
      data.ID,
      data.Name,
      data.CountryCode,
      data.District,
      data.Population
    );
    const country = new Country(
      data.Code,
      data.Country,
      data.Continent,
      data.Region,
      data.CountryPopulation
    );
    city.country = country;
    return city;
  }
}



 
export default DatabaseController;