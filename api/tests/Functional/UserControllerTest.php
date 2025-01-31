<?php
/* 
// TEST FONCTIONNEL PAS ENCORE OPERATIONNEL 

namespace App\Tests\Functional;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class UserControllerTest extends WebTestCase
{
    private $token;

    protected function setUp(): void
    {
        $this->createUser();
        $this->token = $this->getToken();
    }

    private function createUser(): void
    {
        $client = static::createClient();
        $client->request('POST', '/register', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'email' => 'test@test.com',
            'password' => 'password',
            'firstName' => 'TestFirstName',
            'lastName' => 'TestLastName',
            'phoneNumber' => '1234567890',
            'city' => 'Test City',
            'address' => 'Test Address',
            'age' => 30,
            'role' => 'CANDIDATE',
        ]));

        $this->assertResponseStatusCodeSame(201);
    }

    private function getToken(): string
    {
        $client = static::createClient();
        $client->request('POST', '/api/login_check', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'username' => 'test@test.com',
            'password' => 'password',
        ]));

        $response = $client->getResponse();
        $data = json_decode($response->getContent(), true);

        return $data['token'];
    }




} */