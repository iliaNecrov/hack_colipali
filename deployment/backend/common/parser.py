import io
import os

import zipfile
import tempfile
import pymupdf

from typing import List, Dict
from PIL import Image


def get_pages_from_pdf(pdf: pymupdf.Document) -> List[Dict]:
    """
    Receive pages from .pdf document in following format: \n
    {
        "page": int,
        "text": "string",
        "image": PIL.Image
    }

    Parameters
    ----------
    pdf : pymupdf.Document

    name : str

    Returns
    -------
    List[Dict]
    """
    pages: List[Dict] = []

    for page in pdf:
        img = page.get_pixmap()
        img = Image.open(io.BytesIO(img.tobytes()))
        
        pages.append({
            "page": page.number,
            "text": page.get_textpage().extractText(),
            "image": img
        })

    return pages


def zip_bytes_to_pages(zip_bytes: bytes) -> List[Dict]:
    """
    Get .pdf files pages from .zip archive bytes in following format:\n
    {
        "name": "string",
        "page": int,
        "text": "string",
        "image": PIL.Image
    }

    Parameters
    ----------
    zip_bytes : bytes
        _description_

    Returns
    -------
    List[Dict]
        Pages.
    """
    
    pages: List[Dict] = []

    with tempfile.TemporaryDirectory() as tempdir:
        zipfile.ZipFile(io.BytesIO(zip_bytes)).extractall(tempdir)

        for filename in os.listdir(tempdir):        
            pdf = pymupdf.open(filename=tempdir + "/" + filename)
            
            pages.extend(get_pages_from_pdf(pdf))

    return pages
        

def pdf_bytes_to_pages(pdf_bytes: bytes, pdf_name: str) -> List[Dict]:
    """
    Get pages from .pdf file bytes in following format:\n
    {
        "name": "string",
        "page": int,
        "text": "string",
        "image": PIL.Image
    }

    Parameters
    ----------
    pdf_bytes : bytes
        _description_

    Returns
    -------
    List[Dict]
        Pages.
    """

    pdf = pymupdf.open(stream=pdf_bytes, filetype="pdf")

    pages = []
    for page in get_pages_from_pdf(pdf):
        pages.append({
            "name": pdf_name,
            "page": page["page"],
            "text": page["text"],
            "image": page["image"]
        })

    return pages