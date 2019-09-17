<?php

namespace App\Http\Controllers\Common;

use App\Models\Settings;
use App\Repositories\Contracts\SettingsRepositoryContract;
use App\Repositories\FileRepository;
use App\Http\Controllers\Controller;

/**
 * Class TranslationsController
 *
 * @package App\Http\Controllers\Common
 */
class ConfigController extends Controller
{
    public function index(SettingsRepositoryContract $settingsRepository)
    {
        $config = [];

        array_set($config, 'env', app()->environment());
        array_set($config, 'host', config('app.url'));

        $files = config('files');
        $files['sizes'] = FileRepository::getAllSizes();

        array_set($config, 'files', $files);

        array_set($config, 'settings', trans('settings'));

        array_set($config, 'services', [
            'google' => [
                'client_id' => config('services.google.client_id'),
                'redirect' => config('services.google.redirect')
            ],
            'facebook' => [
                'client_id' => config('services.facebook.client_id'),
                'redirect' => config('services.facebook.redirect')
            ],
            'yahoo' => [
                'client_id' => config('services.yahoo.client_id'),
                'redirect' => config('services.yahoo.redirect'),
                'callback_url' => config('services.yahoo.callback_url')
            ]
        ]);

        $a = app()->make('jstranslator');
        array_set($config, 'trans', $a->get());

        // Social links
        // ['social_facebook', 'social_linkedin', 'social_twitter']
//        $links = $settingsRepository->findByName(['social_facebook', 'social_linkedin', 'social_twitter'], ['name', 'value']);

        $links = Settings::whereIn('name', [
            'social_facebook',
            'social_linkedin',
            'social_twitter'
        ])->get()->toArray();

        array_set($config, 'social_links', $links);
        
        array_set($config, 'push', config('services.push'));

        return response()->json($config);
    }
}
