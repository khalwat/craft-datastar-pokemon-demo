<?php

namespace khalwat\attributes;

use Attribute;

#[Attribute]
class ArtistsAttributes
{
    /**
     * @var string The title of the artist
     */
    public string $Name;

    /**
     * @var string The ID of the artist
     */
    public string $ArtistId;
}
