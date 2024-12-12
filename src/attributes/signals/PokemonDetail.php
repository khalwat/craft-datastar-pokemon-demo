<?php

namespace attributes\signals;

use Attribute;
use attributes\PokemonEntryType;
use putyourlightson\datastar\models\SignalsModel;

#[Attribute]
class PokemonDetail extends SignalsModel
{
    /** @var ?int The entry ID */
    public ?int $entryId = 0;

    /** @var ?PokemonEntryType The pokemon entry type data for `entries/save-entry */
    public ?PokemonEntryType $pokemonEntry;

    /** @var bool Whether we are editing the Pokemon */
    public ?bool $editing = false;
}
