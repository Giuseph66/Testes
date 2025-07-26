import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import SquareModuleDrawer
from qrcode.image.styles.colormasks import SolidFillColorMask
from PIL import Image, ImageDraw, ImageColor

class HeartDrawer(SquareModuleDrawer):
    """
    Custom module drawer que desenha cada módulo (pixel ativo) do QR Code com a forma de um coração.
    """
    def drawrect(self, box, is_active):
        # Se o módulo não estiver ativo, nada é desenhado.
        if not is_active:
            return

        draw = self.imgDraw

        # Converte a cor para formato RGB, se necessário.
        fill = self.img.paint_color
        if isinstance(fill, str):
            fill = ImageColor.getrgb(fill)

        (x1, y1, x2, y2) = box
        w = x2 - x1
        h = y2 - y1

        # Define os pontos para um coração simples
        top_left  = (x1, y1 + 0.3 * h)
        top_midL  = (x1 + 0.25 * w, y1)
        top_midR  = (x1 + 0.75 * w, y1)
        top_right = (x1 + w, y1 + 0.3 * h)
        bottom    = (x1 + 0.5 * w, y1 + h)
        pontos = [top_left, top_midL, top_midR, top_right, bottom]

        draw.polygon(pontos, fill=fill)

def gerar_qrcode_coracoes(conteudo="https://atletica-psiconautas.netlify.app", saida="logo.png"):
    """
    Gera um QR Code com os módulos desenhados em forma de coração.
    
    :param conteudo: Conteúdo a ser codificado no QR Code.
    :param saida: Nome do arquivo onde o QR Code será salvo.
    """
    # Cria o objeto QRCode com os parâmetros desejados.
    qr = qrcode.QRCode(
        version=4,
        error_correction=qrcode.constants.ERROR_CORRECT_H,  # Alta correção de erro para permitir customizações sem comprometer a leitura
        box_size=20,
        border=2
    )
    qr.add_data(conteudo)
    qr.make(fit=True)

    # Definindo as cores como tuplas RGB:
    front_color = (0, 0, 0)       # Preto para os módulos ativos
    back_color = (255, 255, 255)  # Branco para o fundo

    # Gera a imagem do QR Code sem especificar o eye_drawer
    img_qr = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=HeartDrawer(),  # Customiza os módulos com corações
        color_mask=SolidFillColorMask(
            back_color=back_color,
            front_color=front_color
        )
    )

    # Salva a imagem gerada
    img_qr.save(saida)
    print(f"QR Code salvo em: {saida}")

if __name__ == "__main__":
    gerar_qrcode_coracoes()
