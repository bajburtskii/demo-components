<?php

namespace App\Jobs;

use App\Models\User;
use App\Services\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class InviteToLeaguesByMail extends Job implements ShouldQueue
{
    use InteractsWithQueue, SerializesModels;

    /**
     * @var
     */
    protected $invite;

    /**
     * @var Notification
     */
    private $notification;

    /**
     * InviteToLeaguesByMail constructor.
     *
     * @param array $invite
     */
    public function __construct(array $invite)
    {
        $this->invite = $invite;
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

        $user = User::select('first_name', 'last_name')
            ->where('id', $this->invite['sender_id'])
            ->first();

        if (array_get($this->invite, 'email')) {
            $mailBody = [
                'name'   => $this->invite['name'],
                'sender' => $user->first_name . ' ' . $user->last_name,
                'token'  => $this->invite['token'],
            ];

            $this->notification->send(
                'emails.invite.invite_to_leagues',
                $this->invite['email'],
                $this->invite['name'],
                trans('mail.subject.invite_to_leagues'),
                $mailBody,
                true);
        }
    }
}
