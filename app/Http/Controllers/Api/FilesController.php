<?php namespace App\Http\Controllers\Api;

use App\Models\File;
use App\Http\Controllers\Controller;
use App\Http\Controllers\ControllerTraits\ApiTrait;
use App\Http\Requests;
use \App\Http\Requests\UpdateFileCrop;

use App\Repositories\FileRepository;
use App\Repositories\Traits\FileDimensions;
use App\Services\Image;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Http\Request;
use Response;

/**
 * Class FilesController
 *
 * @package App\Http\Controllers\Api\Common
 */
class FilesController extends Controller
{
    use FileDimensions, ApiTrait;

    /**
     * @param Image                 $Image
     * @param Request               $request
     * @return mixed
     */
    public function store(Image $Image, Request $request)
    {
        $data = $request->all();
        $type = $data['type'];
        $file = array_get($data, 'file');

        if ($file) { //check storage limits
            // Check for
            $acceptedFormats = [];
            if (config('files.rules.' . $type . '.type')) {
                $acceptedFormats = config('files.types.' . config('files.rules.' . $type . '.type'));
            }
            if (!count($acceptedFormats) || !in_array(strtolower($file->getClientOriginalExtension()), $acceptedFormats)) {
                return $this->setStatusCode(422)->respond([
                    'message' => trans('general.uploader_error_extension_type.' . (config('files.rules.' . $type . '.type') ?: FileRepository::FILE_EXT_IMG_AND_DOC))
                ]);
            }
        }

        $preview_size = array_get($data, 'preview_size', 'tiny');
        $preview_ext  = array_get($data, 'preview_ext', 'jpg');

        $token = strtolower(str_random(16));
        while (File::where('token', $token)->exists()) {
            $token = strtolower(str_random(16));
        }

        $rules = Config::get('files.rules');
        // TODO check extensions in rules

        $pid = isset($data['parent_id']) && Auth::check() ? $data['parent_id'] : null; // TODO WTF

        $is_image = false;

        // Check file data
        if ($file) {
            // Check for image
            //$is_image = $this->checkIfImage($file->getClientOriginalExtension());
            if ($rules[$type]['type'] == FileRepository::FILE_EXT_IMAGE || (isset($rules[$type]['is_image']) && $rules[$type]['is_image'] == true)) {
                $is_image = true;
            }

            // Upload & resize
            $upload = $Image->upload($file, $type, $token, $is_image);

            if (!$upload) {
                return $this->respond([
                    'message' => 'Cannot upload file. Please try again.'
                ])->setStatusCode(422);
            }

            if (count($upload)) {

                // Remove old file if RULE===true
                if (isset($rules[$type]) && $rules[$type]['single'] && $pid) {
                    File::where('parent_id', $pid)->where('type', $type)->where('sender_id', Auth::id())->update(['parent_id' => 0]);
                }

                $fileData = new File([
//					'sender_id' => Auth::id() ?: null,
                    'parent_id' => $pid,
                    'type'      => $type,
                    'name'      => $file->getClientOriginalName(),
                    'token'     => $token,
                    'size'      => $file->getClientSize(),
                    //'mime' => $file->getClientMimeType(),
                    'ext'       => $file->getClientOriginalExtension(),
                    'is_image'  => FileRepository::checkIfImage($file->getClientOriginalExtension())
                ]);

                if (Auth::check()) {
                    $fileData->sender()->associate(Auth::user());
                }

                // TODO, save & update
                if ($is_image && FileRepository::checkIfImage($file->getClientOriginalExtension())) {
                    $fileData->dimensions = $this->getImageDimensions($fileData);
                }
                $fileData->save();

                $fileData['url'] = FileRepository::getUrl($fileData, $preview_size, $preview_ext);

                return $this->respond($fileData->toArray());

            }
        }

        // Check if google street view
        if (!$file && isset($data['map'])) {
            // Upload & resize
            $uploaded = $Image->uploadGoogleStreetView($data, $type, $token);

            if (count($uploaded)) {

                // Remove old file if RULE===true
                if (isset($rules[$type]) && $rules[$type]['single'] && $pid) {
                    File::where('parent_id', $pid)->where('type', $type)->where('sender_id', Auth::id())->update(['parent_id' => 0]);
                }

                $fileData = new File([
//					'sender_id' => Auth::id() ?: null,
                    'parent_id' => $pid,
                    'type'      => $type,
                    'name'      => $uploaded['name'],
                    'token'     => $token,
                    'size'      => $uploaded['size'],
                    'ext'       => 'jpg',
                    'is_image'  => 1
                ]);

                if (Auth::check()) {
                    $fileData->sender()->associate(Auth::user());
                }

                $fileData->save();

                $response        = $fileData->toArray();
                $response['url'] = FileRepository::getUrl($fileData, $preview_size, $preview_ext);

                return $this->respond($response);
            }
        }

        return $this->respond([
            'message' => 'Error upload file. No file.'
        ])->setStatusCode(407);
    }

