<?php

namespace App\Enum;

enum JobType: string
{
    case CDI = 'CDI';
    case CDD = 'CDD';
    case STAGE = 'STAGE';
    case ALTERNANCE = 'ALTERNANCE';

}