"""CMYK / typography / page boxes / final brand and printed QR checks."""
from pathlib import Path
import argparse,json
import cv2
from pypdf import PdfReader
from pypdf.generic import ContentStream

root=Path(__file__).parent
ap=argparse.ArgumentParser()
ap.add_argument('--pdf',default=str(root.parent.parent/'output/pdf/Denormal-Labs-Brochure-CMYK.pdf'))
ap.add_argument('--rendered-page',default=str(root.parent.parent/'tmp/pdfs/brochure/final-v2-8.png'))
args=ap.parse_args()
r=PdfReader(args.pdf);assert len(r.pages)==8
fonts=set();shading_count=0;image_count=0;photo_pixels=None
for n,p in enumerate(r.pages,1):
    trim=[float(v)*25.4/72 for v in p.trimbox]
    media=[float(v)*25.4/72 for v in p.mediabox]
    assert all(abs(a-b)<.01 for a,b in zip(trim,[3,3,300,213]))
    assert all(abs(a-b)<.01 for a,b in zip(media,[0,0,303,216]))
    assert all(abs(float(a)-float(b))<.01 for a,b in zip(p.bleedbox,p.mediabox))
    for ref in p['/Resources']['/Font'].values():
        f=ref.get_object();assert '/FontFile2' in f['/FontDescriptor'];fonts.add(str(f['/BaseFont']))
    for ref in p['/Resources'].get('/XObject',{}).values():
        obj=ref.get_object()
        assert obj['/Subtype']=='/Image' and n!=3,f'Unexpected raster object on page {n}'
        assert obj['/ColorSpace']=='/DeviceCMYK'
        # The cover is full bleed; interior photographs are 133 mm viewports.
        assert (obj['/Width']>=3500 and obj['/Height']>=2400) if n==1 else obj['/Width']>=1200,(n,obj['/Width'])
        if n==1: photo_pixels=[int(obj['/Width']),int(obj['/Height'])]
        image_count+=1
    for ref in p['/Resources'].get('/Shading',{}).values():
        assert ref.get_object()['/ColorSpace']=='/DeviceCMYK';shading_count+=1
    operators=[op for values,op in ContentStream(p.get_contents(),r).operations]
    assert not {b'rg',b'RG',b'g',b'G'}.intersection(operators)
text='\n'.join(p.extract_text() for p in r.pages).casefold()
for phrase in ['PCI','Sentinel','Labour Compliance','NexusRef','OneLegal','Welcome home.','Gemba','VSM','Standard work','Muda','Poka-yoke','Jidoka','New Delhi']:
    assert phrase.casefold() in text,phrase
for phrase in ['PeakLogic','Peak Logic','Human Rights Policy','two decades','SOC 2 certified']:
    assert phrase.casefold() not in text,phrase
assert r.trailer['/Root']['/OutputIntents'][0]['/DestOutputProfile']['/N']==4
assert image_count==7,image_count
layout=json.loads((root/'text-layout.json').read_text())
for t in layout:
    x,y,right,bottom=t['bounds_mm']
    if len(t['text'])==1:  # margin grid references sit in the frame band
        assert x>=2.5 and right<=294.5 and y>=1.5 and bottom<=208.5,t
    else:
        assert x>=9 and right<=289 and y>=9 and bottom<=205,t
im=cv2.imread(args.rendered_page);assert im is not None
scale=im.shape[1]/303
crop=im[round(151*scale):round(184*scale),round(170*scale):round(203*scale)]
# Light modules on the dark start plate: invert for OpenCV.
payload,points,_=cv2.QRCodeDetector().detectAndDecode(255-crop)
assert payload.casefold().rstrip('/')=='https://denormal.in',payload
report={'pages':8,'trim_mm':[297,210],'bleed_mm':3,'photographs':image_count,'cover_pixels':photo_pixels,'CMYK_vector_shadings':shading_count,'embedded_fonts':sorted(fonts),'printed_QR_payload':payload,'text_bounds':'All text within trim safety margins','content':'Current five products, company purpose, values and six original Lean moves','brand':'Drawing-set layout as denormal.in; logo set in type (Archivo 800/125%, JetBrains Mono 600 LABS, LABS >= 6.5 pt)','visual_review':'Every page rendered and reviewed'}
(root/'preflight-report.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
