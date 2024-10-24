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

    /** @var int The number of items returned by the search */
    public int $resultsCount = 0;
}
