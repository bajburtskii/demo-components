<?php

namespace App\Http\Controllers\Api\Box;

use App\Http\Controllers\ApiController;
use App\Http\Requests\Box\BoxCreateRequest;
use App\Http\Requests\Box\BoxUpdateRequest;
use App\Repositories\Contracts\BoxRepositoryContract;
use App\Repositories\Traits\FileSaver;

class BoxController extends ApiController
{
    use FileSaver;

    /**
     * @var BoxRepositoryContract
     */
    protected $boxRepository;

    /**
     * @param BoxRepositoryContract $boxRepository
     */
    public function __construct(BoxRepositoryContract $boxRepository)
    {
        $this->boxRepository = $boxRepository;
    }

    /**
     * Get all boxes.
     *
     * @param int|null $categoryId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBoxes(int $categoryId = null)
    {
        $boxes = $this->boxRepository->paginateByCategoryId($categoryId, $this->perPage, true, ['*'], $this->currentPage());

        return response()->json($boxes->toArray());
    }

    /**
     * Get all boxes.
     *
     * @param int $catId
     * @param int $boxId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBox(int $boxId)
    {
        $boxes = $this->boxRepository->findOne($boxId);

        return response()->json($boxes->toArray());
    }

    /**
     * Create a new box.
     *
     * @param int              $catId
     * @param BoxCreateRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(BoxCreateRequest $request)
    {
        try {
            $result = $this->boxRepository->create($request->all());

            $this->createMediaByUser($request->all(), $result->id);


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
     * Update a league by id.
     *
     * @param int              $catId
     * @param int              $id
     * @param BoxUpdateRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(int $id, BoxUpdateRequest $request)
    {
        try {
            $result = $this->boxRepository->update($request->all(), $id);

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
     * Delete a box by id.
     *
     * @param int $catId
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $this->boxRepository->delete($id);

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
