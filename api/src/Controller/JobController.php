<?php

namespace App\Controller;

use App\Dto\JobDto;
use App\Enum\JobStatus;
use App\Repository\ApplicationRepository;
use App\Repository\JobRepository;
use App\Repository\CompanyRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Service\DateFormatterService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class JobController extends AbstractController
{
    #[Route(path: '/job', name: 'app_job')]
    public function index(): Response
    {
        return $this->render('job/index.html.twig', [
            'controller_name' => 'JobController',
        ]);
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
            return new JsonResponse(['error' => 'Job not found'], Response::HTTP_NOT_FOUND);
        }

        // Formater la date avant de retourner la réponse
        $job['createdAt'] = $dateFormatterService->formatDate($job['createdAt']);

        return $this->json($job);
    }

    #[Route('/api/jobs', name: 'create_job', methods: ['POST'])]
    public function createJob(
        Request $request,
        CompanyRepository $companyRepository,
        EntityManagerInterface $entityManager,
        JobRepository $jobRepository,
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        try {
            $job = $jobRepository->createJob($data, $companyRepository, $entityManager);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }


        $jobDto = new JobDto(
            $job->getId(),
            $job->getTitle(),
            $job->getDescription(),
            $job->getLocation(),
            $job->getType()->value,
            $job->getCompany()->getName(),
        );

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
            return new JsonResponse(['error' => 'Job not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        if (!isset($data['status'])) {
            return new JsonResponse(['error' => 'Status is required'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $newStatus = JobStatus::from($data['status']);
        } catch (\ValueError $e) {
            return new JsonResponse(['error' => 'Invalid status'], Response::HTTP_BAD_REQUEST);
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
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }

        return new JsonResponse(['message' => 'Job status updated successfully'], Response::HTTP_OK);
    }

    #[Route('/api/jobs/search', name: 'search_jobs', methods: ['GET'])]
    public function searchJobs(Request $request, JobRepository $jobRepository): JsonResponse
    {
        // Récupération des paramètres de recherche depuis la requête
        $title = $request->query->get('title');
        $location = $request->query->get('location');

        // Vérification qu'au moins un des deux paramètres est fourni
        if (!$title && !$location) {
            return new JsonResponse(
                ['error' => 'At least one search parameter (title or location) must be provided.'],
                Response::HTTP_BAD_REQUEST,
            );
        }

        // Appel au repository pour effectuer la recherche
        $jobs = $jobRepository->searchJobs($title, $location);


        // Retourne une réponse formatée
        return $this->json([
            'count' => count($jobs),
            'results' => $jobs,
        ]);
    }

}
