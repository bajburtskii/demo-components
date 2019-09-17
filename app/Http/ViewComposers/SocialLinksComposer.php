<?php

namespace App\Http\ViewComposers;

use App\Models\Settings;
use Illuminate\View\View;

class SocialLinksComposer
{
    /**
     * Bind data to the view.
     *
     * @param  View $view
     * @return void
     */
    public function compose(View $view)
    {
        $view->with('socialLinks', $this->getSocialLinks());
    }

    /**
     * Get the social links.
     *
     * @return array
     */
    private function getSocialLinks()
    {
        return Settings::whereIn('name', [
            'social_facebook',
            'social_linkedin',
            'social_twitter'
        ])->get()->toArray();
    }
}