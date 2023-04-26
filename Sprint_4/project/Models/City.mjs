export default class City
{
    // City ID
    ID;
    Name;
    CountryCode;
    District;
    Population;

    constructor(ID, Name, CountryCode, District, Population) 
    {
        this.ID = ID;
        this.Name = Name;
        this.CountryCode = CountryCode;
        this.District = District;
        this.Population = Population;
    }
}
