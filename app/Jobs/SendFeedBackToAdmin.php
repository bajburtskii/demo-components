<?php

namespace App\Jobs;

use App\Services\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendFeedBackToAdmin extends Job implements ShouldQueue
{
    use InteractsWithQueue, SerializesModels;

    /**
     * @var array
     */
    protected $data;

    /**
     * @var Notification
     */
    private $notification;

    /**
     * @param array $data
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @param Notification $notification
     * @return void
     */
    public function handle(Notification $notification)
    {
        $this->notification = $notification;

        $mailBody = [
            'name'  => $this->data['name'],
            'email' => array_get($this->data, 'email'),
            'phone' => array_get($this->data, 'phone'),
            'text'  => $this->data['message']
        ];

        $this->notification->sendToSupport(
            'emails.feedback.sendEmailToAdmin',
            trans('mail.subject.feedback'),
            $mailBody,
            true);

    }
}
