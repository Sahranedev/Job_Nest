<?php

namespace App\EventListener;

use App\Event\RegistrationEvent;
use App\Service\MailerService;
use Psr\Log\LoggerInterface;

class RegistrationListener
{
    private MailerService $mailerService;
    private LoggerInterface $logger;

    public function __construct(MailerService $mailerService, LoggerInterface $logger)
    {
        $this->mailerService = $mailerService;
        $this->logger = $logger;
    }

    public function onRegistration(RegistrationEvent $event): void
    {
        $this->logger->info('RegistrationEvent déclenché');
        $user = $event->getUser();
        $this->mailerService->sendRegistrationConfirmation($user);
    }
}
