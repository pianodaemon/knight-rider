import os
import pathlib
from flask_restplus import Resource, fields
from flask import request, send_from_directory
from werkzeug.utils import secure_filename

from genl.restplus import api
from custom.profile import (
    ALLOWED_EXTENSIONS,
    UPLOAD_FOLDER,
    SFP,
    ASF,
    ASENL,
    CYTG,
    PRE,
    IRES,
)
from dal import file_services
from misc.helperpg import ServerError


ns = api.namespace("files", description="Services for Uploading/Downloading files")

filenames  = api.model('Lista con nombres de archivo', {
    'fnames': fields.List(fields.String()),
})

@ns.route('/')
class FileList(Resource):

    @ns.marshal_with(filenames)
    def post(self):
        org_fisc = request.args.get('org_fisc', '')
        pre_ires = request.args.get('pre_ires', '')
        obs_id = request.args.get('obs_id', '')

        msg = val_params(org_fisc, pre_ires, obs_id)
        if msg:
            ns.abort(400, message=msg)

        base_path = os.path.join(UPLOAD_FOLDER, org_fisc, pre_ires, obs_id)
        pathlib.Path(base_path).mkdir(parents=True, exist_ok=True)
        file_list = []
        
        for file in request.files.values():

            if file.filename == '':
                ns.abort(400, message='No se ha seleccionado un archivo')

            if not file or not allowed_file(file.filename):
                ns.abort(400, message='Tipo de archivo no permitido')

            filename = secure_filename(file.filename)
            file.save(os.path.join(base_path, filename))

            file_list.append(filename)

        try:
            fnames = file_services.save(org_fisc, pre_ires, obs_id, file_list)
        except ServerError as err:
            ns.abort(500, message=err)
        except Exception as err:
            ns.abort(400, message=err)
        
        return fnames


    @ns.marshal_with(filenames)
    def get(self):
        org_fisc = request.args.get('org_fisc', '')
        pre_ires = request.args.get('pre_ires', '')
        obs_id = request.args.get('obs_id', '')

        msg = val_params(org_fisc, pre_ires, obs_id)
        if msg:
            ns.abort(400, message=msg)

        try:
            fnames = file_services.read(org_fisc, pre_ires, obs_id)
        except ServerError as err:
            ns.abort(500, message=err)
        except Exception as err:
            ns.abort(400, message=err)
        
        return fnames


@ns.route('/<string:org_fisc>/<string:pre_ires>/<int:obs_id>/<path:filename>')
class File(Resource):

    def get(self, org_fisc, pre_ires, obs_id, filename):
        
        msg = val_params(org_fisc, pre_ires, obs_id)
        if msg:
            ns.abort(400, message=msg)

        base_path = os.path.join(UPLOAD_FOLDER, org_fisc, pre_ires, str(obs_id))
        
        return send_from_directory(base_path, filename)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def val_params(org_fisc, pre_ires, obs_id):
    
    if org_fisc not in {SFP, ASF, ASENL, CYTG} or \
       pre_ires not in {PRE, IRES}:
        return 'Al menos un parametro es incorrecto. No es posible continuar'

    try:
        int(obs_id)
    except:
        return 'Error en el id de la observacion'

    return ''
