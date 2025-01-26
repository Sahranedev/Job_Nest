<?php

namespace App\Service;

use App\Dto\JobDto;
use App\Entity\Job;
use App\Enum\JobStatus;
use App\Enum\JobType;
use App\Repository\CompanyRepository;
use App\Repository\JobRepository;
use Doctrine\ORM\EntityManagerInterface;

class JobService
{
    private $jobRepository;
    private $companyRepository;
    private $entityManager;

    public function __construct(
        JobRepository $jobRepository,
        CompanyRepository $companyRepository,
        EntityManagerInterface $entityManager,
    ) {
        $this->jobRepository = $jobRepository;
        $this->companyRepository = $companyRepository;
        $this->entityManager = $entityManager;
    }

    public function createJob(array $data): JobDto
    {
        $company = $this->companyRepository->find($data['company_id']);

        if (!$company) {
            throw new \Exception('Company not found');
        }

        $job = new Job();
        $job->setTitle($data['title']);
        $job->setDescription($data['description']);
        $job->setLocation($data['location']);
        $job->setType(JobType::from($data['type']));
        $job->setStatus(JobStatus::DRAFT);
        $job->setCompany($company);
        $job->setCreatedAt(new \DateTimeImmutable());

        $this->entityManager->persist($job);
        $this->entityManager->flush();

        return new JobDto(
            $job->getId(),
            $job->getTitle(),
            $job->getDescription(),
            $job->getLocation(),
            $job->getType()->value,
            $job->getCompany()->getName(),
        );
    }
}