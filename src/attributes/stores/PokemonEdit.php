<?php

namespace attributes\stores;

use Attribute;
use craft\base\Model;

#[Attribute]
class PokemonEdit extends Model
{
    /** @var int The entry ID of the Pokemon */
    public ?int $entryId = 0;

    /** @var string The name of the Pokemon */
    public ?string $pokemonName = '';

    /** @var bool Whether we are editing the Pokemon */
    public ?bool $editing = false;
}
