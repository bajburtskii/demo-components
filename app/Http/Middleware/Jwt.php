<?php

namespace App\Http\Middleware;

use App\Models\UserDevice;
use App\Repositories\UserRepository;
use App\Models\User;
use Closure;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\JWTAuth;
use Illuminate\Http\Response;

class Jwt
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

		// For application
		$device = $request->headers->get('Device');
		if($device) {
			// Parse header Device
			$device_info = explode(' ', $device);
			if(count($device_info) === 2) {

				// If only one device, login
				if(UserDevice::where('uuid', $device_info[1])->count() === 1) {
					$device = UserDevice::where('uuid', $device_info[1])->first();
					if($device && $device->user) {
						$token = $this->JWTAuth->fromUser($device->user);
					}
				} else {
					// else, reset all
					UserDevice::where('uuid', $device_info[1])->delete();
				}
			}
		}

		if(!empty($token)) {

			try {

				// TODO need refactor
				if(Auth::check()) {
					$user = Auth::user();
				} else {
					$user = $this->JWTAuth->toUser($token);
				}

				$data = $this->JWTAuth->getPayload($token)->getCustom();


				if($request->is('v1/auth/logout') && empty($user)) {
					// Check is Request for Logout (Remove Tenant or Professional)


					// Check is user removed, for correct logout.
					$is_deleted_user = User::withTrashed()->find($data['userId']);


					if($is_deleted_user && !empty($is_deleted_user->deleted_at)) {
						$user = $is_deleted_user;
					}
				} elseif (empty($user)) {
					// If user not found by token


					return response()->json(['authorization' => false], Response::HTTP_OK);
				}


				// Check is allowed user for this role request.
				if($role && $user->getType() != UserRepository::convertRoleToType($role)) {
					return response()->json(['authorization' => false], Response::HTTP_OK);
				}


				// If isset Save Parameters for Login, use it.
				$persistent = \Input::get('persistent', false);


				if($this->auth->check()) {
					// If user is logged.

					// Get Logged user from Laravel.
					$loggedUser = $this->auth->user();

					if($loggedUser->id != $user->id) {
						// Check is not Logged user equal Token User, then logout Logged User and login Token user.

						$this->auth->logout();
						$this->auth->login($user, $persistent);

					} else {
						// If Logged user is equal Token User, then do nothing.

					}

				} else {
					// If user not logged, then do login.

					$this->auth->login($user, $persistent);
				}

			} catch(\Exception $e) {
				return response()->json(['authorization' => false], Response::HTTP_OK);
			}

		} else {
			return response()->json(['authorization' => false], Response::HTTP_OK);
		}

		return $next($request);
	}
}
