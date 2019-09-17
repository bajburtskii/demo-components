<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  Request     $request
     * @param  \Closure    $next
     * @param  string|null $guard
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $guard = null)
    {
        if (Auth::guard($guard)->check() && !Auth::guard($guard)->user()->is_admin) {
            return response()->json([
                'error'   => true,
                'message' => trans('main.errors.forbidden')
            ], 403);
        }

        return $next($request);
    }
}
