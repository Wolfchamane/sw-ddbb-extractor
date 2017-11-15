const XHR = require('./_xhr');

class SWCharacter extends XHR
{
    constructor(host = '', id = 0)
    {
        super();
        this.host = host;
        this.path = `people/${id}`;
    }
}

class SWFilm extends XHR
{
    constructor(host = '', id = 0)
    {
        super();
        this.host = host;
        this.path = `films/${id}`;
    }
}

class SWPlanet extends XHR
{
    constructor(host = '', id = 0)
    {
        super();
        this.host = host;
        this.path = `planets/${id}`;
    }
}

class SWSpecies extends XHR
{
    constructor(host = '', id = 0)
    {
        super();
        this.host = host;
        this.path = `species/${id}`;
    }
}

class SWStarship extends XHR
{
    constructor(host = '', id = 0)
    {
        super();
        this.host = host;
        this.path = `starships/${id}`;
    }
}

class SWVehicle extends XHR
{
    constructor(host = '', id = 0)
    {
        super();
        this.host = host;
        this.path = `vehicles/${id}`;
    }
}

module.exports = {
    SWCharacter,
    SWFilm,
    SWPlanet,
    SWSpecies,
    SWStarship,
    SWVehicle
};
