from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_CENTER


class Executive(object):

    __slots__ = ['story', 'output_file']

    def __init__(self):

        # We shall start off with an empty one
        self.story = []

    def _build(self):

        # Setup document template
        doc = BaseDocTemplate(
                self.output_file,
                pagesize=letter,
                rightMargin=30,
                leftMargin=30,
                topMargin=30,
                bottomMargin=18,
        )

        def fp_foot(c, d):
            c.saveState()
            width, height = letter
            c.setFont('Helvetica', 7)
            c.drawCentredString(width / 2.0, (1.00 * cm), 'FOOTER_ABOUT')
            c.restoreState()

        executive_frame = Frame(
            doc.leftMargin, doc.bottomMargin, doc.width, doc.height,
            id='executive_frame'
        )

        doc.addPageTemplates(
            [
                PageTemplate(id='executive_frame', frames=[executive_frame], onPage=fp_foot),
            ]
        )

        # Apply story to document
        doc.build(self.story)
        return

    @classmethod
    def render(cls, plogo, output_file):
        """renders the final pdf"""
        rep = cls()
        rep.output_file = output_file
        rep.story.append(cls._header_table(plogo))
        rep._build()

    @classmethod
    def _header_table(cls, plogo):
        """Creates header's report"""

        def left_section():
            """In this handler should be conform the story"""

            # load on memory image instances
            ref = Image(plogo)
            ref.drawHeight = 3.8*cm
            ref.drawWidth = 5.2*cm

            return ref

        def right_section():

            st = ParagraphStyle(
                name='info',
                fontName='Helvetica',
                fontSize=7,
                leading=9.7
            )

            context = dict(fontSize='7', fontName='Helvetica')

            text = Paragraph(
                '''
                <para align=center spaceb=3>
                    <font name=%(fontName)s size=%(fontSize)s >
                        <b>
                        REPORTE EJECUTIVO<br/>
                        CONCENTRADO DE OBSERVACIONES<br/>
                        POR ENTE FISCALIZADOR Y ENTIDAD<br/>
                        DEL INFORME DE RESULTADOS
                        </b>
                    </font>
                </para>
                ''' % context, st
            )
            
            t = Table([[text]], colWidths = [ 9.0 * cm])
            t.setStyle(TableStyle([('VALIGN',(-1,-1),(-1,-1),'TOP')]))

            return t

        logo = left_section()
        head = right_section()
        cont = [[logo, head]]

        table = Table(cont,
           [
               5.5 * cm,
               9.4 * cm,
           ]
        )

        table.setStyle( TableStyle([
            ('ALIGN', (0, 0),(0, 0), 'LEFT'),
            ('ALIGN', (1, 0),(1, 0), 'CENTRE'),
        ]))

        return table
