<?php

namespace attributes\stores;

use Attribute;
use putyourlightson\spark\models\StoreModel;

#[Attribute]
class FacetedSearch extends StoreModel
{
    /** @var string $search The search string */
    public string $search = '';

    /** @var int The generation of the Pokemon */
    public int $generation = 0;

    /** @var string The type of the Pokemon */
    public string $type = 'all';

    /** @var int The number of searches that have been done */
    public int $searchCount = 0;

    /** @var int The number of characters that have been typed */
    public int $characterCount = 0;
}
