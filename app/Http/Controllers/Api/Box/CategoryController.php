<?php

namespace App\Http\Controllers\Api\Box;

use App\Http\Controllers\ApiController;
use App\Http\Requests\Box\CategoryCreateRequest;
use App\Http\Requests\Box\CategoryUpdateRequest;
use App\Repositories\Contracts\BoxCategoryRepositoryContract;

class CategoryController extends ApiController
{
    /**
     * @var BoxCategoryRepositoryContract
     */
    protected $boxCategoryRepository;

    /**
     * @param BoxCategoryRepositoryContract $boxCategoryRepository
     */
    public function __construct(BoxCategoryRepositoryContract $boxCategoryRepository)
    {
        $this->boxCategoryRepository = $boxCategoryRepository;
    }

    /**
     * Get all categories.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCategories()
    {
        $categories = $this->boxCategoryRepository->paginate($this->perPage, false, ['*'], $this->currentPage());

        return response()->json($categories->toArray());
    }

    /**
     * Get the list of categories.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getList()
    {
        $categories = $this->boxCategoryRepository->findAll(true);

        return response()->json($categories->toArray());
    }

    /**
     * Get a category by id.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCategory(int $id)
    {
        $result = $this->boxCategoryRepository->find($id);

        return response()->json($result->toArray());
    }

    /**
     * Create a new category.
     *
     * @param CategoryCreateRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(CategoryCreateRequest $request)
    {
        try {
            $result = $this->boxCategoryRepository->create($request->all());

            return response()->json([
                'data'    => $result->toArray(),
                'message' => trans('main.events.created'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error'   => true,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a category by id.
     *
     * @param int                   $id
     * @param CategoryUpdateRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(int $id, CategoryUpdateRequest $request)
    {
        try {
            $result = $this->boxCategoryRepository->update($request->all(), $id);

            return response()->json([
                'data'    => $result->toArray(),
                'message' => trans('main.events.updated')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error'   => true,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a category by id.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(int $id)
    {
        try {
            $this->boxCategoryRepository->forceDelete($id);

            return response()->json([
                'message' => trans('main.events.deleted')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error'   => true,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
