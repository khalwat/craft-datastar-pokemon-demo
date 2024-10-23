<?php

namespace attributes\stores;

use Attribute;
use putyourlightson\spark\models\StoreModel;

#[Attribute]
class FacetedSearch extends StoreModel
{
    /** @var string $search The search string */
    public string $search;
}
