<?php

namespace attributes\stores;

use Attribute;
use craft\base\Model;

#[Attribute]
class PokemonEntryType extends Model
{
    /** @var int The entry ID */
    public ?int $entryId = 0;

    /** @var int The Pokedex ID of the Pokemon */
    public ?int $pokemonId = 0;

    /** @var string The name of the Pokemon */
    public ?string $pokemonName = '';

    /** @var string The form of the Pokemon */
    public ?string $pokemonForm = '';

    /** @var string The first type of the Pokemon */
    public ?string $type1 = '';

    /** @var string The second type of the Pokemon */
    public ?string $type2 = '';

    /** @var int The generation of the Pokemon */
    public ?int $generation = 0;

    /** @var bool Whether we are editing the Pokemon */
    public ?bool $editing = false;
}
