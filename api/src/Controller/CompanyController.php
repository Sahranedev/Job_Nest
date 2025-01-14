<?php

namespace App\Controller;

use App\Entity\Company;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\CompanyRepository;
use Symfony\Component\HttpFoundation\JsonResponse;

class CompanyController extends AbstractController
{
    #[Route('/company', name: 'app_company')]
    public function index(): Response
    {
        return $this->render('company/index.html.twig', [
            'controller_name' => 'CompanyController',
        ]);
    }

    #[Route('/companies', name: 'companies', methods: ['GET'])]
    public function getCompanies(CompanyRepository $companyRepository): Response
    {
        $companies = $companyRepository->getCompanies();
        return new JsonResponse($companies);
    }

    #[Route('/api/companies', name: 'create_company', methods: ['POST'])]
    public function createCompany(
        Request $request,
        CompanyRepository $companyRepository,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        try {
            $company = $companyRepository->createOneCompany($data, $userRepository, $entityManager);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 400);
        }

        return new JsonResponse(['message' => 'Entreprise créée avec succès !', 'company' => $company->getId()], 201);
    }

}
