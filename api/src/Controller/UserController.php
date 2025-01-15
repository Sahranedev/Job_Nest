<?php

namespace App\Controller;

use App\Entity\User;
use App\Enum\UserRole;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;


class UserController extends AbstractController
{
    private $userRepository;
    private $passwordHasher;

    public function __construct(UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher)
    {
        $this->userRepository = $userRepository;
        $this->passwordHasher = $passwordHasher;
    }


    // LISTE DES UTILISATEURS
    #[Route('/api/user', name: 'api_user', methods: ['GET'])]
    public function getCurrentUser(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'phoneNumber' => $user->getPhoneNumber(),
            'city' => $user->getCity(),
            'roles' => $user->getRoles(),
        ]);
    }

    // RECUPERER UN UTILISATEUR PAR SON ID
    #[Route('/api/user/{id}', name: 'api_user_by_id', methods: ['GET'])]
    public function getUserById(int $id): JsonResponse
    {
        $user = $this->userRepository->findOneById($id);

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur introuvable'], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'phoneNumber' => $user->getPhoneNumber(),
            'city' => $user->getCity(),
            'address' => $user->getAddress(),
            'age' => $user->getAge(),
            'role' => $user->getRole(),
            'createdAt' => $user->getCreatedAt(),
            'updatedAt' => $user->getUpdatedAt(),

        ]);
    }
    // ENREGISTRER UN UTILISATEUR
    #[Route('/register', name: 'user_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $user = new User();
        $user->setEmail($data['email']);
        $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));
        $user->setFirstName($data['firstName']);
        $user->setLastName($data['lastName']);
        $user->setPhoneNumber($data['phoneNumber']);
        $user->setCity($data['city']);
        $user->setAddress($data['address']);
        $user->setAge($data['age']);
        $user->setRole(UserRole::from($data['role']));
        $user->setCreatedAt(new \DateTimeImmutable());
        $user->setUpdatedAt(new \DateTimeImmutable());

        $this->userRepository->save($user);

        return new JsonResponse(['message' => 'Utilisateur créé avec succès'], Response::HTTP_CREATED);
    }

    // UPLOAD DU CV
    #[Route('/api/user/upload-cv', name: 'upload_cv', methods: ['POST'])]
    public function uploadCv(Request $request, UserRepository $userRepository): JsonResponse
    {
        $user = $this->getUser(); // Récupère l'utilisateur connecté

        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        // Récupérer le fichier depuis la requête
        $file = $request->files->get('cvFile');

        if (!$file) {
            return new JsonResponse(['error' => 'No file uploaded'], Response::HTTP_BAD_REQUEST);
        }

        // Associe le fichier à l'utilisateur via VichUploader
        $user->setCvFile($file);

        // Sauvegarder les modifications
        $userRepository->save($user);

        return new JsonResponse(['message' => 'CV uploaded successfully'], Response::HTTP_OK);
    }

}
