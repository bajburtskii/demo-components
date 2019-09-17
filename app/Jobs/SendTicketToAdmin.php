<?php

namespace App\Jobs;

use App\Jobs\Job;
use App\Models\User;
use App\Services\Notification;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendTicketToAdmin extends Job implements ShouldQueue
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
     * @return void
     */
    public function handle(Notification $notification)
    {
        $this->notification = $notification;

        $user = User::select('first_name', 'last_name')
            ->where('id',  $this->data['user_id'])
            ->first();

        $mailBody = [
            'name'  => $user->first_name . ' ' . $user->last_name,
            'text'  => $this->data['message']
        ];

        $this->notification->sendToSupport(
            'emails.ticket.sendEmailToAdmin',
            trans('mail.subject.ticket'),
            $mailBody,
            true);
    }
}
