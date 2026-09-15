<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_rejects_invalid_credentials(): void
    {
        User::factory()->create([
            'email' => 'ops@gitlogistics.ng',
            'password' => 'password',
        ]);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'ops@gitlogistics.ng',
            'password' => 'wrong-password',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_login_returns_token_for_valid_credentials(): void
    {
        User::factory()->create([
            'name' => 'Ops Admin',
            'email' => 'ops@gitlogistics.ng',
            'password' => 'password',
            'role' => 'ops',
        ]);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'ops@gitlogistics.ng',
            'password' => 'password',
        ])->assertOk()
            ->assertJsonPath('user.email', 'ops@gitlogistics.ng')
            ->assertJsonStructure(['user' => ['id', 'name', 'email', 'role'], 'token']);
    }

    public function test_me_requires_authentication(): void
    {
        $this->getJson('/api/v1/auth/me')->assertUnauthorized();
    }

    public function test_authenticated_user_can_view_profile_and_logout(): void
    {
        $user = User::factory()->create(['email' => 'ops@gitlogistics.ng']);
        $token = $user->createToken('test')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('data.email', 'ops@gitlogistics.ng');

        $this->withToken($token)
            ->postJson('/api/v1/auth/logout')
            ->assertOk();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
