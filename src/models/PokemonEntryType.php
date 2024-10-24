<?php

namespace models;

use craft\base\Model;

class PokemonEntryType extends Model
{
    /** @var ?int The Pokedex ID of the Pokemon */
    public ?int $pokemonId = 0;

    /** @var ?string The name of the Pokemon */
    public ?string $pokemonName = '';

    /** @var ?string The form of the Pokemon */
    public ?string $pokemonForm = '';

    /** @var ?string The first type of the Pokemon */
    public ?string $type1 = '';

    /** @var ?string The second type of the Pokemon */
    public ?string $type2 = '';

    /** @var ?int The generation of the Pokemon */
    public ?int $generation = 0;
}
