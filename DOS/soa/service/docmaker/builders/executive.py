from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_CENTER


class Executive(object):

    __slots__ = ['story', 'output_file']

    _actors = ('ASF', 'SFP', 'ASENL', 'CyTG', 'TOTAL')

    def __init__(self):

        # We shall start off with an empty one
        self.story = []

    def _build(self):

        # Setup document template
        doc = BaseDocTemplate(
                self.output_file,
                pagesize=landscape(letter),
                showBoundary=1)

        def fp_foot(c, d):
            c.saveState()
            width, height = letter
            c.setFont('Helvetica', 7)
            c.drawCentredString(width / 2.0, (1.00 * cm), 'FOOTER_ABOUT')
            c.restoreState()

        executive_frame = Frame(doc.leftMargin, doc.height-5*2.54 * cm,
                doc.width, 5 * 2.54 * cm,
                leftPadding = 0, rightPadding = 0,
                topPadding = 0, bottomPadding = 0,
                id='executive_frame')

        doc.addPageTemplates(
            [
                PageTemplate(
                    id='executive_frame',
                    onPage=fp_foot,
                    frames=[executive_frame]
                ),
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
        rep.story.append(cls._exercise_table({
            'ASF': [{'ejercicio':1, 'cant_obs':20000, 'monto':30000}, {'ejercicio':2, 'cant_obs':40000, 'monto':90000}],
            'SFP': [{'ejercicio':1, 'cant_obs':50000, 'monto':70000}, {'ejercicio':2, 'cant_obs':10000, 'monto':10000}],
            'ASENL': [{'ejercicio':1, 'cant_obs':1800, 'monto':80000}, {'ejercicio':2, 'cant_obs':17000, 'monto':14000}],
            'CyTG': [{'ejercicio':1, 'cant_obs':9999, 'monto':8888}, {'ejercicio':2, 'cant_obs':3333, 'monto':5555}],
            'TOTAL': [{'ejercicio':1, 'cant_obs':99999, 'monto':99999}, {'ejercicio':2, 'cant_obs':99999, 'monto':99999}],

        }))
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

    @classmethod
    def _exercise_table(cls, array_dat):

        header_concepts = (
            '',
            'Cant. Obs',
            'Monto',
        )

        def placement(*args):
            verticals = []
            for arg in args:
                verticals += [arg['ejercicio'], arg['cant_obs'], arg['monto']]
            return verticals

        def header_exercises():
            verticals = []
            for i in  cls._actors:
                verticals.append('EJERCICIO')
                verticals.append(i)
                verticals.append("")
            return verticals

        cont = [header_exercises()] + [header_concepts * len(cls._actors)] + [placement(*t) \
                 for t in zip(*tuple(map(lambda i: array_dat[i], cls._actors)))]

        table = Table(cont,
            [
                1.6 * cm,
                1.8 * cm,
                1.8 * cm
            ] * len(cls._actors)
        )

        predominant_style = [
                ('ALIGN', (0, 0),(-1, -1), 'CENTER'),
                ('FONT', (0, 0),(-1, -1), 'Helvetica', 7),
                ('GRID',(0, 0), (-1,-1), 0.5,colors.grey),
                ('BOX', (0, 0), (-1, -1), 0.25, colors.black),
        ]

        ente_style = lambda offset: [
                # Exercise header cell
                ('SPAN',(offset + 0, 0), (offset + 0, 1)),
                ('FONT', (offset + 0, 0), (offset + 0, 1), 'Helvetica-Bold', 7),
                ('VALIGN', (offset + 0, 0), (offset + 0, 1), 'MIDDLE'),

                # Ente header cell
                ('SPAN', (offset + 1, 0), (offset + 2, 0)),
                ('FONT', (offset + 1, 0), (offset + 2, 0), 'Helvetica-Bold', 7),
                ('BACKGROUND', (offset + 1, 0), (offset + 2, 0), colors.black),
                ('TEXTCOLOR', (offset + 1, 0), (offset + 2, 0), colors.white),
        ]

        for idx, _ in enumerate(cls._actors):
            predominant_style += ente_style(idx * 3)

        table.setStyle(TableStyle(predominant_style))

        return table
