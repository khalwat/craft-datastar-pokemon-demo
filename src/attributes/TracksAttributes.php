<?php

namespace khalwat\attributes;

use Attribute;

#[Attribute]
class TracksAttributes
{
    public int $TrackId;

    /**
     * @var string The name of the track
     */
    public string $Name;

    /**
     * @var int The ID of the album
     */
    public int $AlbumId;

    /**
     * @var int The type of media
     */
    public int $MediaType;

    /**
     * @var int The ID of the genre
     */
    public int $GenreId;

    /**
     * @var string The name of the composer
     */
    public string $Composer;

    /**
     * @var int The length of the track in milliseconds
     */
    public int $Milliseconds;

    /**
     * @var int The length of the track in bytes
     */
    public int $Bytes;

    /**
     * @var float The unit price of the track
     */
    public float $UnitPrice;
}
