<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Response;
use Jenssegers\Agent\Agent;

class OldBrowser
{

	/**
	 * @var Agent
	 */
	private $agent;

	public function __construct(Agent $agent)
	{
		$this->agent = $agent;
	}

	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request $request
	 * @param  \Closure                 $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{
		$browser = $this->agent->browser();
		$version = (int)$this->agent->version($browser);

		if (
			($browser === 'Firefox' && $version < 22) ||
			(($browser === 'Internet Explorer' || $browser === 'IE') && $version < 10) ||
			($browser === 'Opera' && $version < 12) ||
			($browser === 'Safari' && $version < 6) ||
			($browser === 'Chrome' && $version < 21)
		) {
            return new Response(view('layouts.old-browser'));
		}

		return $next($request);
	}
}
