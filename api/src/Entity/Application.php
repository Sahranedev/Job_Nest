<?php

namespace App\Entity;

use App\Repository\ApplicationRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Enum\ApplicationStatus;


#[ORM\Entity(repositoryClass: ApplicationRepository::class)]
class Application
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $cover_letter = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $resume_path = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'applications')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'applications')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Job $job = null;

    #[ORM\Column(length: 255)]
    private string $status = ApplicationStatus::SUBMITTED->value;
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCoverLetter(): ?string
    {
        return $this->cover_letter;
    }

    public function setCoverLetter(?string $cover_letter): static
    {
        $this->cover_letter = $cover_letter;

        return $this;
    }

    public function getResumePath(): ?string
    {
        return $this->resume_path;
    }

    public function setResumePath(?string $resume_path): static
    {
        $this->resume_path = $resume_path;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getJob(): ?Job
    {
        return $this->job;
    }

    public function setJob(?Job $job): static
    {
        $this->job = $job;

        return $this;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function getStatusAsEnum(): ApplicationStatus
    {
        return ApplicationStatus::from($this->status);
    }

    public function setStatus(string $status): self
    {

        if (!ApplicationStatus::tryFrom($status)) {
            throw new \InvalidArgumentException(sprintf('Le status de la candidature "%s" est invalide.', $status));
        }

        $this->status = $status;

        return $this;
    }



    // Ci dessous les méthodes de transition de status de candidature sans utiliser le Workflow de Symfony


    /*  public function submit(): void
     {

         $this->setStatus(ApplicationStatus::SUBMITTED);
     }

     public function underReview(): void
     {
         if ($this->getStatus() === ApplicationStatus::SUBMITTED)
             $this->setStatus(ApplicationStatus::UNDER_REVIEW);

     }

     public function reject(): void
     {
         if ($this->getStatus() === ApplicationStatus::UNDER_REVIEW)
             $this->setStatus(ApplicationStatus::REJECTED);
     }

     public function accept(): void
     {
         if ($this->getStatus() === ApplicationStatus::UNDER_REVIEW)
             $this->setStatus(ApplicationStatus::ACCEPTED);
     } */

}
