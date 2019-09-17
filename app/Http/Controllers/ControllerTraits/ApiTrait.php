<?php

namespace App\Http\Controllers\ControllerTraits;

use Illuminate\Http\Response;

/**
 * Class ApiTrait
 *
 * @package App\Http\Controllers\ControllerTraits
 */
trait ApiTrait
{
	/**
	 * @var int
	 */
	protected $statusCode = Response::HTTP_OK;

	/**
	 * @return mixed
	 */
	public function getStatusCode()
	{
		return $this->statusCode;
	}

	/**
	 * Builds a pagination array
	 *
	 * @param $data
	 * @return mixed
	 */
	public function buildPagination($data)
	{
		$pagination = is_array($data) ? $data : $data->toArray();
		unset($pagination['data']);

		return $pagination;
	}

	/**
	 * @param $statusCode
	 *
	 * @return $this
	 */
	public function setStatusCode($statusCode)
	{
		$this->statusCode = $statusCode;
		return $this;
	}

	/**
	 * @param       $data
	 * @param array $headers
	 *
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function respond($data, $headers = [])
	{
		return response()->json($data, $this->getStatusCode(), $headers);
	}

	/**
	 * @param array $data
	 * @return mixed
	 */
	public function respondWithError($data = [])
	{
		return $this->respond(
				array_merge(array('status' => 'ERROR'), $data)
		);
	}
	/**
	 * @param $data
	 * @return mixed
	 */
	public function respondWithSuccess($data = [])
	{
		return $this->respond(
				array_merge(array('status' => 'OK'), $data)
		);
	}
	/**
	 * @param string $message
	 * @return mixed
	 */
	public function respondNotFound($message = 'Not Found')
	{
		return $this->setStatusCode(Response::HTTP_NOT_FOUND)->respondWithError(array('message' => $message));
	}
	/**
	 * @param string $message
	 * @return mixed
	 */
	public function respondWithNotSaved($message = 'Data Not Saved')
	{
		return $this->setStatusCode(Response::HTTP_INTERNAL_SERVER_ERROR)->respondWithError(array('message' => $message));
	}
	/**
	 * @param $data
	 * @return mixed
	 */
	public function respondWithCreated($data)
	{
		return $this->setStatusCode(Response::HTTP_CREATED)->respondWithSuccess($data);
	}

	/**
	 * @param string $message
	 * @return \Symfony\Component\HttpFoundation\Response
	 */
	public function respondForbidden($message = 'Forbidden')
	{
		return $this->setStatusCode(Response::HTTP_FORBIDDEN)->respondWithError(array('message' => $message));
	}

	/**
	 * @param $data
	 * @return mixed
	 */
	public function respondWithSaved($data)
	{
		return $this->respondWithSuccess($data);
	}
}