    /**
     * @param Image          $Image
     * @param FileRepository $fileRepository
     * @param UpdateFileCrop $request
     * @param                $file_token
     * @param                $file_type
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function crop(Image $Image, FileRepository $fileRepository, UpdateFileCrop $request, $file_token)
    {
        $file      = $fileRepository->getByToken($file_token);
        $cropAreas = $file->cropArea ?: [];
        $siblings  = false;

        if (!is_array($cropAreas)) $cropAreas = array();

        $size = $request->get('size', 'preview');

        $cropAreaWidth = $request->get('cropAreaWidth');

        $x     = round($request->get('x'));
        $y     = round($request->get('y'));
        $x2    = round($request->get('x2', 0));
        $y2    = round($request->get('y2', 0));
        $w     = round($request->get('w'));
        $h     = round($request->get('h', 0));
        $ratio = round($request->get('ratio', 1));

        $cropAreas[$size] = array(
            'x'  => round($x * $ratio),
            'y'  => round($y * $ratio),
            'x2' => round($x2 * $ratio),
            'y2' => round($y2 * $ratio)
        );

        $dimensions = FileRepository::getSizes($file->type);

        if ($request->get('siblings')) {
            $siblings = $request->get('siblings');
            foreach ($siblings as $size_name) {
                if (!isset($dimensions[$size_name]) || isset($dimensions[$size_name]['blur'])) {
                    continue;
                }
                if ($size_name !== 'blurred') {
                    $cropAreas[$size_name] = $cropAreas[$size];
                }
            }
        }

        $file->cropArea = serialize($cropAreas);
        $file->save();

        $fileRepository->regenerateFileThumbs($file, $size);
//		$Image->cropThumb($file, $x, $y, $w, $h, $cropAreaWidth, $size);

        if ($siblings) {
            foreach ($siblings as $size_name) {
                $fileRepository->regenerateFileThumbs($file, $size_name);
            }
        }

        return $this->respond($file->token);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return mixed|\Symfony\Component\HttpFoundation\Response
     */
    public function destroy($id)
    {
        $file = File::find($id);
        if ($file->sender_id === Auth::id() || Auth::user()->isAdmin()) {
            $file->update(['parent_id' => 0]);

            return $this->respond([
                'success' => true
            ]);
        }

        return $this->respondWithError();
    }

    /**
     * Delete from DB and storage.
     *
     * @param                $token
     * @param FileRepository $fileRepository
     * @return mixed
     * @internal param $fileId
     */
    public function forceDelete($token, FileRepository $fileRepository)
    {
        try {
            $file = File::where('token', $token)->first();
            // Check if owner || admin
            if ($file->sender_id === Auth::id() || Auth::user()->isAdmin()) {
                $fileRepository->deleteFile($file);
            }

        } catch (\Exception $e) {
            return $this->respondWithError(['message' => $e->getMessage()]);
        }

        return $this->respond([
            'id' => $file->id
        ]);
    }

    /**
     * @param                $token
     * @param FileRepository $fileRepository
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function download($token, FileRepository $fileRepository)
    {
        //todo add check if user is owner of file. (Max)
        $file = $fileRepository->getByToken($token);
        $path = $fileRepository->generateDownloadLink($file);

        return Response::download($path, $file->name, [
            'Content-Length: ' . $file->size
        ]);

    }

}
