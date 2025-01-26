<?php

namespace App\Event;

use App\Entity\Application;

class ApplicationCreatedEvent
{
    private Application $application;

    public function __construct(Application $application)
    {
        $this->application = $application;
    }

    public function getApplication(): Application
    {
        return $this->application;
    }
}
