<?php

namespace App\EventListener;

use App\Event\ApplicationCreatedEvent;
use App\Service\MailerService;
use Psr\Log\LoggerInterface;

class ApplicationCreatedListener
{
    private MailerService $mailerService;
    private LoggerInterface $logger;

    public function __construct(MailerService $mailerService, LoggerInterface $logger)
    {
        $this->mailerService = $mailerService;
        $this->logger = $logger;
    }

    public function onApplicationCreated(ApplicationCreatedEvent $event): void
    {
        $this->logger->info('ApplicationCreatedListener déclenché');
        $application = $event->getApplication();
        $this->mailerService->sendApplicationConfirmationToCandidate($application);
        $this->mailerService->sendNewApplicationNotificationToCompany($application);
    }
}
