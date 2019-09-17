<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\ApiController;
use App\Http\Requests\SecurityQuestion\SecurityQuestionCreateRequest;
use App\Http\Requests\SecurityQuestion\SecurityQuestionUpdateRequest;
use App\Repositories\Contracts\SecurityQuestionRepositoryContract;

class SecurityQuestionController extends ApiController
{
    /**
     * @var SecurityQuestionRepositoryContract
     */
    protected $securityQuestionRepository;

    /**
     * @param SecurityQuestionRepositoryContract $securityQuestionRepository
     */
    public function __construct(SecurityQuestionRepositoryContract $securityQuestionRepository)
    {
        $this->securityQuestionRepository = $securityQuestionRepository;
    }

    /**
     * Get all questions.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getQuestions()
    {
        $questions = $this->securityQuestionRepository->findAll(false, ['*']);

        return response()->json($questions->toArray());
    }

    /**
     * Get the security question list.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getList()
    {
        $questions = $this->securityQuestionRepository->getList();

        return response()->json($questions->toArray());
    }

    /**
     * Get the $question by id.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getQuestion(int $id)
    {
        $question = $this->securityQuestionRepository->find($id);

        return response()->json($question->toArray());
    }

    /**
     * Create a new question.
     *
     * @param SecurityQuestionCreateRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(SecurityQuestionCreateRequest $request)
    {
        try {
            $question = $this->securityQuestionRepository->create($request->all());

            return response()->json([
                'data'    => $question->toArray(),
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
     * Update a question by id.
     *
     * @param int               $id
     * @param SecurityQuestionUpdateRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(int $id, SecurityQuestionUpdateRequest $request)
    {
        try {
            $question = $this->securityQuestionRepository->update($request->all(), $id);

            return response()->json([
                'data'    => $question->toArray(),
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
     * Delete a question by id.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(int $id)
    {
        try {
            $count = $this->securityQuestionRepository->countAll();

            if ($count <= 1) {
                return response()->json([
                    'message' => trans('main.errors.permission_denied')
                ]);
            }

            $this->securityQuestionRepository->delete($id);

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
