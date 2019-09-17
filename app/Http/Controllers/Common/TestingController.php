<?php

namespace App\Http\Controllers\Common;

use App\Models\User;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class TestingController extends Controller
{
    public function emailRender()
    {
        $faker = \Faker\Factory::create();

        $user = User::first();

        return view('emails/password_reset', [
            'token' => $faker->text(10),
            'user' => $user

//            'rental' => [
//                'user_landlord' => [
//                    'subdomain' => 'david'
//                ],
//                'property' => [
//                    'fullAddress' => $faker->text(40)
//                ],
//                'name' => $faker->text(10),
//                'id' => $faker->numberBetween(0, 1),
//                'price' => $faker->numberBetween(0, 3),
//                'image' => '/assets/unitava/3/o/9/3o9kjicilwfwyj9o/preview.jpg',
//                'bedrooms' => $faker->numberBetween(0, 2),
//                'bathrooms' => $faker->numberBetween(0, 2),
//                'size' => $faker->numberBetween(0, 2),
//                'garage' => $faker->numberBetween(0, 2),
//                'type' => 3,
//                'description' => $faker->text(100)
//            ],
//            'user' => [
//                'name' => $faker->firstName
//            ]
        ]);
    }
}
