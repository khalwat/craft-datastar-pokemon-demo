<?php

namespace attributes\stores;

use Attribute;
use craft\elements\Entry;
use putyourlightson\spark\models\StoreModel;

#[Attribute]
class PokemonDetail extends StoreModel
{
    /** @var ?int The entry ID */
    public ?int $entryId = 0;

    /** @var ?Entry The Pokemon entry for `entries/save-entry */
    public ?Entry $pokemonEntry;

    /** @var bool Whether we are editing the Pokemon */
    public ?bool $editing = false;
}
