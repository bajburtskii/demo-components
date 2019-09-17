<?php

namespace App\Jobs;

use App\Models\League;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Nexmo\Laravel\Facade\Nexmo;

class InviteToLeagueBySMS extends Job implements ShouldQueue
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
        try {
            $league = League::select('name')
                ->where('id', $this->invite['league_id'])
                ->first();
            $user = User::select('first_name', 'last_name')
                ->where('id', $this->invite['sender_id'])
                ->first();

            if ($this->invite['phone']) {
                // \Log::info('Invite was sent. To: ' . $this->invite['phone'] . ' From: ' . config('nexmo.api_number'));
                Nexmo::message()->send([
                    'to'   => $this->invite['phone'],
                    'from' => config('nexmo.api_number'),
                    'text' => $user['first_name'].' '. $user['last_name'] .' invited you to join ' . $league->name . '. Join league here ' . config('app.url') . '/login?invite=' . $this->invite['token']
                ]);
            }
        }catch (\Exception $e) {
            var_dump($league);
            \Log::error('ERROR IN InviteToLeagueBySMS: ' . $e->getMessage());
        }

    }
}
