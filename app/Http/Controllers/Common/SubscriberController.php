<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Http\Requests\Common\SubscriberCreateRequest;
use App\Repositories\Contracts\SubscriberRepositoryContract;

class SubscriberController extends Controller
{
    /**
     * @var SubscriberRepositoryContract
     */
    protected $subscriberRepository;

    /**
     * @param SubscriberRepositoryContract $subscriberRepository
     */
    public function __construct(SubscriberRepositoryContract $subscriberRepository)
    {
        $this->subscriberRepository = $subscriberRepository;
    }

    /**
     * Get all subscribers.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSubscribers()
    {
        $subscribers = $this->subscriberRepository->findAll();

        return response()->json($subscribers);
    }

    /**
     * Subscribe a new user.
     *
     * @param SubscriberCreateRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function subscribe(SubscriberCreateRequest $request)
    {
        if ($this->subscriberRepository->create($request->all())) {
            return redirect()->back()
                ->with('success', trans('subscribe.events.subscribe_success'));
        }

        return redirect()->back()
            ->onlyInput('email')
            ->withErrors(['default' => trans('main.errors.something_went_wrong')]);
    }
}
