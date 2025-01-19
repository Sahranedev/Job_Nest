<?php
namespace App\Service;

use IntlDateFormatter;

class DateFormatterService
{
    public function formatDate(\DateTimeImmutable $date): string
    {
        $formatter = new IntlDateFormatter(
            'fr_FR',
            IntlDateFormatter::SHORT,
            IntlDateFormatter::NONE,
            'Europe/Paris',
            IntlDateFormatter::GREGORIAN,
            'dd/MM/yyyy',
        );

        return $formatter->format($date);
    }
}