<?php

namespace App\Controller;

use App\Enum\JobStatus;
use App\Repository\ApplicationRepository;
use App\Repository\JobRepository;
use App\Service\JobService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Service\DateFormatterService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class JobController extends AbstractController
{

    private $jobService;

    public function __construct(JobService $jobService)
    {
        $this->jobService = $jobService;
    }


    // RECUPERER LES JOBS D'UN UTILISATEUR
    #[Route('/user/{id}/jobs', name: 'user_jobs', methods: ['GET'])]
    public function getJobsForUser(int $id, ApplicationRepository $applicationRepository): JsonResponse
    {

        $jobs = $applicationRepository->findJobsByUserId($id);

        return $this->json($jobs);
    }

    #[Route('/jobs', name: 'jobs', methods: ['GET'])]
    public function getJobs(JobRepository $jobRepository): JsonResponse
    {
        $jobs = $jobRepository->getJobs();

        return $this->json($jobs);
    }

    #[Route('api/job/{id}', name: 'job', methods: ['GET'])]
    public function getJobById(int $id, JobRepository $jobRepository, DateFormatterService $dateFormatterService): JsonResponse
    {
        $job = $jobRepository->getJobById($id);

        if (!$job) {
            return $this->json(['error' => 'Job introuvable'], Response::HTTP_NOT_FOUND);
        }

        // Je formate la date avant de retourner la réponse
        $job['createdAt'] = $dateFormatterService->formatDate($job['createdAt']);

        return $this->json($job);
    }


    #[Route('/api/jobs', name: 'create_job', methods: ['POST'])]
    public function createJob(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        try {
            $jobDto = $this->jobService->createJob($data);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }

        return $this->json($jobDto, Response::HTTP_CREATED);
    }



    #[Route('/api/jobs/{id}/status', name: 'update_job_status', methods: ['PATCH'])]
    public function updateJobStatus(
        int $id,
        Request $request,
        JobRepository $jobRepository,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        $job = $jobRepository->find($id);

        if (!$job) {
            return new JsonResponse(['error' => 'Job introuvable'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        if (!isset($data['status'])) {
            return $this->json(['error' => 'Status est requis'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $newStatus = JobStatus::from($data['status']);
        } catch (\ValueError $e) {
            return $this->json(['error' => 'Status invalide'], Response::HTTP_BAD_REQUEST);
        }

        try {
            switch ($newStatus) {
                case JobStatus::PUBLISHED:
                    $job->publish();
                    break;
                case JobStatus::CLOSED:
                    $job->close();
                    break;
                case JobStatus::DRAFT:
                    $job->draft();
                    break;
                default:
                    throw new \Exception('Invalid status transition');
            }
            $entityManager->flush();
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }

        return $this->json(['message' => "Statut de l'offre mis à jour avec succès."], Response::HTTP_OK);
    }

    #[Route('/api/jobs/search', name: 'search_jobs', methods: ['GET'])]
    public function searchJobs(Request $request, JobRepository $jobRepository): JsonResponse
    {
        $title = $request->query->get('title');
        $location = $request->query->get('location');

        if (!$title && !$location) {
            return $this->json(
                ['error' => 'Au moins un paramètre de recherche est requis (title oulocation)'],
                Response::HTTP_BAD_REQUEST,
            );
        }

        $jobs = $jobRepository->searchJobs($title, $location);



        return $this->json([
            'count' => count($jobs),
            'results' => $jobs,
        ]);
    }

}
