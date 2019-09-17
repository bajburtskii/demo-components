<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Http\Requests\Common\FeedbackCreateRequest;
use App\Jobs\SendFeedBackToAdmin;
use App\Models\Settings;
use App\Repositories\Contracts\FeedbackRepositoryContract;

class FeedbackController extends Controller
{
    /**
     * @var FeedbackRepositoryContract
     */
    protected $feedbackRepository;

    /**
     * @param FeedbackRepositoryContract $feedbackRepository
     */
    public function __construct(FeedbackRepositoryContract $feedbackRepository)
    {
        $this->feedbackRepository = $feedbackRepository;
    }

    /**
     * Show the feedback form.
     *
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function showFeedbackForm()
    {
        $text = '';

        $setting = Settings::where('name', 'contact_us')->first();
        if ($setting != null) {
            $text = $setting->value;
        }
        
        return view('entities.feedback.form', compact('text'));
    }

    /**
     * Create a feedback request and send an email.
     *
     * @param FeedbackCreateRequest      $request
     * @param SettingsRepositoryContract $settingsRepository
     * @return $this|\Illuminate\Http\RedirectResponse
     */
    public function send(
        FeedbackCreateRequest $request
    ) {
        if ($this->feedbackRepository->create($request->except('_token'))) {

            dispatch(new SendFeedBackToAdmin($request->except('_token')));

            return redirect()->back()->with(
                'success', trans('feedback.events.sent_success')
            );
        }

        return redirect()->back()->withErrors([
            'default' => trans('main.errors.something_went_wrong')
        ]);
    }
}
