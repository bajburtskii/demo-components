<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Repositories\Contracts\PageRepositoryContract;

class PageController extends Controller
{
    /**
     * @var PageRepositoryContract
     */
    protected $pageRepository;

    /**
     * @param PageRepositoryContract $pageRepository
     */
    public function __construct(PageRepositoryContract $pageRepository)
    {
        $this->pageRepository = $pageRepository;
    }

    /**
     * Show the home page.
     *
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function showHomePage()
    {
        return view('entities.page.home');
    }

    /**
     * Show the page.
     *
     * @param string $slug
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function show($slug)
    {
        if ($page = $this->pageRepository->findBySlug($slug, true)) {
            return view('entities.page.view', compact('page'));
        }

        abort(404);
    }
}
