<?php

namespace App\Controller;

use App\Repository\ApplicationRepository;
use App\Repository\JobRepository;
use App\Repository\CompanyRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class JobController extends AbstractController
{
    #[Route('/job', name: 'app_job')]
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

    #[Route('/job/{id}', name: 'job', methods: ['GET'])]
    public function getJobById(int $id, JobRepository $jobRepository): JsonResponse
    {
        $job = $jobRepository->getJobById($id);

        if (!$job) {
            return new JsonResponse(['error' => 'Job not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($job);
    }

    #[Route('/jobs', name: 'create_job', methods: ['POST'])]
    public function createJob(
        Request $request,
        JobRepository $jobRepository,
        CompanyRepository $companyRepository,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['title'], $data['description'], $data['location'], $data['type'], $data['status'], $data['company_id'])) {
            return new JsonResponse(['error' => 'Invalid data'], 400);
        }

        try {
            $job = $jobRepository->createJob($data, $companyRepository, $entityManager);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 404);
        }

        return new JsonResponse(['message' => 'Job créé avec succès !', 'job' => $job], 201);
    }
}
