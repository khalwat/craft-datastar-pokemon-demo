<?php

namespace khalwat\attributes;

use Attribute;

#[Attribute]
class AlbumsAttributes
{
    /**
     * @var int The ID of the album
     */
    public int $AlbumId;

    /**
     * @var string The title of the album
     */
    public string $Title;

    /**
     * @var string The ID of the artist
     */
    public string $ArtistId;
}
