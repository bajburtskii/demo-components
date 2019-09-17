<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IsLeagueOwner
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
        $leagueId = $request->input('league_id') || $request->input('id');

        if (Auth::guard($guard)->check() && !Auth::guard($guard)->user()->isLeagueOwner($leagueId)) {
            return response()->json([
                'error'   => true,
                'message' => trans('main.errors.permission_denied')
            ], 403);
        }

        return $next($request);
    }
}
