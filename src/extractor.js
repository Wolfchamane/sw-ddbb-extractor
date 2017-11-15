/*eslint no-console: 0*/
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const {SWCharacter, SWFilm, SWPlanet, SWSpecies ,SWStarship, SWVehicle} = require('./_models');

const constructors = {
    characters   : SWCharacter,
    planets      : SWPlanet,
    species      : SWSpecies,
    starships    : SWStarship,
    vehicles     : SWVehicle
};

module.exports = class SWExtractor extends EventEmitter
{
    constructor()
    {
        super();
        this.host = 'https://swapi.co/api';
        this.MAX_MOVIES = 7;
        this.films = [];
        this.characters = [];
        this.planets = [];
        this.species = [];
        this.starships = [];
        this.vehicles = [];
    }

    _writer(fileName = '', content = null)
    {
        let outputFile = path.resolve(__dirname, `../output/${fileName}.json`);
        console.log(`Writing file: ${chalk.green(outputFile)}`);
        fs.writeFileSync(outputFile, JSON.stringify(content, null, 4));
    }

    fetchVehicles()
    {
        this.on(`vehicles-fetched`, function() {
            this.emit('complete');
        }.bind(this));
        this.fetcher('vehicles');
    }

    fetchStarships()
    {
        this.on(`starships-fetched`, this.fetchVehicles.bind(this));
        this.fetcher('starships');
    }

    fetchSpecies()
    {
        this.on(`species-fetched`, this.fetchStarships.bind(this));
        this.fetcher('species');
    }

    fetchPlanets()
    {
        this.on(`planets-fetched`, this.fetchSpecies.bind(this));
        this.fetcher('planets');
    }

    fetchCharacters()
    {
        this.on(`characters-fetched`, this.fetchPlanets.bind(this));
        this.fetcher('characters');
    }

    fetcher(key = '')
    {
        this.films.forEach(film =>
        {
            let lastResponse = film._lastResponse;
            if (Array.isArray(lastResponse[key]))
            {
                lastResponse[key].forEach(item =>
                {
                    let id = Number(item.match(/\d+/g).pop());
                    if (!this[key].includes(id))
                    {
                        this[key].push(id);
                    }
                });
            }
        });
        this[key].sort((numA, numB) =>
        {
            return numA < numB
                ? -1
                : numA > numB
                    ? 1
                    : 0;
        });
        let requests = [];
        this[key] = this[key].map(id =>
        {
            let clazz = new constructors[key](this.host, id);
            requests.push(clazz.fetch());
            return clazz;
        });
        Promise.all(requests).then(responses =>
        {
            this._writer(key, responses);
            this.emit(`${key}-fetched`);
        });
    }

    fetchFilms()
    {
        for (let i = this.MAX_MOVIES, l = 0; i > l; --i)
        {
            this.films.push(new SWFilm(this.host, i));
        }
        let requests = this.films.map(item => item.fetch());
        return Promise.all(requests).then(responses =>
        {
            if (Array.isArray(responses))
            {
                responses.sort((a, b) =>
                {
                    return a.episodeId < b.episodeId
                        ? -1
                        : a.episodeId > b.episodeId
                            ? 1
                            : 0;
                });
            }
            this._writer('films', responses);
            this.fetchCharacters();
        });
    }
};
