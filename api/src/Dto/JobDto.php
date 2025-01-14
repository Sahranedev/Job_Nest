<?php

namespace App\Dto;

class JobDto
{
    public ?int $id;
    public ?string $title;
    public ?string $description;
    public ?string $location;
    public ?string $type;
    public ?string $companyName;

    public function __construct(
        ?int $id,
        ?string $title,
        ?string $description,
        ?string $location,
        ?string $type,
        ?string $companyName,
    ) {
        $this->id = $id;
        $this->title = $title;
        $this->description = $description;
        $this->location = $location;
        $this->type = $type;
        $this->companyName = $companyName;
    }
}
