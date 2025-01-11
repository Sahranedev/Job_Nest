<?php

namespace App\Enum;

enum ApplicationStatus: string
{
    case SUBMITTED = 'SUBMITTED';
    case UNDER_REVIEW = 'UNDER REVIEW';
    case REJECTED = 'REJECTED';

    case ACCEPTED = 'ACCEPTED';
    
}