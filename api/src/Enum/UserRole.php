<?php

namespace App\Enum;

enum UserRole: string
{
    case CANDIDATE = 'CANDIDATE';
    case RECRUITER = 'RECRUITER';
    case ADMIN = 'ADMIN';
}