<?php

namespace App\Jobs;

use App\Models\Invite;
use App\Models\User;
use App\Repositories\Contracts\LeagueRepositoryContract;
use App\Services\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class InviteToLeagueByMail extends Job implements ShouldQueue
{
    use InteractsWithQueue, SerializesModels;

    /**
     * @var Invite|array
     */
    protected $invite;

    /**
     * @var Notification
     */
    private $notification;

    /**
     * @param array $invite
     */
    public function __construct(array $invite)
    {
        $this->invite = $invite;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(LeagueRepositoryContract $leagueRepository, Notification $notification)
    {
        $this->notification = $notification;

        $league = $leagueRepository->find($this->invite['league_id']);

        if (!isset($league)) {
            \Log::error('ERROR IN InviteToLeagueByMail: League with id:' . $this->invite['league_id']. ' was not found');
            return;
        }
        $user = User::select('first_name', 'last_name')
            ->where('id', $this->invite['sender_id'])
            ->first();

        if (array_get($this->invite, 'email')) {
            $mailBody = [
                'league' => $league->name,
                'name' => $this->invite['name'],
                'sender' => $user->first_name . ' ' . $user->last_name,
                'token' => $this->invite['token'],
            ];

            $this->notification->send(
                'emails.invite.invite_to_league',
                $this->invite['email'],
                $this->invite['name'],
                trans('mail.subject.invite_to_league'),
                $mailBody,
                true);
        }
    }
}
