<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Guard;
use Tymon\JWTAuth\JWTAuth;
use Illuminate\Http\Response;

class JwtNonAuth
{
	/**
	 * @var JWTAuth
	 */
	protected $JWTAuth;

	/**
	 * @var Guard
	 */
	protected $auth;

	/**
	 * @param JWTAuth $JWTAuth
	 * @param Guard   $auth
	 */
	public function __construct(JWTAuth $JWTAuth, Guard $auth)
	{
		$this->JWTAuth = $JWTAuth;
		$this->auth = $auth;
	}

	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request $request
	 * @param  \Closure                 $next
	 * @param bool                      $role
	 *
	 * @return mixed
	 */
	public function handle($request, Closure $next, $role = false)
	{

		// Check isset Auth Token.
		$token = $this->JWTAuth->getToken();
		if(!empty($token)) {

			try {
				$this->JWTAuth->toUser($token);

			} catch(\Exception $e) {
//				return response()->json(['authorization' => false], Response::HTTP_OK);
			}

		} else {
//			return response()->json(['authorization' => false], Response::HTTP_OK);
		}

		return $next($request);
	}
}
