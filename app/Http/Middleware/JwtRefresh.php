<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Middleware\BaseMiddleware;

class JwtRefresh extends BaseMiddleware
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);

        // send the refreshed token back to the client
        if(auth()->user()) {

            $payload = [];
            $device = $request->headers->get('Device');
            if($device) {
                // Parse header Device
                $device_info = explode(' ', $device);
                if(count($device_info) == 2 && auth()->user()->devices()->count() && auth()->user()->devices()->where('uuid', $device_info[1])->count()) {
                    $payload = [
                        'exp' => time() + 86400 * 90 // 90 days
                    ];
                }
            }

            $newToken = JWTAuth::fromUser(auth()->user(), $payload);
            $response->headers->set('Authorization', 'Bearer '.$newToken);
        }


        return $response;
    }

}