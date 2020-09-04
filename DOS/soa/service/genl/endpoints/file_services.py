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


file_services_ns_captions = {
    'obs_id':   'ID de la observación: integer >= 1',
    'pre_ires': 'Preliminar o Inf. Resultados: ({}|{})'.format(PRE, IRES),
    'org_fisc': 'Organismo fiscalizador: ({}|{}|{}|{})'.format(SFP, ASF, ASENL, CYTG),
    'filename': 'Exclusivamente el filename con extension .pdf',
}

ns = api.namespace("files", description="Servicios de Uploading/Downloading de archivos (.pdf)")

filenames  = api.model('Lista con nombres de archivo', {
    'fnames': fields.List(fields.String()),
})

@ns.route('/')
@ns.response(400, 'Client error')
@ns.response(500, 'Server error')
class FileList(Resource):

    @ns.marshal_with(filenames)
    @ns.param('obs_id', file_services_ns_captions['obs_id'], required=True)
    @ns.param('pre_ires', file_services_ns_captions['pre_ires'], required=True)
    @ns.param('org_fisc', file_services_ns_captions['org_fisc'], required=True)
    def post(self):
        ''' Upload service (desde 1 hasta N archivos pdf). El Content-Type es multipart/form-data. Se hicieron pruebas
            con hasta 9 pdfs que sumaron unos 8MB en total. El nginx se ha configurado para permitir unos 10 MB en un
            solo request. Adicionalmente se requieren tres parameters en el query string: '''

        org_fisc = request.args.get('org_fisc', '')
        pre_ires = request.args.get('pre_ires', '')
        obs_id = request.args.get('obs_id', '')

        msg = val_params(org_fisc, pre_ires, obs_id)
        if msg:
            ns.abort(400, message=msg)

        # Validacion
        for file in request.files.values():

            if file.filename == '':
                ns.abort(400, message='No se ha seleccionado un archivo')

            if not file or not allowed_file(file.filename):
                ns.abort(400, message='Tipo de archivo no permitido')

        # Guardar en file system
        base_path = os.path.join(UPLOAD_FOLDER, org_fisc, pre_ires, obs_id)
        pathlib.Path(base_path).mkdir(parents=True, exist_ok=True)
        file_list = []

        for file in request.files.values():
            
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
    @ns.param('obs_id', file_services_ns_captions['obs_id'], required=True)
    @ns.param('pre_ires', file_services_ns_captions['pre_ires'], required=True)
    @ns.param('org_fisc', file_services_ns_captions['org_fisc'], required=True)
    def get(self):
        ''' Devuelve una lista de pathnames que puede usarse para descargar los archivos individualmente. '''
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
@ns.response(400, 'Client error')
@ns.response(500, 'Server error')
class File(Resource):

    @ns.param('filename', file_services_ns_captions['filename'], _in='path', required=True)
    @ns.param('obs_id', file_services_ns_captions['obs_id'], _in='path', required=True)
    @ns.param('pre_ires', file_services_ns_captions['pre_ires'], _in='path', required=True)
    @ns.param('org_fisc', file_services_ns_captions['org_fisc'], _in='path', required=True)
    def get(self, org_fisc, pre_ires, obs_id, filename):
        ''' Download service (un pdf solamente). El Content-Type del response es application/pdf.
            Los parameters son parte del path: '''
        
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
