export default class Country {

    Code;
    Name;
    Continent;
    Region;
    SurfaceArea;
    IndepYear;
    Population;
    Capital;

  constructor(Code, Name, Continent, Region, SurfaceArea, IndepYear, Population, LifeExpectancy, GNP, GNPOld, LocalName, GovernmentForm, HeadOfState, Capital, Code2) {
    this.Code = Code;
    this.Name = Name;
    this.Continent = Continent;
    this.Region = Region;
    this.SurfaceArea = SurfaceArea;
    this.IndepYear = IndepYear;
    this.Population = Population;
    this.Capital = Capital;
  }
}