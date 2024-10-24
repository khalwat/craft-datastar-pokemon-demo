<?php

namespace attributes\stores;

use Attribute;
use craft\base\Model;

#[Attribute]
class PokemonStore extends Model
{
    /** @var string The name of the Pokemon */
    public ?string $pokemonName = '';

    /** @var int The entry ID of the Pokemon */
    public ?int $entryId = 0;

    /** @var bool Whether we are editing the Pokemon */
    public ?bool $editing = false;
}
