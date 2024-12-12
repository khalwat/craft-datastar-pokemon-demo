<?php

namespace attributes\signals;

use Attribute;
use putyourlightson\datastar\models\SignalsModel;

#[Attribute]
class FacetedSearch extends SignalsModel
{
    /** @var string $search The search string */
    public string $search = '';

    /** @var int The generation of the Pokemon */
    public int $generation = 0;

    /** @var string The type of the Pokemon */
    public string $type = 'all';

    /** @var int The number of searches that have been done */
    public int $searchCount = 0;
}
