<?php

namespace attributes;

use Attribute;

#[Attribute]
class PokemonEntryType
{
    /** @var int The entry ID */
    public int $entryId;

    /** @var int The Pokedex ID of the Pokemon */
    public int $pokemonId;

    /** @var string The name of the Pokemon */
    public string $pokemonName;

    /** @var string The form of the Pokemon */
    public string $pokemonForm;

    /** @var string The first type of the Pokemon */
    public string $type1;

    /** @var string The second type of the Pokemon */
    public string $type2;

    /** @var int The generation of the Pokemon */
    public int $generation;

    /** @var bool Whether we are editing the Pokemon */
    public bool $editing;
}
