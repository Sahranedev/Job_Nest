<?php

namespace App\Service;

use App\Entity\Application;
use App\Entity\User;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class MailerService
{
    private MailerInterface $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }




    // Envoie un email au candidat pour lui confirmer qu'il vient de postuler

    public function sendApplicationConfirmationToCandidate(Application $application): void
    {
        $candidateEmail = $application->getUser()->getEmail();

        $email = (new Email())
            ->from('no-reply@nestjob.com')
            ->to($candidateEmail)
            ->subject('Votre candidature a bien été reçue !')
            ->text(sprintf(
                "Bonjour %s,\n\nMerci d’avoir postulé à l’offre : %s.\nVotre candidature est bien enregistrée.",
                $application->getUser()->getFirstName(),
                $application->getJob()->getTitle(),
            ));

        $this->mailer->send($email);
    }


    // Envoie un email à la company pour la notifier qu'une nouvelle candidature est arrivée 

    public function sendNewApplicationNotificationToCompany(Application $application): void
    {
        // company ici = utilisateur avec le rôle ROLE_RECRUITER
        $companyEmail = $application
            ->getJob()
            ->getCompany()
            ->getUser()
            ->getEmail();

        $email = (new Email())
            ->from('no-reply@nestjob.com')
            ->to($companyEmail)
            ->subject('Nouvelle candidature reçue')
            ->text(sprintf(
                "Bonjour,\n\nUne nouvelle candidature pour le job \"%s\" vient d’être déposée par %s %s.\nCover letter: %s",
                $application->getJob()->getTitle(),
                $application->getUser()->getFirstName(),
                $application->getUser()->getLastName(),
                $application->getCoverLetter() ?: 'Aucune lettre de motivation'
            ));

        $this->mailer->send($email);
    }

    public function sendRegistrationConfirmation(User $user): void
    {
        $userEmail = $user->getEmail();
        $email = (new Email())
            ->from('no-reply@nestjob.com')
            ->to($userEmail)
            ->subject('Bienvenue sur JobNest !')
            ->text(sprintf(
                "Bonjour %s,\n\nMerci pour votre confiance, \nBienvenue au sein de l'application JobNest.",
                $user->getFirstName(),
                $user->getEmail(),
            ));

        $this->mailer->send($email);
    }
}
