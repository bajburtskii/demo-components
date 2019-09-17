<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Nexmo\Laravel\Facade\Nexmo;

class InviteToLeaguesBySMS extends Job implements ShouldQueue
{
    use InteractsWithQueue, SerializesModels;

    /**
     * @var
     */
    protected $invite;

    /**
     * InviteToLeagueBySMS constructor.
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
     * @return void
     */
    public function handle()
    {
        $user = User::select('first_name', 'last_name')
            ->where('id', $this->invite['sender_id'])
            ->first();

        if ($this->invite['phone']) {
            Nexmo::message()->send([
                'to'   => $this->invite['phone'],
                'from' => config('nexmo.api_number'),
                'text' => $user['first_name'].' '. $user['last_name'] .' invited you to join to Leagues. Join here ' . url()->full() . '/registration?invite_friends=' . $this->invite['token']
            ]);
        }
    }
}
