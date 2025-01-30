<?php

namespace App\Denormalizer;

use App\Entity\Application;
use App\Repository\JobRepository;
use App\Repository\UserRepository;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

class ApplicationDenormalizer implements DenormalizerInterface
{
    private $jobRepository;
    private $userRepository;

    public function __construct(JobRepository $jobRepository, UserRepository $userRepository)
    {
        $this->jobRepository = $jobRepository;
        $this->userRepository = $userRepository;
    }

    public function denormalize($data, $class, $format = null, array $context = []): mixed
    {
        $job = $this->jobRepository->find($data['job_id']);
        $user = $this->userRepository->find($data['user_id']);

        if (!$job || !$user) {
            throw new \Exception('Job ou Utilisateur non trouvé');
        }

        $application = new Application();
        $application->setJob($job);
        $application->setUser($user);
        if (isset($data['cover_letter'])) {
            $application->setCoverLetter($data['cover_letter']);
        }
        if (isset($data['resume_path'])) {
            $application->setResumePath($data['resume_path']);
        }
        $application->setCreatedAt(new \DateTimeImmutable());

        return $application;
    }

    public function supportsDenormalization($data, $type, $format = null, array $context = []): bool
    {
        return $type === Application::class;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [
            Application::class => true,
        ];
    }
}
